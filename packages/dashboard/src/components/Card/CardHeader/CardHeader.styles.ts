import { ICardHeaderProps, ICardHeaderStyles } from './CardHeader.types';
import { FontSize } from './CardHeader.types';
import { DefaultFontStyles } from 'office-ui-fabric-react/lib/Styling';

export const getStyles = (props: ICardHeaderProps): ICardHeaderStyles => {
  const { fontSize } = props;

  return {
    root: {
      overflow: 'hidden',
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: '22px',
      alignItems: 'baseline'
    },
    headerText: {
      fontSize: fontSize === FontSize.medium ? '16px' : '28px',
      lineHeight: '38px',
      fontFamily: DefaultFontStyles.medium.fontFamily,
      marginRight: '16px',
      color: '#000000',
      fontWeight: 'bold'
    },
    annotationText: {
      whiteSpace: 'noWrap',
      fontFamily: DefaultFontStyles.medium.fontFamily,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      fontSize: '12px',
      lineHeight: '16px',
      color: '#000000',
      paddingTop: '7px'
    }
  };
};
