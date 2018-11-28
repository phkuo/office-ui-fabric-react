import * as React from 'react';
import * as renderer from 'react-test-renderer';
import * as WarnUtil from '@uifabric/utilities/lib-commonjs/warn';
import * as ReactTestUtils from 'react-dom/test-utils';
import { mount } from 'enzyme';

import { resetIds } from '../../Utilities';
import { TextField } from './TextField';

describe('TextField deprecated', () => {
  beforeAll(() => {
    // Prevent warn deprecations from failing test
    jest.spyOn(WarnUtil, 'warnDeprecations').mockImplementation(() => {
      /** no impl **/
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    resetIds();
  });

  function mockEvent(targetValue: string = ''): ReactTestUtils.SyntheticEventData {
    const target: EventTarget = { value: targetValue } as HTMLInputElement;
    const event: ReactTestUtils.SyntheticEventData = { target };

    return event;
  }

  it('renders with deprecated props affecting styling', () => {
    const component = renderer.create(<TextField addonString={'test addonString'} iconClass={'test-iconClass'} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should call deprecated onChanged handler for input change', () => {
    let callCount = 0;
    const onChangedSpy = (value: string) => {
      callCount++;
    };

    const textField = mount(
      <TextField
        defaultValue="initial value"
        onChanged={onChangedSpy}
        // tslint:disable-next-line:jsx-no-lambda
        onGetErrorMessage={value => (value.length > 0 ? '' : 'error')}
      />
    );

    expect(callCount).toEqual(0);
    const inputDOM = textField.getDOMNode().querySelector('input') as Element;

    ReactTestUtils.Simulate.input(inputDOM, mockEvent('value change'));
    ReactTestUtils.Simulate.change(inputDOM, mockEvent('value change'));
    expect(callCount).toEqual(1);

    ReactTestUtils.Simulate.input(inputDOM, mockEvent(''));
    ReactTestUtils.Simulate.change(inputDOM, mockEvent(''));
    expect(callCount).toEqual(2);
  });

  it('should not call deprecated onChanged when initial value is undefined and input change is an empty string', () => {
    let callCount = 0;
    const onChangedSpy = (value: string) => {
      callCount++;
    };

    const textField = mount(<TextField onChanged={onChangedSpy} />);

    expect(callCount).toEqual(0);
    const inputDOM = textField.getDOMNode().querySelector('input') as Element;

    ReactTestUtils.Simulate.input(inputDOM, mockEvent(''));
    ReactTestUtils.Simulate.change(inputDOM, mockEvent(''));
    expect(callCount).toEqual(0);
  });
});
