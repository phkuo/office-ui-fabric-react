import * as React from 'react';
import {
  CommandButton,
  css,
  Customizer,
  Dropdown,
  getThemedContext,
  ICustomizerContext,
  ICustomizerProps,
  IDropdownOption,
  IDropdownStyles,
  ISchemeNames,
  ITheme
} from 'office-ui-fabric-react';
import { IThemeProviders, IThemeProviderProps, themeProvider } from '@uifabric/foundation';
import './ExampleCard.scss';
import { ExampleCardComponent, IExampleCardComponent } from './ExampleCardComponent';
import { Highlight } from '../Highlight/Highlight';
import { AppCustomizationsContext, IAppCustomizations } from '../../utilities/customizations';
import { CodepenComponent } from '../CodepenComponent/CodepenComponent';

export interface IExampleCardProps {
  /* Example Title */
  title: string;
  /* Experimental Component? */
  isOptIn?: boolean;
  /* Example Code as a string */
  code?: string;
  /* Children of the Example */
  children?: React.ReactNode;
  /* Example is Right-Aligned ? */
  isRightAligned?: boolean;
  /* Example dos */
  dos?: JSX.Element;
  /* Example don'ts */
  donts?: JSX.Element;
  /* Example is scrollable ? */
  isScrollable?: boolean;
  /* JS string for Codepen portion of Example */
  codepenJS?: string;
}

export interface IExampleCardState {
  isCodeVisible?: boolean;
  schemeIndex: number;
  themeIndex: number;
}

const _schemes: ISchemeNames[] = ['default', 'strong', 'soft', 'neutral'];

// TODO: once Foundation is promoted and in OUFR, ThemeProvider can be imported directly from OUFR
//        and themeProviders/ThemeProvider can be removed here
const themeProviders: IThemeProviders<ICustomizerContext, ITheme, ISchemeNames, ICustomizerProps> = {
  getThemedContext,
  CustomizerComponent: Customizer
};

export const ThemeProvider: React.StatelessComponent<IThemeProviderProps<ISchemeNames, ITheme>> = themeProvider<
  ICustomizerContext,
  ITheme,
  ISchemeNames,
  ICustomizerProps
>(themeProviders);

// tslint:disable-next-line:typedef
const regionStyles: IExampleCardComponent['styles'] = props => ({
  root: {
    backgroundColor: props.theme.semanticColors.bodyBackground,
    color: props.theme.semanticColors.bodyText
  }
});

// Match styling of button tabs
const dropdownStyles: Partial<IDropdownStyles> = {
  caretDownWrapper: {
    top: '6px'
  },
  title: [
    {
      alignItems: 'center',
      display: 'flex',
      height: 40,
      width: 150
    },
    'ExampleCard-themeDropdown'
  ]
};

export class ExampleCard extends React.Component<IExampleCardProps, IExampleCardState> {
  constructor(props: IExampleCardProps) {
    super(props);

    this.state = {
      isCodeVisible: false,
      schemeIndex: 0,
      themeIndex: 0
    };

    this._onToggleCodeClick = this._onToggleCodeClick.bind(this);
  }

  public render(): JSX.Element {
    const { title, code, children, isRightAligned = false, isScrollable = true, codepenJS } = this.props;
    const { isCodeVisible, schemeIndex, themeIndex } = this.state;

    const rootClass = 'ExampleCard' + (this.state.isCodeVisible ? ' is-codeVisible' : '');

    return (
      <AppCustomizationsContext.Consumer>
        {(context: IAppCustomizations) => {
          const { exampleCardCustomizations } = context;
          const activeCustomizations =
            exampleCardCustomizations && exampleCardCustomizations[themeIndex] && exampleCardCustomizations[themeIndex].customizations;

          const exampleCardContent = (
            <div
              className={css('ExampleCard-example', {
                'is-right-aligned': isRightAligned,
                'is-scrollable': isScrollable
              })}
              data-is-scrollable={isScrollable}
            >
              {children}
            </div>
          );

          const exampleCard = (
            <div className={rootClass}>
              <div className="ExampleCard-header">
                <span className="ExampleCard-title">{title}</span>
                <div className="ExampleCard-toggleButtons">
                  {codepenJS && <CodepenComponent jsContent={codepenJS} />}
                  {exampleCardCustomizations && (
                    <Dropdown
                      defaultSelectedKey={0}
                      onChange={this._onThemeChange}
                      // tslint:disable-next-line:no-any
                      options={exampleCardCustomizations.map((item: any, index: number) => ({
                        key: index,
                        text: 'Theme: ' + item.title
                      }))}
                      styles={dropdownStyles}
                    />
                  )}

                  {exampleCardCustomizations && (
                    <Dropdown
                      defaultSelectedKey={0}
                      onChange={this._onSchemeChange}
                      // tslint:disable-next-line:no-any
                      options={_schemes.map((item: any, index: number) => ({
                        key: index,
                        text: 'Scheme: ' + item
                      }))}
                      styles={dropdownStyles}
                    />
                  )}

                  {code && (
                    <CommandButton
                      iconProps={{ iconName: 'Embed' }}
                      onClick={this._onToggleCodeClick}
                      className={css('ExampleCard-codeButton', isCodeVisible && 'is-active')}
                    >
                      {isCodeVisible ? 'Hide code' : 'Show code'}
                    </CommandButton>
                  )}
                </div>
              </div>

              <div className="ExampleCard-code">{isCodeVisible && <Highlight>{code}</Highlight>}</div>

              {activeCustomizations ? (
                <ThemeProvider scheme={_schemes[schemeIndex]}>
                  <ExampleCardComponent styles={regionStyles}>{exampleCardContent}</ExampleCardComponent>
                </ThemeProvider>
              ) : (
                exampleCardContent
              )}

              {this._getDosAndDonts()}
            </div>
          );

          return activeCustomizations ? <Customizer {...activeCustomizations}>{exampleCard}</Customizer> : exampleCard;
        }}
      </AppCustomizationsContext.Consumer>
    );
  }

  private _getDosAndDonts(): JSX.Element | void {
    if (this.props.dos && this.props.donts) {
      return (
        <div className="ExampleCard-dosAndDonts">
          <div className="ExampleCard-dos">
            <h4>Do</h4>
            {this.props.dos}
          </div>
          <div className="ExampleCard-donts">
            <h4>Do not</h4>
            {this.props.donts}
          </div>
        </div>
      );
    }
  }

  private _onSchemeChange = (ev: React.MouseEvent<HTMLDivElement>, value: IDropdownOption) => {
    this.setState({ schemeIndex: value.key as number });
  };

  private _onThemeChange = (ev: React.MouseEvent<HTMLDivElement>, value: IDropdownOption) => {
    this.setState({ themeIndex: value.key as number });
  };

  private _onToggleCodeClick(): void {
    this.setState({
      isCodeVisible: !this.state.isCodeVisible
    });
  }
}
