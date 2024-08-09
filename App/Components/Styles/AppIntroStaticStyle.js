// @flow

import {Platform, StyleSheet} from 'react-native';
import {Fonts, Metrics, Colors} from '../../Themes/';

const isIOS = Platform.OS === 'ios';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      header: {
        marginTop: isIOS ? Metrics.doubleBaseMargin : 0,
        height: Metrics.windowHeight * 0.3,
        justifyContent: 'center',
        backgroundColor: 'transparent',
      },
      info: {
        backgroundColor: 'transparent',
        height: Metrics.windowHeight * 0.4,
      },
      bg: {
        height: Metrics.windowHeight + 1,
        width: Metrics.windowWidth,
        backgroundColor: 'transparent',
      },
      bgContainer: {
        height: Metrics.windowHeight + 1,
        width: Metrics.windowWidth,
        // backgroundColor: 'rgba(0,0,0,0.4)',
      },
      title: {
        ...Fonts.style.h5,
        color: '#fff',
        // fontFamily: Fonts.type.bold,
        // fontSize: 25,
        paddingBottom: Metrics.tripleBaseMargin,
      },
      description: {
        ...Fonts.style.normal,
        color: '#fff',
        fontSize: 18,
      },
      full: {
        height: 56,
        backgroundColor: Colors.activeButton,
        borderRadius: 99,
        width: Metrics.windowWidth - 2 * Metrics.doubleBaseMargin,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        fontSize: Fonts.size.medium,
        fontFamily: Fonts.type.bold,
        color: Colors.white,
      },
    });
  }
}
