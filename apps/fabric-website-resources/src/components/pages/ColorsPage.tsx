import * as React from 'react';
import './ColorsPage.global.scss';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { IHSV, IColor } from 'office-ui-fabric-react/lib/utilities/color/interfaces';
import { getColorFromString, getColorFromHSV, getColorFromRGBA, MAX_COLOR_RGB } from 'office-ui-fabric-react/lib/utilities/color/colors';

import { getContrastRatio } from 'office-ui-fabric-react/lib/utilities/color/shades';

import { ColorPicker } from 'office-ui-fabric-react/lib/ColorPicker';

interface ISubTheme {
  background: IColor;
  text: IColor;
  border: IColor;
  backgroundHovered: IColor;
  textHovered: IColor;
  borderHovered: IColor;
}

interface INewTheme {
  default: ISubTheme;
  oldButton: ISubTheme;
  newButton: ISubTheme;
  accentButton: ISubTheme;
}

/*
function wrapDecrement(i: number, max: number) {
  if (--i < 0) {
    return max;
  }
  return i;
}

function wrapIncrement(i: number, max: number) {
  if (++i >= max) {
    return 0;
  }
  return i;
}
*/

function _getAccessibleShade(from: IColor, ramp: Array<IColor>, startingIndex: number | IColor, minContrast: number): IColor {
  if (typeof startingIndex !== 'number') {
    startingIndex = ramp.indexOf(startingIndex);
    if (startingIndex === -1) {
      alert('_getAccessibleShade Error: startingIndex IColor not found in given ramp');
    }
  }

  if (startingIndex < 0) {
    startingIndex = 0;
  } else if (startingIndex >= ramp.length) {
    startingIndex = ramp.length - 1;
  }

  let maxCr = 0;
  let maxCrColor = ramp[startingIndex];

  const startingCr = getContrastRatio(ramp[startingIndex], from);
  if (startingCr >= minContrast) {
    return ramp[startingIndex];
  }
  maxCr = startingCr;

  // this parts starts by going down (lighter) first, therefore by default everything tries to go lighter
  // todo: make this a flag that you can pass in to decide whether you want to go lighter or darker first
  for (let i = startingIndex; i >= 0; i--) {
    const cr = getContrastRatio(ramp[i], from);
    if (cr > minContrast) {
      return ramp[i];
    }
    if (cr > maxCr) {
      maxCr = cr;
      maxCrColor = ramp[i];
    }
  }

  for (let i = startingIndex; i < ramp.length; i++) {
    const cr = getContrastRatio(ramp[i], from);
    if (cr > minContrast) {
      return ramp[i];
    }
    if (cr > maxCr) {
      maxCr = cr;
      maxCrColor = ramp[i];
    }
  }

  console.error('Color with sufficient contrast not found, using contrast of ' + maxCr + ' from ' + from.str + ' to ' + maxCrColor.str);
  return maxCrColor;
}

function clamp(value: number, max: number, min = 0): number {
  return value < min ? min : value > max ? max : value;
}

function _darken(hsv: IHSV, factor: number) {
  return getColorFromHSV({
    h: hsv.h,
    s: hsv.s,
    v: clamp(hsv.v - hsv.v * factor, 100)
  });
}

function _lighten(hsv: IHSV, factor: number) {
  return getColorFromHSV({
    h: hsv.h,
    s: clamp(hsv.s - hsv.s * factor, 100),
    v: clamp(hsv.v + (100 - hsv.v) * factor, 100)
  });
}

function _colorTowards(from: IColor, to: IColor, factor: number) {
  return getColorFromRGBA({
    r: clamp((1 - factor) * from.r + factor * to.r, MAX_COLOR_RGB),
    g: clamp((1 - factor) * from.g + factor * to.g, MAX_COLOR_RGB),
    b: clamp((1 - factor) * from.b + factor * to.b, MAX_COLOR_RGB),
    a: from.a
  });
}

// total number of shades in color ramp
const TOTAL_SHADES = 99;
// make primary/text colors go towards bg color (instead of just white or black)
const FANCY_RAMP = true;

export interface IColorsPageState {
  basePrimary: IColor;
  baseBackground: IColor;
  baseText: IColor;
  rampPrimary: Array<IColor>;
  rampBackground: Array<IColor>;
  rampText: Array<IColor>;

  isInverted: boolean;
}

export class ColorsPage extends BaseComponent<{}, IColorsPageState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      basePrimary: getColorFromString('#0078d4')!,
      baseBackground: getColorFromString('#fff')!,
      baseText: getColorFromString('#333')!,
      // ramps will be filled in by getDerivedStateFromProps
      rampPrimary: [],
      rampBackground: [],
      rampText: [],
      isInverted: false
    };
  }

  public componentDidUpdate = () => {
    this._setElementToBackground('page', 75);
    this._setElementToBackground('header', 75);
    this._setElementToBackground('nav1', 50);
    this._setElementToBackground('nav2', 25);
    this._setElementToBackground('pageContent', 0);
  };

  public componentDidMount = () => {
    this.componentDidUpdate();
  };

  public render = (): JSX.Element => {
    const { basePrimary, baseBackground, baseText, rampPrimary, rampBackground, rampText } = this.state;

    return (
      <div className="ms-themer">
        <div style={{ display: 'flex' }}>
          {this._baseColorSlotPicker(basePrimary.str, 'Primary')}
          {this._baseColorSlotPicker(baseBackground.str, 'Background')}
          {this._baseColorSlotPicker(baseText.str, 'Text')}
        </div>

        {this._renderRamp(rampPrimary)}
        {this._renderRamp(rampBackground)}
        {this._renderRamp(rampText)}

        <br />

        <div id={'page'}>
          <div id={'header'}>
            <h4>Header</h4>
            {this._renderSampleButtons()}
          </div>
          <div id={'nav1'}>
            <h4>nav1</h4>
            {this._renderSampleButtons()}
          </div>
          <div id={'nav2'}>
            <h4>nav2</h4>
            {this._renderSampleButtons()}
          </div>
          <div id={'pageContent'}>
            {/* #content is already being used */}
            <h4>pageContent</h4>
            {this._renderSampleButtons()}
          </div>
        </div>
      </div>
    );
  };

  public static getDerivedStateFromProps(props: any, state: IColorsPageState) {
    const { isInverted, baseBackground, basePrimary, baseText } = state;

    /* MAKE COLOR RAMPS */
    // bg ramp
    const rampBackground = new Array(TOTAL_SHADES);
    for (let i = 0; i < TOTAL_SHADES; i++) {
      const rampIndex = !isInverted ? i : TOTAL_SHADES - i;
      rampBackground[rampIndex] = !isInverted ? _darken(baseBackground, i / TOTAL_SHADES) : _lighten(baseBackground, i / TOTAL_SHADES);
    }

    // primary ramp
    const rampPrimary = new Array(TOTAL_SHADES);
    const middleIndex = Math.floor(TOTAL_SHADES / 2);
    // do the light half first
    for (let i = middleIndex; i >= 0; i--) {
      rampPrimary[i] =
        !isInverted && FANCY_RAMP
          ? _colorTowards(basePrimary, baseBackground, (middleIndex - i) / middleIndex)
          : _lighten(basePrimary, (middleIndex - i) / middleIndex);
    }
    // now do dark half
    for (let i = middleIndex; i < TOTAL_SHADES; i++) {
      rampPrimary[i] =
        !isInverted || !FANCY_RAMP
          ? _darken(basePrimary, (i - middleIndex) / middleIndex)
          : _colorTowards(basePrimary, baseBackground, (i - middleIndex) / middleIndex);
    }

    // primary ramp
    const rampText = new Array(TOTAL_SHADES);
    // do the light half first
    for (let i = middleIndex; i >= 0; i--) {
      rampText[i] =
        !isInverted && FANCY_RAMP
          ? _colorTowards(baseText, baseBackground, (middleIndex - i) / middleIndex)
          : _lighten(baseText, (middleIndex - i) / middleIndex);
    }
    // now do dark half
    for (let i = middleIndex; i < TOTAL_SHADES; i++) {
      rampText[i] =
        !isInverted || !FANCY_RAMP
          ? _darken(baseText, (i - middleIndex) / middleIndex)
          : _colorTowards(baseText, baseBackground, (i - middleIndex) / middleIndex);
    }
    /* END MAKE COLOR RAMPS */

    return {
      rampBackground,
      rampPrimary,
      rampText
    };
  }

  private _setElementToBackground = (id: string, background: number) => {
    const elem = document.getElementById(id);
    if (!elem) {
      alert('_setElementToBackground Error: element not found');
      return;
    }
    const theme = this._makeThemeFromBackground(background);

    elem.style.setProperty('--default-background', theme.default.background.str);
    elem.style.setProperty('--default-text', theme.default.text.str);
    elem.style.setProperty('--default-border', theme.default.border.str);

    elem.style.setProperty('--oldButton-background', theme.oldButton.background.str);
    elem.style.setProperty('--oldButton-text', theme.oldButton.text.str);
    elem.style.setProperty('--oldButton-border', theme.oldButton.border.str);
    elem.style.setProperty('--oldButton-background-hovered', theme.oldButton.backgroundHovered.str);
    elem.style.setProperty('--oldButton-text-hovered', theme.oldButton.textHovered.str);
    elem.style.setProperty('--oldButton-border-hovered', theme.oldButton.borderHovered.str);

    elem.style.setProperty('--newButton-background', theme.newButton.background.str);
    elem.style.setProperty('--newButton-text', theme.newButton.text.str);
    elem.style.setProperty('--newButton-border', theme.newButton.border.str);
    elem.style.setProperty('--newButton-background-hovered', theme.newButton.backgroundHovered.str);
    elem.style.setProperty('--newButton-text-hovered', theme.newButton.textHovered.str);
    elem.style.setProperty('--newButton-border-hovered', theme.newButton.borderHovered.str);

    elem.style.setProperty('--accentButton-background', theme.accentButton.background.str);
    elem.style.setProperty('--accentButton-text', theme.accentButton.text.str);
    elem.style.setProperty('--accentButton-border', theme.accentButton.border.str);
    elem.style.setProperty('--accentButton-background-hovered', theme.accentButton.backgroundHovered.str);
    elem.style.setProperty('--accentButton-text-hovered', theme.accentButton.textHovered.str);
    elem.style.setProperty('--accentButton-border-hovered', theme.accentButton.borderHovered.str);

    console.log('Applied theme to ' + id + ':\n', theme);
  };

  /** from a chosen background index (in the bg ramp), make a theme out of it */
  private _makeThemeFromBackground = (index: number) => {
    if (index < 0 || index >= TOTAL_SHADES) {
      alert('_makeThemeFromBackground Error: out of bounds');
      index = 0;
    }

    const { rampBackground, rampPrimary, rampText } = this.state;
    // the index of the original user-chosen color for text/primary colors
    const startingIndex = Math.floor(TOTAL_SHADES / 2);

    // the strat here is the pick the closest color that fulfills the contrast ratio requirements
    const textCr = 4.5;
    const borderCr = 1.5;
    const hoverCr = 1.2;
    const backgroundCr = 3;

    const theme: INewTheme = {
      default: {
        background: rampBackground[index],
        text: _getAccessibleShade(rampBackground[index], rampText, startingIndex, textCr),
        border: _getAccessibleShade(rampBackground[index], rampBackground, 0, borderCr)
      } as ISubTheme, // stupid hack
      oldButton: {
        background: _getAccessibleShade(rampBackground[index], rampBackground, 0, backgroundCr),
        // text:
        border: getColorFromString('transparent')
      } as ISubTheme,
      newButton: {
        background: rampBackground[index]
        // text:
        // border:
      } as ISubTheme,
      accentButton: {
        background: _getAccessibleShade(rampBackground[index], rampPrimary, startingIndex, backgroundCr),
        // text:
        border: getColorFromString('transparent')
      } as ISubTheme
    };

    theme.oldButton = {
      ...theme.oldButton,
      text: _getAccessibleShade(theme.oldButton.background, rampText, startingIndex, textCr),
      backgroundHovered: _getAccessibleShade(theme.oldButton.background, rampBackground, theme.oldButton.background, hoverCr),
      // textHovered:
      borderHovered: getColorFromString('transparent')!
    };
    theme.oldButton.textHovered = _getAccessibleShade(theme.oldButton.backgroundHovered, rampText, theme.oldButton.text, textCr);

    theme.newButton = {
      ...theme.newButton,
      text: theme.default.text,
      border: theme.default.border,
      backgroundHovered: _getAccessibleShade(theme.default.background, rampBackground, theme.default.background, hoverCr),
      // textHovered: _getAccessibleShade(theme.default.text, rampText, theme.default.text, hoverCr),
      borderHovered: _getAccessibleShade(theme.default.border, rampBackground, theme.default.border, hoverCr)
    };
    theme.newButton.textHovered = _getAccessibleShade(theme.newButton.backgroundHovered, rampText, theme.newButton.text, textCr);

    theme.accentButton = {
      ...theme.accentButton,
      text: _getAccessibleShade(theme.accentButton.background, rampBackground, 0, textCr),
      backgroundHovered: _getAccessibleShade(theme.accentButton.background, rampPrimary, theme.accentButton.background, hoverCr),
      // textHovered:
      borderHovered: getColorFromString('transparent')!
    };
    theme.accentButton.textHovered = _getAccessibleShade(
      theme.accentButton.backgroundHovered,
      rampBackground,
      theme.accentButton.text,
      textCr
    );

    return theme;
  };

  private _renderSampleButtons = () => {
    return (
      <>
        <h4>Lorem Ipsum</h4>
        <hr />
        <button className={'old'}>{'Old'}</button>
        <br />
        <button className={'new'}>{'New'}</button>
        <br />
        <button className={'accent'}>{'Accent'}</button>
      </>
    );
  };

  private _renderRamp = (ramp: Array<IColor>): JSX.Element => {
    const totalWidth = 1000,
      cellWidth = totalWidth / ramp.length;

    const cells = [];
    for (let i = 0; i < ramp.length; i++) {
      cells.push(
        <div
          key={i}
          style={{
            display: 'inline-block',
            width: cellWidth,
            height: '100%',
            backgroundColor: ramp[i].str
          }}
        />
      );
    }

    return (
      <div
        style={{
          width: totalWidth + 'px',
          height: '15px'
        }}
      >
        {cells}
      </div>
    );
  };

  private _baseColorSlotPicker = (color: string, title: string): JSX.Element => {
    let colorChangeTimeout: number;

    const onChange = (ev: any, newColor: IColor): void => {
      if (colorChangeTimeout) {
        clearTimeout(colorChangeTimeout);
      }
      colorChangeTimeout = this._async.setTimeout(() => {
        const newState: any = {};
        newState['base' + title] = newColor;
        this.setState(newState);
      }, 20);
      // 20ms is low enough that you can slowly drag to change color and see that theme,
      // but high enough that quick changes don't get bogged down by a million changes inbetween
    };

    return (
      <div className="ms-themer-paletteSlot" key={title}>
        <h3>{title}</h3>
        <ColorPicker key={'baseslotcolorpicker' + title} color={color} onChange={onChange} />
      </div>
    );
  };
}
