// @flow

import {Platform, StyleSheet} from 'react-native';
import {ApplicationStyles, Fonts, Metrics} from '../../Themes/';
import {Colors} from '../../Themes/Colors';

const isIOS = Platform.OS === 'ios';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      ...ApplicationStyles.screen,
      container: {
        position: 'absolute',
        backgroundColor: Colors.errorBackground,
        opacity: 0.9,
        width: Metrics.windowWidth,
        height: 30,
        top: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: isIOS ? Metrics.statusBarHeight : 0,
        paddingHorizontal: Metrics.baseMargin,
        elevation: 10,
      },
      message: {
        color: 'white',
        fontFamily: Fonts.type.bold,
        width: '100%',
        textAlign: 'center',
      },
      closeContainer: {
        position: 'absolute',
        right: 10,
        top: 0,
      },
      close: {
        color: 'white',
        fontSize: Fonts.size.input,
        fontFamily: Fonts.type.light,
        padding: 5,
        margin: 0,
      },
    });
  }
}
