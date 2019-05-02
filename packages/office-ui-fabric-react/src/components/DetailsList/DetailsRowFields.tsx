import * as React from 'react';
import { IColumn } from './DetailsList.types';
import { BaseComponent, css } from '../../Utilities';
import { IDetailsRowFieldsProps, IRowClassNames } from './DetailsRowFields.types';
import { DEFAULT_CELL_STYLE_PROPS } from './DetailsRow.styles';
import { AnimationClassNames, AnimationVariables } from '../../Styling';

const getCellText = (item: any, column: IColumn): string => {
  let value = item && column && column.fieldName ? item[column.fieldName] : '';

  if (value === null || value === undefined) {
    value = '';
  }

  return value;
};

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

export interface IDetailsRowFieldsState {
  /** the collection of columns that this row/item has */
  columns: IColumn[];
  /** the current contents of all cells */
  cellsContents: React.ReactNode[];
  /** the item that this row represents */
  item: any;
  renderingPhase?: DetailsRowFieldsRenderingPhase;
  oldColumns?: IColumn[];
  oldCellsContents?: React.ReactNode[];
  oldItem?: any;
}

export class DetailsRowFields extends BaseComponent<IDetailsRowFieldsProps, IDetailsRowFieldsState> {
  constructor(props: IDetailsRowFieldsProps) {
    super(props);
    this.state = {
      columns: { ...{}, ...props.columns },
      cellsContents: this._getCellsContents(props),
      item: { ...{}, ...props.item }
    };
  }

  public componentWillReceiveProps(nextProps: IDetailsRowFieldsProps) {
    this.setState({
      columns: nextProps.columns,
      cellsContents: this._getCellsContents(nextProps),
      item: nextProps.item,
      // when first called after ctor, set it to 0, otherwise it's new data and set it to 2
      renderingPhase:
        typeof this.state.renderingPhase === 'undefined'
          ? DetailsRowFieldsRenderingPhase.Rest
          : DetailsRowFieldsRenderingPhase.OldContentOutgoing,
      oldColumns: { ...{}, ...this.props.columns }, // get by value instead of by reference
      oldCellsContents: this.state.cellsContents.slice(0), // this._getCellsContents(this.props),
      oldItem: { ...{}, ...this.props.item }
    });
  }

  public componentDidUpdate() {
    if (this.state.renderingPhase) {
      this._async.setTimeout(() => {
        this.setState({ renderingPhase: this.state.renderingPhase! - 1 });
      }, parseFloat(AnimationVariables.durationValue4) * 2500 /* convert to ms */);
    }
  }

  public render(): JSX.Element {
    const { columns, rowClassNames, cellStyleProps = DEFAULT_CELL_STYLE_PROPS } = this.props;
    const { cellsContents, renderingPhase, oldColumns, oldCellsContents } = this.state;

    return (
      <div className={rowClassNames.fields} data-automationid="DetailsRowFields" role="presentation">
        {columns.map((column: IColumn, columnIndex) => {
          const width: string | number =
            typeof column.calculatedWidth === 'undefined'
              ? 'auto'
              : column.calculatedWidth +
                cellStyleProps.cellLeftPadding +
                cellStyleProps.cellRightPadding +
                (column.isPadded ? cellStyleProps.cellExtraRightPadding : 0);

          const oldColumn = oldColumns && oldColumns[columnIndex];
          let contentChanged = false;
          if (oldColumn && oldCellsContents) {
            // todo: can this be better?
            contentChanged = cellsContents[columnIndex] !== oldCellsContents[columnIndex];
          }

          if (!contentChanged) {
            return this._renderCell(column, columnIndex, rowClassNames, cellsContents[columnIndex], width);
          }

          switch (renderingPhase) {
            case DetailsRowFieldsRenderingPhase.OldContentOutgoing:
              return this._renderCell(
                oldColumns![columnIndex],
                columnIndex,
                rowClassNames,
                oldCellsContents![columnIndex],
                width,
                AnimationClassNames.slideRightOut40
              );
            case DetailsRowFieldsRenderingPhase.NewContentIncoming:
              return this._renderCell(
                column,
                columnIndex,
                rowClassNames,
                cellsContents[columnIndex],
                width,
                AnimationClassNames.slideLeftIn40
              );
            case DetailsRowFieldsRenderingPhase.Rest:
            default:
              return this._renderCell(column, columnIndex, rowClassNames, cellsContents[columnIndex], width);
          }
        })}
      </div>
    );
  }

  /** get the contents of a single cell */
  private _getCellContents = (column: IColumn) => {
    const { cellsByColumn, onRenderItemColumn, shimmer, item, itemIndex } = this.props;
    const { onRender = onRenderItemColumn } = column;

    return cellsByColumn && column.key in cellsByColumn
      ? cellsByColumn[column.key]
      : onRender && !shimmer
      ? onRender(item, itemIndex, column)
      : getCellText(item, column);
  };

  /** get the contents of all cells */
  private _getCellsContents = (props: IDetailsRowFieldsProps): React.ReactNode[] => {
    const { columns } = props;
    return columns.map(this._getCellContents);
  };

  private _renderCell = (
    column: IColumn,
    columnIndex: number,
    rowClassNames: IRowClassNames,
    cellContentsRender: any,
    width: string | number,
    withAnimationClass?: string
  ) => {
    const { columnStartIndex, shimmer } = this.props;
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
        {cellContentsRender}
      </div>
    );
  };
}
