import * as React from 'react';
import {
  DayOfWeek,
  ICalendar,
  ICalendarProps
} from './Calendar.Props';
import { CalendarDay } from './CalendarDay';
import { CalendarMonth } from './CalendarMonth';
import {
  autobind,
  BaseComponent,
  KeyCodes
} from '../../Utilities';
import './Calendar.scss';

export interface ICalendarState {
  /** The currently focused date in the calendar, but not necessarily selected */
  navigatedDate?: Date;
  /** The currently selected date in the calendar */
  selectedDate?: Date;
}

export class Calendar extends BaseComponent<ICalendarProps, ICalendarState> implements ICalendar {
  public static defaultProps: ICalendarProps = {
    onSelectDate: null,
    onDismiss: null,
    isMonthPickerVisible: true,
    value: null,
    firstDayOfWeek: DayOfWeek.Sunday,
    strings: null
  };

  public refs: {
    [key: string]: React.ReactInstance;
    root: HTMLElement;
    dayPicker: CalendarDay;
  };

  private _focusOnUpdate: boolean;

  constructor(props: ICalendarProps) {
    super();

    let currentDate = props.value && !isNaN(props.value.getTime()) ?
      props.value
      : new Date();
    this.state = {
      selectedDate: currentDate,
      navigatedDate: currentDate
    };

    this._focusOnUpdate = false;
  }

  public componentWillReceiveProps(nextProps: ICalendarProps) {
    let { value } = nextProps;

    this.setState({
      selectedDate: value || new Date()
    });
  }

  public componentDidUpdate() {
    if (this._focusOnUpdate) {
      this.refs.dayPicker.focus();
      this._focusOnUpdate = false;
    }
  }

  public render() {
    let rootClass = 'ms-DatePicker';
    let { firstDayOfWeek, strings } = this.props;
    let { selectedDate, navigatedDate } = this.state;

    return (
      <div className={ rootClass } ref='root'>
        <div className={ 'ms-DatePicker-picker ms-DatePicker-picker--opened ms-DatePicker-picker--focused ' + (this.props.isMonthPickerVisible ? 'is-monthPickerVisible' : '') } >
          <div className='ms-DatePicker-holder' onKeyDown={ this._onDatePickerPopupKeyDown }>
            <div className='ms-DatePicker-frame'>
              <div className='ms-DatePicker-wrap'>
                <CalendarDay
                  selectedDate={ selectedDate }
                  navigatedDate={ navigatedDate }
                  onSelectDate={ this._onSelectDate }
                  onNavigateDate={ this._onNavigateDate }
                  firstDayOfWeek={ firstDayOfWeek }
                  strings={ strings }
                  ref='dayPicker' />
                <CalendarMonth
                  navigatedDate={ navigatedDate }
                  strings={ strings }
                  onNavigateDate={ this._onNavigateDate } />
                <span
                  className='ms-DatePicker-goToday js-goToday'
                  onClick={ this._onGotoToday }
                  onKeyDown={ this._onGotoTodayKeyDown }
                  tabIndex={ 0 }>
                  { strings.goToToday }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public focus() {
    if (this.refs.dayPicker) {
      this.refs.dayPicker.focus();
    }
  }

  @autobind
  private _navigateDay(date: Date) {
    this.setState({
      navigatedDate: date
    });
  }

  @autobind
  private _onNavigateDate(date: Date, focusOnNavigatedDay: boolean) {
    this._navigateDay(date);
    this._focusOnUpdate = focusOnNavigatedDay;
  }

  @autobind
  private _onSelectDate(date: Date) {
    let { onSelectDate } = this.props;

    this.setState({
      selectedDate: date
    });

    if (onSelectDate) {
      onSelectDate(date);
    }
  };

  @autobind
  private _onGotoToday() {
    this._navigateDay(new Date());
    this._focusOnUpdate = true;
  };

  @autobind
  private _onGotoTodayKeyDown(ev: React.KeyboardEvent<HTMLElement>) {
    if (ev.which === KeyCodes.enter) {
      ev.preventDefault();
      this._onGotoToday();
    }
  };

  @autobind
  private _onDatePickerPopupKeyDown(ev: React.KeyboardEvent<HTMLElement>) {
    switch (ev.which) {
      case KeyCodes.enter:
        ev.preventDefault();
        break;

      case KeyCodes.backspace:
        ev.preventDefault();
        break;

      case KeyCodes.escape:
        this._handleEscKey(ev);
        break;

      default:
        break;
    }
  }

  @autobind
  private _handleEscKey(ev: React.KeyboardEvent<HTMLElement>) {
    if (this.props.onDismiss() != null) {
      this.props.onDismiss();
    }
  }
}
