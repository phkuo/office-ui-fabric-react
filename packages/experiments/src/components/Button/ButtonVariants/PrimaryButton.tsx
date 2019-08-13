import * as React from 'react';
import { createComponent } from '@uifabric/foundation';
import { useButtonState as state } from '../Button.state';
import {
  baseTokens,
  circularTokens,
  disabledTokens,
  hrefTokens,
  primaryCheckedTokens,
  primaryCircularTokens,
  primaryEnabledTokens,
  ButtonStyles as styles
} from '../Button.styles';
import { IButtonComponent, IButtonProps, IButtonTokenReturnType } from '../Button.types';
import { ButtonView } from '../Button.view';

export const PrimaryButtonTokens: IButtonComponent['tokens'] = (props, theme): IButtonTokenReturnType => [
  baseTokens,
  !!props.href && hrefTokens,
  primaryEnabledTokens,
  props.circular && circularTokens,
  props.circular && primaryCircularTokens,
  props.checked && primaryCheckedTokens,
  props.disabled && disabledTokens
];

export const PrimaryButton: React.StatelessComponent<IButtonProps> = createComponent(ButtonView, {
  displayName: 'PrimaryButton',
  state,
  styles,
  tokens: PrimaryButtonTokens
});
