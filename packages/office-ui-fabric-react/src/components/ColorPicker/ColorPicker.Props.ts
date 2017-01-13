export interface IColorPickerProps {
  /**
   * The CSS-compatible string to describe the initial color
   */
  color: string;

  /**
   * Callback issued when the user changes the color
   */
  onColorChanged?: (color: string) => void;

  /**
   * The setting of whether hide alpha control slider.
   */
  alphaSliderHidden?: boolean;
}
