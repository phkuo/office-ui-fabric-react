/* tslint:disable:no-unused-variable */
import * as React from 'react';
/* tslint:enable:no-unused-variable */
import { BaseComponent } from '../../../../common/BaseComponent';

import {
  TooltipHost,
  Button
} from '../../../../index';

export class TooltipBasicExample extends BaseComponent<any, any> {

  public render() {
    return (
      <div>
        <TooltipHost content='This is the tooltip' id='myID'>
          <Button aria-describedby='myID'>Hover Over Me</Button>
        </TooltipHost>
      </div>
    );
  }
}