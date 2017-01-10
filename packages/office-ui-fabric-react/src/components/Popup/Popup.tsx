import * as React from 'react';
import { IPopupProps } from './Popup.Props';
import { KeyCodes } from '../../utilities/KeyCodes';
import { BaseComponent } from '../../common/BaseComponent';
import { getNativeProps, divProperties } from '../../Utilities';
import { doesElementContainFocus } from '../../utilities/focus';
import { getDocument } from '../../utilities/dom';

/**
 * This adds accessibility to Dialog and Panel controls
 */
export class Popup extends BaseComponent<IPopupProps, {}> {

  public static defaultProps: IPopupProps = {
    shouldRestoreFocus: true
  };

  public refs: {
    [key: string]: React.ReactInstance;
    root: HTMLElement;
  };

  private _originalFocusedElement: HTMLElement;
  private _containsFocus: boolean;

  public componentWillMount() {
    this._originalFocusedElement = getDocument().activeElement as HTMLElement;
  }

  public componentDidMount(): void {
    this._events.on(this.refs.root, 'keydown', this._onKeyDown);
    this._events.on(this.refs.root, 'focus', () => this._containsFocus = true, true);
    this._events.on(this.refs.root, 'blur', () => this._containsFocus = false, true);
    if (doesElementContainFocus(this.refs.root)) {
      this._containsFocus = true;
    }
  }

  public componentWillUnmount(): void {
    if (
      this.props.shouldRestoreFocus &&
      this._originalFocusedElement &&
      this._containsFocus &&
      this._originalFocusedElement as any !== window) {
      // This slight delay is required so that we can unwind the stack, let react try to mess with focus, and then
      // apply the correct focus. Without the setTimeout, we end up focusing the correct thing, and then React wants
      // to reset the focus back to the thing it thinks should have been focused.
      if (this._originalFocusedElement) {
        this._originalFocusedElement.focus();
      }
    }
  }

  public render() {
    let { role, className, ariaLabelledBy, ariaDescribedBy } = this.props;

    return (
      <div
        ref='root'
        { ...getNativeProps(this.props, divProperties) }
        className={ className }
        role={ role }
        aria-labelledby={ ariaLabelledBy }
        aria-describedby={ ariaDescribedBy }>
        { this.props.children }
      </div>
    );
  }

  private _onKeyDown(ev: React.KeyboardEvent<HTMLElement>) {
    switch (ev.which) {
      case KeyCodes.escape:

        if (this.props.onDismiss) {
          this.props.onDismiss();

          ev.preventDefault();
          ev.stopPropagation();
        }

        break;
    }
  }
}
