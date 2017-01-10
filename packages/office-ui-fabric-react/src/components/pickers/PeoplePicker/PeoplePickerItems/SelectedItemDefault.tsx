/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import { Persona, PersonaSize, PersonaPresence } from '../../../../Persona';
import { IPeoplePickerItemProps } from './PeoplePickerItem.Props';
import { Button, ButtonType } from '../../../../Button';
import { css } from '../../../../utilities/css';
import './PickerItemsDefault.scss';

export const SelectedItemDefault: (props: IPeoplePickerItemProps) => JSX.Element = (peoplePickerItemProps: IPeoplePickerItemProps) => {
  let {
    item,
    onRemoveItem,
    index,
    selected
  } = peoplePickerItemProps;
  return (
    <div
      className={ css('ms-PickerPersona-container', {
        'is-selected': selected
      }) }
      data-is-focusable={ true }
      data-selection-index={ index } >
      <div className='ms-PickerItem-content'>
        <Persona
          { ...item }
          presence={ item.presence !== undefined ? item.presence : PersonaPresence.none }
          size={ PersonaSize.extraSmall }
          />
      </div>
      <Button
        onClick={ () => { if (onRemoveItem) { onRemoveItem(); } } }
        icon={ 'Cancel' }
        buttonType={ ButtonType.icon }
        className='ms-PickerItem-content'
        data-is-focusable={ false }
        >
      </Button>
    </div >
  );
};