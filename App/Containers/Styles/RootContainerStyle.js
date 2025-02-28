// @flow

import {StyleSheet} from 'react-native';
import {Fonts, Metrics} from '../../Themes/';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      applicationView: {
        flex: 1,
      },
      container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
      },
      welcome: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: Fonts.type.base,
        margin: Metrics.baseMargin,
      },
      myImage: {
        width: 200,
        height: 200,
        alignSelf: 'center',
      },
    });
  }
}
