// @flow

import {Platform, StyleSheet} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';

import {ApplicationStyles, Fonts, Metrics} from '../../Themes';
import {Colors} from '../../Themes/Colors';
import {computeStateColor} from '../../Lib/Utilities';
const isIOS = Platform.OS === 'ios';

const CAROUSEL_WIDTH = Metrics.windowWidth;
const CARD_MARGIN = 6;
const CARD_WIDTH = CAROUSEL_WIDTH - CARD_MARGIN * 10;
const CARD_HEIGHT = 100;

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      ...ApplicationStyles.screen,
      container: {
        justifyContent: 'center',
        // height: CARD_HEIGHT,
        // paddingTop: 15,
        // paddingLeft: isIOS ? 15 : 20,
        paddingRight: 10,
        // paddingVertical: 10,
        marginVertical: 12,
        margin: 10,
        borderWidth: 1,
        borderColor: '#DFDFDF',
        borderRadius: 10,
      },
      containerShadow: {
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: {
          height: 0,
          width: 0,
        },
        elevation: 3,
      },
      image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        // marginRight: 10,
        margin: 10,
      },
      imageNotMap: {
        width: CARD_HEIGHT,
        height: CARD_HEIGHT,
        borderRadius: 10,
        marginRight: 7,
      },
      descriptionContainer: {
        justifyContent: 'space-between',
        alignItems: 'stretch',
        flexDirection: 'column',
        paddingBottom: 10,
        paddingTop: 10,
      },
      staticDescriptionContainer: {
        width: CARD_WIDTH - CARD_HEIGHT - 13,
      },
      name: {
        fontFamily: Fonts.type.base,
        fontSize: 17,
        lineHeight: 20,
      },
      locality: {
        fontSize: Fonts.size.mini,
        fontFamily: Fonts.type.light,
        lineHeight: 15,
        marginTop: 2,
      },
      tagsContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginTop: 5,
        paddingTop: 8,
        paddingRight: 5
      },
      iconContainer: {
        backgroundColor: 'white',
        borderRadius: 500,
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
          height: 0,
          width: 0,
        },
        elevation: 3,
        marginRight: -4
      },
      iconLengthTextWrap: {
        backgroundColor: Colors.blueText,
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 500,
      },
      iconLengthText: {
        color: 'white',
        fontSize: 10,
      },
      tag: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
        marginRight: 5,
      },
      statusContainer: {
        width: CARD_WIDTH - CARD_HEIGHT - 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginTop: 14,
      },
      statusNameContainer: {
        width: CARD_WIDTH - CARD_HEIGHT - 24,
      },
      statusTitle: {
        ...Fonts.style.small,
        fontFamily: Fonts.type.light,
        color: Colors.lightTextReadable,
        textAlign: 'right',
      },
      statusName: {
        fontFamily: Fonts.type.bold,
        fontSize: 16,
        textAlign: 'right',
        textTransform: 'capitalize',
        lineHeight: 20,
      },
      statusInfoContainer: {
        paddingLeft: Metrics.baseMargin,
      },
      statusInfoContent: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
      },
      statusInfoName: {
        fontFamily: Fonts.type.base,
        fontSize: 10,
        textTransform: 'uppercase',
      },
      statusInfoIconReports: {
        padding: 0,
        margin: 0,
        marginBottom: 2,
        color: Colors.lightTextReadable,
        marginRight: 3,
        marginLeft: 3,
      },
      statusInfoIconCertified: {
        padding: 0,
        margin: 0,
        marginBottom: 2,
        color: Colors.pinYellow,
        marginRight: 3,
      },
      statusUpdatedAt: {
        fontSize: 10,
        fontFamily: Fonts.type.light,
        textAlign: 'right',
        lineHeight: 20,
      },
      statusBar: {
        bottom: 2,
        right: 3,
        position: 'absolute',
        marginLeft: Metrics.baseMargin,
        width: 4,
        height: 53,
        borderRadius: 999,
        marginBottom: 3,
        marginRight: 5,
      },
    });
  }
}
