import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { DetailsList } from './DetailsList';

import { IDetailsList, IColumn, DetailsListLayoutMode, CheckboxVisibility } from './DetailsList.types';
import { IDetailsColumnProps } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsColumn';
import { IDetailsHeaderProps, DetailsHeader } from './DetailsHeader';
import { IRenderFunction } from '../../Utilities';
import { AnimationVariables } from '../../Styling';

const _columns: IColumn[] = [
  {
    key: 'key',
    minWidth: 8,
    name: 'key'
  },
  {
    key: 'name',
    minWidth: 8,
    name: 'name'
  },
  {
    key: 'value',
    minWidth: 8,
    name: 'value'
  }
];

// Populate mock data for testing
function mockData(count: number, isColumn: boolean = false, customDivider: boolean = false): any[] {
  const data = [];
  let _data = {};

  for (let i = 0; i < count; i++) {
    _data = {
      key: i,
      name: 'Item ' + i,
      value: i
    };
    if (isColumn) {
      _data = {
        ..._data,
        key: `column_key_${i}`,
        ariaLabel: `column_${i}`,
        onRenderDivider: customDivider ? customColumnDivider : columnDividerWrapper
      };
    }
    data.push(_data);
  }

  return data;
}

// Wrapper function which calls the defaultRenderer with the corresponding params
function columnDividerWrapper(
  iDetailsColumnProps: IDetailsColumnProps,
  defaultRenderer: (props?: IDetailsColumnProps) => JSX.Element | null
): any {
  return defaultRenderer(iDetailsColumnProps);
}

// Using a bar sign as a custom divider along with the default divider
function customColumnDivider(
  iDetailsColumnProps: IDetailsColumnProps,
  defaultRenderer: (props?: IDetailsColumnProps) => JSX.Element | null
): any {
  return (
    <React.Fragment key={`divider_${iDetailsColumnProps.columnIndex}`}>
      <span>|</span>
      {defaultRenderer(iDetailsColumnProps)}
    </React.Fragment>
  );
}

describe('DetailsList', () => {
  it('renders List correctly with onRenderDivider props', () => {
    DetailsList.prototype.componentDidMount = jest.fn();

    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        columns={mockData(5, true)}
        // tslint:disable-next-line:jsx-no-lambda
        onRenderRow={() => null}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
      />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders List with custom icon as column divider', () => {
    DetailsList.prototype.componentDidMount = jest.fn();

    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        columns={mockData(5, true, true)}
        // tslint:disable-next-line:jsx-no-lambda
        onRenderRow={() => null}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
      />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders List correctly', () => {
    DetailsList.prototype.componentDidMount = jest.fn();

    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        // tslint:disable-next-line:jsx-no-lambda
        onRenderRow={() => null}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
      />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders List in fixed constrained layout correctly', () => {
    DetailsList.prototype.componentDidMount = jest.fn();

    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        // tslint:disable-next-line:jsx-no-lambda
        onRenderRow={() => null}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
      />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders List in compact mode correctly', () => {
    DetailsList.prototype.componentDidMount = jest.fn();

    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        // tslint:disable-next-line:jsx-no-lambda
        onRenderRow={() => null}
        compact={true}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
      />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders List with hidden checkboxes correctly', () => {
    DetailsList.prototype.componentDidMount = jest.fn();

    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
        groups={[
          {
            key: 'group0',
            name: 'Group 0',
            startIndex: 0,
            count: 2
          },
          {
            key: 'group1',
            name: 'Group 1',
            startIndex: 2,
            count: 3
          }
        ]}
        checkboxVisibility={CheckboxVisibility.hidden}
      />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders updates correctly', () => {
    jest.useFakeTimers();

    const testItems = mockData(5);
    const detailsList = mount(
      <DetailsList
        items={testItems}
        columns={_columns}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
      />
    );

    const modifiedTestItems = testItems.slice();
    modifiedTestItems[0] = { ...modifiedTestItems[0], ...{ key: 'newKey 0', name: 'newName 0' } };
    const endIndex = modifiedTestItems.length - 1;
    modifiedTestItems[endIndex] = { ...modifiedTestItems[endIndex], ...{ name: 'newName ' + endIndex } };
    detailsList.setProps({ items: modifiedTestItems });
    detailsList.update();

    setTimeout(() => {
      expect(detailsList.getDOMNode()).toMatchSnapshot();
      // triple the length of the longest animation, to wait for update animations to finish, which should take only double
      // also convert to ms
    }, Number(AnimationVariables.durationValue4) * 3 * 1000);
    jest.runOnlyPendingTimers();
  });

  it('focuses row by index', () => {
    jest.useFakeTimers();

    let component: any;
    mount(
      <DetailsList
        items={mockData(5)}
        // tslint:disable-next-line:jsx-no-lambda
        componentRef={ref => (component = ref)}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
      />
    );

    expect(component).toBeDefined();
    (component as IDetailsList).focusIndex(2);
    setTimeout(() => {
      expect(document.activeElement.querySelector('[data-automationid=DetailsRowCell]')!.textContent).toEqual('2');
      expect(document.activeElement.className.split(' ')).toContain('ms-DetailsRow');
    }, 0);
    jest.runOnlyPendingTimers();
  });

  it('invokes optional onRenderMissingItem prop once per missing item rendered', () => {
    const onRenderMissingItem = jest.fn();
    const items = [...mockData(5), null, null];

    mount(<DetailsList items={items} skipViewportMeasures={true} onRenderMissingItem={onRenderMissingItem} />);

    expect(onRenderMissingItem).toHaveBeenCalledTimes(2);
  });

  it('does not invoke optional onRenderMissingItem prop if no missing items are rendered', () => {
    const onRenderMissingItem = jest.fn();
    const items = mockData(5);

    mount(<DetailsList items={items} skipViewportMeasures={true} onRenderMissingItem={onRenderMissingItem} />);

    expect(onRenderMissingItem).toHaveBeenCalledTimes(0);
  });

  it('focuses into row element', () => {
    const onRenderColumn = (item: any, index: number, column: IColumn) => {
      let value = item && column && column.fieldName ? item[column.fieldName] : '';
      if (value === null || value === undefined) {
        value = '';
      }
      return (
        <div className={'test-column'} data-is-focusable={true}>
          {value}
        </div>
      );
    };

    jest.useFakeTimers();

    let component: any;
    mount(
      <DetailsList
        items={mockData(5)}
        // tslint:disable-next-line:jsx-no-lambda
        componentRef={ref => (component = ref)}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
        onRenderItemColumn={onRenderColumn}
      />
    );

    expect(component).toBeDefined();
    (component as IDetailsList).focusIndex(3);
    setTimeout(() => {
      expect(document.activeElement.querySelector('[data-automationid=DetailsRowCell]')!.textContent).toEqual('3');
      expect(document.activeElement.className.split(' ')).toContain('ms-DetailsRow');
    }, 0);
    jest.runOnlyPendingTimers();

    // Set element visibility manually as a test workaround
    (component as IDetailsList).focusIndex(4);
    setTimeout(() => {
      (document.activeElement.children[1] as any).isVisible = true;
      (document.activeElement.children[1].children[0] as any).isVisible = true;
      (document.activeElement.children[1].children[0].children[0] as any).isVisible = true;
    }, 0);

    jest.runOnlyPendingTimers();
    (component as IDetailsList).focusIndex(4, true);
    setTimeout(() => {
      expect(document.activeElement.textContent).toEqual('4');
      expect(document.activeElement.className.split(' ')).toContain('test-column');
    }, 0);
    jest.runOnlyPendingTimers();
  });

  it('reset focusedItemIndex when setKey updates', () => {
    jest.useFakeTimers();

    let component: any;
    const detailsList = mount(
      <DetailsList
        items={mockData(5)}
        setKey={'key1'}
        initialFocusedIndex={0}
        // tslint:disable-next-line:jsx-no-lambda
        componentRef={ref => (component = ref)}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
      />
    );

    expect(component).toBeDefined();
    component.setState({ focusedItemIndex: 3 });
    setTimeout(() => {
      expect(component.state.focusedItemIndex).toEqual(3);
    }, 0);
    jest.runOnlyPendingTimers();

    // update props to new setKey
    const testItems = mockData(7);
    const newProps = { items: testItems, setKey: 'set2', initialFocusedIndex: 0 };
    detailsList.setProps(newProps);
    detailsList.update();

    // verify that focusedItemIndex is reset to 0 and 0th row is focused
    setTimeout(() => {
      expect(component.state.focusedItemIndex).toEqual(0);
      expect(document.activeElement.querySelector('[data-automationid=DetailsRowCell]')!.textContent).toEqual('0');
      expect(document.activeElement.className.split(' ')).toContain('ms-DetailsRow');
    }, 0);
    jest.runOnlyPendingTimers();
  });

  it('invokes optional onColumnResize callback per IColumn if defined when columns are adjusted', () => {
    const detailsList = mount(
      <DetailsList
        items={mockData(2)}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
      />
    );

    const columns: IColumn[] = mockData(2, true);
    columns[0].onColumnResize = jest.fn();
    columns[1].onColumnResize = jest.fn();

    // componentWillReceiveProps not executed on initial render in test
    // so we need to force one via setProps and update.
    const newProps = { columns };

    detailsList.setProps(newProps);
    detailsList.update();

    expect(columns[0].onColumnResize).toHaveBeenCalledTimes(1);
    expect(columns[1].onColumnResize).toHaveBeenCalledTimes(1);
  });

  it('invokes optional onRenderDetailsHeader prop to customize DetailsHeader rendering when provided', () => {
    const onRenderDetailsHeaderMock = jest.fn();

    mount(
      <DetailsList
        items={mockData(2)}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
        onRenderDetailsHeader={onRenderDetailsHeaderMock}
      />
    );

    expect(onRenderDetailsHeaderMock).toHaveBeenCalledTimes(1);
  });

  it('invokes optional onRenderColumnHeaderTooltip prop to customize DetailsColumn tooltip rendering when provided', () => {
    const NUM_COLUMNS = 2;
    const onRenderColumnHeaderTooltipMock = jest.fn();
    const onRenderDetailsHeader = (props: IDetailsHeaderProps, defaultRenderer?: IRenderFunction<IDetailsHeaderProps>) => {
      return <DetailsHeader {...props} onRenderColumnHeaderTooltip={onRenderColumnHeaderTooltipMock} />;
    };

    mount(
      <DetailsList
        items={mockData(NUM_COLUMNS)}
        skipViewportMeasures={true}
        // tslint:disable-next-line:jsx-no-lambda
        onShouldVirtualize={() => false}
        onRenderDetailsHeader={onRenderDetailsHeader}
      />
    );

    expect(onRenderColumnHeaderTooltipMock).toHaveBeenCalledTimes(NUM_COLUMNS);
  });
});
