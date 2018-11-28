/*! Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license. */
import * as React from 'react';
import Screener, { Steps } from 'screener-storybook/src/screener';
import { storiesOf } from '@storybook/react';
import { FabricDecorator } from '../utilities';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';

storiesOf('Spinner', module)
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
  )).addStory('Extra small', () => (
    <Spinner size={SpinnerSize.xSmall} />
  )).addStory('Small', () => (
    <Spinner size={SpinnerSize.small} />
  )).addStory('Medium', () => (
    <Spinner size={SpinnerSize.medium} />
  )).addStory('Large', () => (
    <Spinner size={SpinnerSize.large} />
  )).addStory('Label', () => (
    <Spinner
      size={SpinnerSize.medium}
      label='Spinner label'
    />
  ));