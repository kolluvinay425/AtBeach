// @flow

import {Platform, StyleSheet} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';

import {ApplicationStyles, Fonts, Metrics} from '../../Themes';
import {Colors} from '../../Themes/Colors';

const isIOS = Platform.OS === 'ios';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      ...ApplicationStyles.screen,
      mainTabContainer: {
        backgroundColor: 'transparent',
        flex: 1,
        width: Metrics.windowWidth,
      },
      bigMessageContent: {
        fontSize: 18,
        fontFamily: Fonts.type.bold,
        color: 'white',
        width: Metrics.windowWidth - 2 * Metrics.doubleBaseMargin,
        backgroundColor: 'transparent',
        textAlign: 'center',
      },
      messageContent: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: Fonts.type.base,
        color: 'white',
        backgroundColor: 'transparent',
        textAlign: 'center',
      },
      fullButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        backgroundColor: Colors.activeButton,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Colors.activeButton,
        borderRadius: 999,
        paddingVertical: 12,
        paddingHorizontal: 32,
      },
      fullButtonText: {
        fontFamily: Fonts.type.bold,
        color: Colors.white,
        textAlign: 'center',
      },
    });
  }
}
