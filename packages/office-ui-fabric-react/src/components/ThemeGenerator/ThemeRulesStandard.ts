import { Shade } from '../../utilities/Color/Shades';
import { getColorFromString } from '../../utilities/Color/Colors';
import { mapEnumByName } from '../../utilities/object';

import { IThemeSlotRule } from './IThemeSlotRule';

export enum PaletteSlot {
  Primary,
  Neutral,
  Secondary
}

export enum SemanticSlot {
  Foreground,
  Background,

  InputEmphasizedBackground,
  InputEmphasizedBackgroundHover,
  InputEmphasizedForeground,
  InputEmphasizedForegroundHover,
  InputBackground,
  InputBackgroundHover,
  InputForeground,
  InputForegroundHover,
  DisabledBackground,
  DisabledForeground,

  EmphasizedBackground,
  EmphasizedForeground,

  NeutralBackground,
  NeutralForeground
}

/* The string we append to the palette color slots enum to get the name of the palette color slots. */
export const PaletteName = 'Palette';

export function getThemeSlotsStandard() {
  let slots = [];
  mapEnumByName(PaletteSlot, (paletteSlot) => {
    slots.push(paletteSlot + PaletteName);

    mapEnumByName(Shade, (shadeName) => {
      slots.push(paletteSlot + shadeName);
      return void 0;
    });

    return void 0;
  });
}

export function ThemeRulesStandardCreator() {
  let slotRules: Array<IThemeSlotRule> = [];

  /*** BASE PALETTE COLORS and their SHADES */
  // iterate through each palette slot and make the SlotRules for those
  mapEnumByName(PaletteSlot, (paletteSlot) => {
    // first make the SlotRule for the unshaded palette Color
    let paletteSlotName = paletteSlot + PaletteName;
    slotRules[paletteSlotName] = {
      name: paletteSlotName,
      isCustomized: true
    };

    // then make a rule for each shade of this palette color, but skip unshaded
    mapEnumByName(Shade, (shadeName, actualShade) => {
      if (shadeName === Shade[Shade.Unshaded]) {
        return;
      }
      slotRules[paletteSlot + shadeName] = {
        name: paletteSlot + shadeName,
        inherits: slotRules[paletteSlotName],
        asShade: actualShade,
        isCustomized: false
      };
      return void 0;
    });

    return void 0;
  });

  // set default colors for the palette
  slotRules[PaletteSlot[PaletteSlot.Primary] + PaletteName].value = getColorFromString('#0078d7');
  slotRules[PaletteSlot[PaletteSlot.Neutral] + PaletteName].value = getColorFromString('#888');
  slotRules[PaletteSlot[PaletteSlot.Secondary] + PaletteName].value = getColorFromString('#f00');

  /*** SEMANTIC SLOTS */
  function _makeSemanticSlotRule(semanticSlot: SemanticSlot, inherits: PaletteSlot, shade: Shade) {
    slotRules[SemanticSlot[semanticSlot]] = {
      name: SemanticSlot[semanticSlot],
      inherits: slotRules[PaletteSlot[inherits] + (shade !== Shade.Unshaded ? Shade[shade] : PaletteName)],
      isCustomized: false
    };
  }

  // Basics
  _makeSemanticSlotRule(SemanticSlot.Foreground, PaletteSlot.Neutral, Shade.Darkest);
  slotRules[SemanticSlot[SemanticSlot.Background]] = {
    name: SemanticSlot[SemanticSlot.Background],
    value: getColorFromString('#fff'),
    isCustomized: true
  };

  // Inputs
  _makeSemanticSlotRule(SemanticSlot.InputEmphasizedBackground,       PaletteSlot.Primary, Shade.Unshaded);
  _makeSemanticSlotRule(SemanticSlot.InputEmphasizedBackgroundHover,  PaletteSlot.Primary, Shade.Medium);
  _makeSemanticSlotRule(SemanticSlot.InputEmphasizedForeground,       PaletteSlot.Neutral, Shade.Lightest);
  _makeSemanticSlotRule(SemanticSlot.InputEmphasizedForegroundHover,  PaletteSlot.Neutral, Shade.Lighter);
  _makeSemanticSlotRule(SemanticSlot.InputBackground,       PaletteSlot.Neutral, Shade.Lighter);
  _makeSemanticSlotRule(SemanticSlot.InputBackgroundHover,  PaletteSlot.Neutral, Shade.Medium);
  _makeSemanticSlotRule(SemanticSlot.InputForeground,       PaletteSlot.Neutral, Shade.Darker);
  _makeSemanticSlotRule(SemanticSlot.InputForegroundHover,  PaletteSlot.Neutral, Shade.Darkest);
  _makeSemanticSlotRule(SemanticSlot.DisabledBackground, PaletteSlot.Neutral, Shade.Medium);
  _makeSemanticSlotRule(SemanticSlot.DisabledForeground, PaletteSlot.Neutral, Shade.Lightest);

  // Areas? Informational? Presentation?
  _makeSemanticSlotRule(SemanticSlot.EmphasizedBackground, PaletteSlot.Primary, Shade.Unshaded);
  _makeSemanticSlotRule(SemanticSlot.EmphasizedForeground, PaletteSlot.Neutral, Shade.Lightest);
  _makeSemanticSlotRule(SemanticSlot.NeutralBackground, PaletteSlot.Neutral, Shade.Lighter);
  _makeSemanticSlotRule(SemanticSlot.NeutralForeground, PaletteSlot.Neutral, Shade.Darker);

  return slotRules;
}