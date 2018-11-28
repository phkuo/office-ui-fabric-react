/*! Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license. */
import * as React from 'react';
import Screener, { Steps } from 'screener-storybook/src/screener';
import { storiesOf } from '@storybook/react';
import { FabricDecorator } from '../utilities';
import { Label, ILabelProps } from 'office-ui-fabric-react';

storiesOf('Label', module)
  .addDecorator(FabricDecorator)
  .addDecorator(story => (
    <Screener
      steps={new Screener.Steps()
        .snapshot('default', { cropTo: '.testWrapper' })
        .end()
      }
    >
      {story()}
    </Screener>
  ))
  .addStory('Root', () => (<Label>I'm a label</Label>), { rtl: true })
  .addStory('Disabled', () => (<Label disabled>I'm a disabled label</Label>))
  .addStory('Required', () => (<Label required>I'm a required label</Label>));