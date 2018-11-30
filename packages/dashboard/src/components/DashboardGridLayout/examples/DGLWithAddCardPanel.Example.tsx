import * as React from 'react';
import {
  IDGLCard,
  ICardContentDetails,
  Priority,
  CardContentType,
  CardSize,
  DashboardGridLayoutWithAddCardPanel,
  DashboardGridBreakpointLayouts,
  IThumbnailItemProps
} from '@uifabric/dashboard';

// Cards information that go into the layout and add card panel
const cardFrameContent = {
  cardTitle: 'Example Card',
  cardDropDownOptions: [
    {
      key: 'Remove',
      name: 'Remove',
      icon: 'PageRemove',
      ariaLabel: 'Remove card',
      title: 'Remove card',
      onClick: () => {
        alert('Remove clicked');
      }
    }
  ]
};

const thumbnailItems: IThumbnailItemProps[] = [
  {
    imageSource: './src/images/download.jpg',
    subheaderText: 'First item',
    description: 'This is the first thumbnail item',
    handleThumbnailItemClick: () => {
      alert('First Item clicked');
    }
  },
  {
    imageSource: './src/images/download.jpg',
    subheaderText: 'Second item',
    description: 'Lorem ipsum dolor sit amet, ',
    handleThumbnailItemClick: () => {
      alert('Second Item clicked');
    }
  }
];

const getHeader = (name: string) => {
  return {
    headerText: 'Card ' + name,
    annotationText: 'Annotation Text '
  };
};

const contentAreaList: ICardContentDetails[] = [
  {
    priority: Priority.Priority1,
    cardContentType: CardContentType.BodyText,
    content: {
      subHeaderText: 'Subheader Text',
      bodyText: 'Body Text'
    }
  },
  {
    priority: Priority.Priority2,
    cardContentType: CardContentType.ThumbnailList,
    content: {
      thumbnailItems: thumbnailItems
    }
  }
];

let i = 0;

const cardsVisibleInLayout: IDGLCard[] = [
  {
    id: i++ + '',
    cardFrameContent: cardFrameContent,
    header: getHeader('0'),
    cardContentList: contentAreaList,
    cardSize: CardSize.small,
    x: 0,
    y: 0,
    addCardInfo: {
      addCardPanelBodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit magna aliqua',
      addCardPanelHeader: 'Lorem ipsum',
      addCardPanelImageUrl: '../../../../public/images/CompoundButtonStack.svg'
    }
  }
];

const cardsVisibleInAddCardPanel: IDGLCard[] = [
  {
    id: i++ + '',
    cardFrameContent: cardFrameContent,
    header: getHeader('6'),
    cardContentList: contentAreaList,
    cardSize: CardSize.small,
    x: 0,
    y: 0,
    addCardInfo: {
      addCardPanelBodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit magna aliqua',
      addCardPanelHeader: 'Ut enim ad minim veniam',
      addCardPanelImageUrl: '../../../../public/images/CompoundButtonStack.svg'
    }
  },
  {
    id: i++ + '',
    cardFrameContent: cardFrameContent,
    header: getHeader('7'),
    cardContentList: contentAreaList,
    cardSize: CardSize.small,
    x: 1,
    y: 0,
    addCardInfo: {
      addCardPanelBodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit magna aliqua',
      addCardPanelHeader: 'quis nostrud',
      addCardPanelImageUrl: '../../../../public/images/DetailsList.svg'
    }
  },
  {
    id: i++ + '',
    cardFrameContent: cardFrameContent,
    header: getHeader('8'),
    cardContentList: contentAreaList,
    cardSize: CardSize.mediumWide,
    x: 2,
    y: 0,
    addCardInfo: {
      addCardPanelBodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit magna aliqua',
      addCardPanelHeader: 'exercitation ullamco',
      addCardPanelImageUrl: '../../../../public/images/Donut.svg'
    }
  }
];

export interface IDGLWithAddCardPanelState {
  isOpen: boolean;
}

export class DGLWithAddCardPanelExample extends React.Component<{}, IDGLWithAddCardPanelState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  public render(): JSX.Element {
    return (
      <>
        <button onClick={this._openAddCardPanel}>Add Card</button>
        <DashboardGridLayoutWithAddCardPanel
          addCardPanelCards={cardsVisibleInAddCardPanel}
          dashboardCards={cardsVisibleInLayout}
          isOpen={this.state.isOpen}
          sectionTitle={'First section'}
          panelHeader={'Click to add cards to your dashboard'}
          onLayoutChange={this._onLayoutChange}
        />
      </>
    );
  }

  private _openAddCardPanel = () => {
    this.setState({ isOpen: true });
  };

  private _onLayoutChange(newLayout: DashboardGridBreakpointLayouts): void {
    console.log('The new layout is: ', newLayout);
  }
}
