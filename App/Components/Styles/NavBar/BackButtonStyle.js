// @flow

import {Platform, StyleSheet} from 'react-native';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      container: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      icon:
        Platform.OS === 'ios'
          ? {
              height: 20,
              width: 12,
              marginLeft: 20,
              marginRight: 22,
              marginVertical: 12,
              resizeMode: 'contain',
            }
          : {
              height: 24,
              width: 24,
              margin: 16,
              resizeMode: 'contain',
            },
    });
  }
}
