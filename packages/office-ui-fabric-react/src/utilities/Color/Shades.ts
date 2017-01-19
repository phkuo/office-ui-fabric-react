import {
  IColor,
  MAX_COLOR_RGBA
} from './IColor';
import * as Colors from './Colors';
import { assign } from '../object';

let hsv2hsl = require('color-functions/lib/hsv2hsl');
let hsl2rgb = require('color-functions/lib/hsl2rgb');

// Various constants used for generating shades of a color
const WhiteShadeTable = [0.95, 0.85, 0.75, 0.65, 0.50];
const BlackTintTable = [0.50, 0.65, 0.75, 0.85, 0.95];
const ColorTintTable = [0.20, 0.40, 0.60];
const ColorShadeTable = [0.75, 0.50];
const LumTintTable = [0.10, 0.25, 0.50, 0.75, 0.90];
const LumShadeTable = [0.90, 0.75, 0.50, 0.25, 0.10];
const c_LuminanceLow = 0.2;
const c_LuminanceHigh = 0.8;

/** Shades of a given color, from Lightest to Darkest. */
export enum Shade {
  Unshaded = 0,
  Lightest = 1,
  Lighter = 2,
  Medium = 3,
  Darker = 4,
  Darkest = 5
}

/**
 * Returns true if the argument is a valid Shade value
 * @param {Shade} shade The Shade value to validate.
 */
export function isValidShade(shade: Shade): boolean {
  'use strict';
  return (typeof shade === 'number') && (shade >= Shade.Unshaded) && (shade <= Shade.Darkest);
}

function _isBlack(color: IColor): boolean {
  return color.r === 0 && color.g === 0 && color.b === 0;
}

function _isWhite(color: IColor): boolean {
  return color.r === MAX_COLOR_RGBA && color.g === MAX_COLOR_RGBA && color.b === MAX_COLOR_RGBA;
}

function _darken(hsl: { h: number, s: number, l: number }, factor) {
  return {
    h: hsl.h,
    s: hsl.s,
    l: hsl.l * factor
  };
}

function _lighten(hsl: { h: number, s: number, l: number }, factor) {
  return {
    h: hsl.h,
    s: hsl.s,
    l: hsl.l * factor + (100 * (1 - factor))
  };
}

/**
 * Given a color and a shade specification, generates the requested shade of the color.
 * Logic: (todo formatting)
 * if white
 *  darken: [0.95, 0.85, 0.75, 0.65, 0.50]
 * if black
 *  lighten:[0.50, 0.65, 0.75, 0.85, 0.95]
 * if dark
 *  lighten:[0.10, 0.25, 0.50, 0.75, 0.90]
 * if bright
 *  darken: [0.90, 0.75, 0.50, 0.25, 0.10]
 * default
 *  lghtst lghtr med   drkr  drkst
 *  [0.20, 0.40, 0.60][0.75, 0.50]
 * @param {RgbaColor} color The base color whose Shade are to be computed
 * @param {Shade} shade The shade of the base color to compute.
 */
export function getShade(color: IColor, shade: Shade) {
  'use strict';
  if (!color) {
    return null;
  }

  if (shade === Shade.Unshaded || !isValidShade(shade)) {
    return color;
  }

  let hsl = hsv2hsl(color.h, color.s, color.v);
  let tableIndex = shade - 1;
  if (_isWhite(color)) { // white
    hsl = _darken(hsl, WhiteShadeTable[tableIndex]);
  } else if (_isBlack(color)) { // black
    hsl = _lighten(hsl, BlackTintTable[tableIndex]);
  } else if (hsl.l / 100 > c_LuminanceHigh) { // light
    hsl = _darken(hsl, LumShadeTable[tableIndex]);
  } else if (hsl.l / 100 < c_LuminanceLow) { // dark
    hsl = _lighten(hsl, LumTintTable[tableIndex]);
  } else { // default
    if (tableIndex < ColorTintTable.length) {
      hsl = _lighten(hsl, ColorTintTable[tableIndex]);
    } else {
      hsl = _darken(hsl, ColorShadeTable[tableIndex - ColorTintTable.length]);
    }
  }

  return Colors.getColorFromRGBA(assign(hsl2rgb(hsl.h, hsl.s, hsl.l), { a: color.a }));
}

/* Calculates the contrast ratio between two colors. Used for verifying
 * color pairs meet minimum accessibility requirements.
 * See: https://www.w3.org/TR/WCAG20/ section 1.4.3
 */
export function getContrastRatio(color1: IColor, color2: IColor) {
  // Formula defined by: http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#contrast-ratiodef
  // relative luminance: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef

  /* calculate the intermediate value needed to calculating relative luminance */
  function _getThing(x: number) {
    if (x <= .03928) {
      return x / 12.92;
    } else {
      return Math.pow((x + .055) / 1.055, 2.4);
    }
  }

  let r1 = _getThing(color1.r / MAX_COLOR_RGBA);
  let g1 = _getThing(color1.g / MAX_COLOR_RGBA);
  let b1 = _getThing(color1.b / MAX_COLOR_RGBA);
  let L1 = (.2126 * r1) + (.7152 * g1) + (.0722 * b1); // relative luminance of first color
  L1 += .05;

  let r2 = _getThing(color2.r / MAX_COLOR_RGBA);
  let g2 = _getThing(color2.g / MAX_COLOR_RGBA);
  let b2 = _getThing(color2.b / MAX_COLOR_RGBA);
  let L2 = (.2126 * r2) + (.7152 * g2) + (.0722 * b2); // relative luminance of second color
  L2 += .05;

  // return the lighter color divided by darker
  return L1 / L2 > 1 ?
    L1 / L2 : L2 / L1;
}