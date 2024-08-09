// @flow

import {StyleSheet} from 'react-native';
import ApplicationStyles from '../../../Themes/ApplicationStyles';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      ...ApplicationStyles.navBar,
    });
  }
}
