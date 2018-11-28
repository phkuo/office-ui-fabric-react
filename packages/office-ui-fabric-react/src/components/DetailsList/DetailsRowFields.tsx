import * as React from 'react';
import { IColumn } from './DetailsList.types';
import { BaseComponent, css } from '../../Utilities';
import { IDetailsRowFieldsProps } from './DetailsRowFields.types';
import { DEFAULT_CELL_STYLE_PROPS } from './DetailsRow.styles';
import { AnimationClassNames, AnimationVariables } from '../../Styling';

export interface IDetailsRowFieldsState {
  columns: IColumn[];
  cellContent: React.ReactNode[];
  item: any;
  renderingPhase?: DetailsRowFieldsRenderingPhase;
  oldColumns?: IColumn[];
  oldCellContent?: React.ReactNode[];
  oldItem?: any;
}

/* When a column gets new data, we animate the transition. The old data slides out
  * and then the new data slides in. In order to do this, we remember the old data
  * whenever new props come in, in getDerivedStateFromProps(). Then we do rendering
  * in three phases:
  * 2. OldContentOutgiong: Render with the old data and animate it sliding out
  * 1. NewContentIncoming: Render the new data and slide it in
  * 0. Rest: resting state, remove all animation classes
  * Every render() call will move the rendering phase closer to the rest state.
  * The phases go 2->1->0 with a delay inbetween each to allow the animation to
  * complete. Each cell will also check to make sure it changed, if its contents
  * did not change, then it will not do any animation.
*/
export const enum DetailsRowFieldsRenderingPhase {
  OldContentOutgoing = 2,
  NewContentIncoming = 1,
  Rest = 0
}

export class DetailsRowFields extends BaseComponent<IDetailsRowFieldsProps, IDetailsRowFieldsState> {
  private static _getCellContent(props: IDetailsRowFieldsProps): React.ReactNode[] {
    const { columns, item, itemIndex, onRenderItemColumn, shimmer } = props;

    return columns.map(column => {
      let cellContent;

      try {
        const render = column.onRender || onRenderItemColumn;

        cellContent =
          render && !shimmer ? render(item, itemIndex, column) : DetailsRowFields._getCellText(item, column);
      } catch (e) {
        /* no-op */
      }

      return cellContent;
    });
  }

  private static _getCellText(item: any, column: IColumn): void {
    let value = item && column && column.fieldName ? item[column.fieldName] : '';

    if (value === null || value === undefined) {
      value = '';
    }

    return value;
  }

  constructor(props: IDetailsRowFieldsProps) {
    super(props);

    this.state = {
      columns: { ...{}, ...props.columns },
      cellContent: DetailsRowFields._getCellContent(props),
      item: { ...{}, ...props.item }
    };
  }

  public componentWillReceiveProps(nextProps: IDetailsRowFieldsProps) {
    this.setState({
      columns: nextProps.columns,
      cellContent: DetailsRowFields._getCellContent(nextProps),
      item: nextProps.item,
      // when first called after ctor, set it to 0, otherwise it's new data and set it to 2
      renderingPhase:
        typeof this.state.renderingPhase === 'undefined'
          ? DetailsRowFieldsRenderingPhase.Rest
          : DetailsRowFieldsRenderingPhase.OldContentOutgoing,
      oldColumns: { ...{}, ...this.props.columns }, // get by value instead of by reference
      oldCellContent: DetailsRowFields._getCellContent(this.props),
      oldItem: { ...{}, ...this.props.item }
    });
  }

  public render(): JSX.Element {
    const { item, columns, rowClassNames } = this.props;
    const { cellContent, renderingPhase, oldColumns, oldCellContent, oldItem } = this.state;

    if (renderingPhase) {
      this._async.setTimeout(() => {
        this.setState({ renderingPhase: renderingPhase - 1 });
      }, Number(AnimationVariables.durationValue4) * 1000 /* convert to ms */);
    }

    return (
      <div className={rowClassNames.fields}
        data-automationid="DetailsRowFields"
        role="presentation">
        {columns.map((column, columnIndex) => {
          const oldColumn = oldColumns && oldColumns[columnIndex];
          let contentChanged = false;
          if (oldItem && oldColumn) {
            contentChanged =
              DetailsRowFields._getCellText(item, column) !== DetailsRowFields._getCellText(oldItem, oldColumn);
          }
          switch (renderingPhase) {
            case DetailsRowFieldsRenderingPhase.OldContentOutgoing:
              if (contentChanged) {
                return this._renderCell(oldColumn!, columnIndex, oldCellContent!, AnimationClassNames.slideRightOut40);
              } else {
                return this._renderCell(column, columnIndex, cellContent);
              }
            case DetailsRowFieldsRenderingPhase.NewContentIncoming:
              if (contentChanged) {
                return this._renderCell(column, columnIndex, cellContent, AnimationClassNames.slideLeftIn40);
              } else {
                return this._renderCell(column, columnIndex, cellContent);
              }
            case DetailsRowFieldsRenderingPhase.Rest:
            default:
              return this._renderCell(column, columnIndex, cellContent);
          }
        })}
      </div>
    );
  }

  private _renderCell(
    column: IColumn,
    columnIndex: number,
    cellContent: React.ReactNode[],
    withAnimationClass?: string
  ) {
    const { columnStartIndex, shimmer, rowClassNames, cellStyleProps = DEFAULT_CELL_STYLE_PROPS } = this.props;

    const width: string | number =
      typeof column.calculatedWidth === 'undefined'
        ? 'auto'
        : column.calculatedWidth +
        cellStyleProps.cellLeftPadding +
        cellStyleProps.cellRightPadding +
        (column.isPadded ? cellStyleProps.cellExtraRightPadding : 0);

    return (
      <div
        key={columnIndex}
        role={column.isRowHeader ? 'rowheader' : 'gridcell'}
        aria-colindex={columnIndex + columnStartIndex + 1}
        className={css(
          column.className,
          column.isMultiline && rowClassNames.isMultiline,
          column.isRowHeader && rowClassNames.isRowHeader,
          column.isIconOnly && shimmer && rowClassNames.shimmerIconPlaceholder,
          shimmer && rowClassNames.shimmer,
          rowClassNames.cell,
          column.isPadded ? rowClassNames.cellPadded : rowClassNames.cellUnpadded,
          withAnimationClass
        )}
        style={{ width }}
        data-automationid="DetailsRowCell"
        data-automation-key={column.key}
      >
        {cellContent[columnIndex]}
      </div>
    );
  }
}
