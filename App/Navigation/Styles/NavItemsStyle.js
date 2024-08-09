// @flow

import {StyleSheet} from 'react-native';
import {Metrics} from '../../Themes/';
import {Colors} from '../../Themes/Colors';

const navButton = {
  backgroundColor: Colors.transparent,
  justifyContent: 'center',
};

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      backButton: {
        ...navButton,
        marginTop: Metrics.baseMargin,
        marginLeft: Metrics.baseMargin,
      },
      searchButton: {
        ...navButton,
        marginTop: Metrics.section,
        marginRight: Metrics.baseMargin,
        alignItems: 'center',
      },
    });
  }
}
