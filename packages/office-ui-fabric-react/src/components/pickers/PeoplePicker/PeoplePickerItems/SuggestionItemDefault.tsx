/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import { Persona, PersonaSize, IPersonaProps, PersonaPresence } from '../../../../Persona';
export const SuggestionItemNormal: (persona: IPersonaProps) => JSX.Element = (personaProps: IPersonaProps) => {
  return (
    <div className='ms-PeoplePicker-personaContent'>
      <Persona
        { ...personaProps }
        presence={ personaProps.presence !== undefined ? personaProps.presence : PersonaPresence.none }
        size={ PersonaSize.small }
        className={ 'ms-PeoplePicker-Persona' }
        />
    </div>
  );
};

export const SuggestionItemSmall: (persona: IPersonaProps) => JSX.Element = (personaProps: IPersonaProps) => {
  return (
    <div className='ms-PeoplePicker-personaContent'>
      <Persona
        { ...personaProps }
        presence={ personaProps.presence !== undefined ? personaProps.presence : PersonaPresence.none }
        size={ PersonaSize.extraSmall }
        className={ 'ms-PeoplePicker-Persona' }
        />
    </div>
  );
};