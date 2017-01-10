import * as React from 'react';
import { Button, ButtonType } from '../../../Button';
import { css } from '../../../utilities/css';
import { ISuggestionItemProps, ISuggestionsProps } from './Suggestions.Props';
import { BaseComponent } from '../../../common/BaseComponent';
import { Spinner } from '../../../Spinner';
import './Suggestions.scss';

export class SuggestionsItem<T> extends React.Component<ISuggestionItemProps<T>, {}> {
  public render() {
    let {
      suggestionModel,
      RenderSuggestion,
      onClick,
      className
    } = this.props;
    return (
      <Button
        onClick={ onClick }
        className={ css('ms-Suggestions-item', { 'is-suggested': suggestionModel.selected }, className) }
        >
        <RenderSuggestion { ...suggestionModel.item } />
      </Button>
    );
  }
}

export class Suggestions<T> extends BaseComponent<ISuggestionsProps<T>, {}> {

  protected _searchForMoreButton: Button;
  protected _selectedElement: HTMLDivElement;
  private SuggestionsItemOfProperType = SuggestionsItem as new (props: ISuggestionItemProps<T>) => SuggestionsItem<T>;

  constructor(suggestionsProps: ISuggestionsProps<T>) {
    super(suggestionsProps);
    this._getMoreResults = this._getMoreResults.bind(this);
  }

  public componentDidUpdate() {
    this.scrollSelected();
  }

  public render() {
    let {
      suggestionsHeaderText,
      searchForMoreText,
      className,
      moreSuggestionsAvailable,
      noResultsFoundText,
      suggestions,
      isLoading,
      loadingText,
      onRenderNoResultFound,
    } = this.props;

    let noResults: () => JSX.Element = noResultsFoundText ? () => <div className='ms-Suggestions-none'>
      { noResultsFoundText }
    </div> : null;

    return (
      <div className={ css('ms-Suggestions', className ? className : '') }>
        { suggestionsHeaderText ?
          (<div className='ms-Suggestions-title'>
            { suggestionsHeaderText }
          </div>) : (null) }
        { isLoading && (
          <Spinner
            className='ms-Suggestions-spinner'
            label={ loadingText }
            />) }
        { (!suggestions || !suggestions.length) && !isLoading ?
          (onRenderNoResultFound ? onRenderNoResultFound(null, noResults) : noResults()) :
          this._renderSuggestions()
        }
        { searchForMoreText && moreSuggestionsAvailable ?
          (<Button
            onClick={ this._getMoreResults.bind(this) }
            className={ 'ms-SearchMore-button' }
            buttonType={ ButtonType.icon }
            icon={ 'Search' }
            ref={ this._resolveRef('_searchForMoreButton') } >
            { searchForMoreText }
          </Button>) : (null)
        }
      </div>
    );
  }

  public focusSearchForMoreButton() {
    if (this._searchForMoreButton) {
      this._searchForMoreButton.focus();
    }
  }

  // TODO get the element to scroll into view properly regardless of direction.
  public scrollSelected() {
    if (this._selectedElement) {
      this._selectedElement.scrollIntoView(false);
    }
  }

  private _renderSuggestions(): JSX.Element {
    let {
      suggestions,
      onRenderSuggestion,
      suggestionsItemClassName } = this.props;
    let TypedSuggestionsItem = this.SuggestionsItemOfProperType;

    return (
      <div className='ms-Suggestions-container' id='suggestion-list' role='menu'>
        { suggestions.map((suggestion, index) =>
          <div ref={ this._resolveRef(suggestion.selected ? '_selectedElement' : '') }
            key={ index }
            id={ 'sug-' + index }
            role='menuitem'>
            <TypedSuggestionsItem
              suggestionModel={ suggestion }
              RenderSuggestion={ onRenderSuggestion }
              onClick={ (ev: React.MouseEvent<HTMLElement>) => this.props.onSuggestionClick(ev, suggestion.item, index) }
              className={ suggestionsItemClassName }
              />
          </div>) }
      </div>);
  }

  private _getMoreResults() {
    if (this.props.onGetMoreResults) {
      this.props.onGetMoreResults();
    }
  }

}