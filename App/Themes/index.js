// @flow

import {Colors} from './Colors';
import Fonts from './Fonts';
import Metrics from './Metrics';
import Images from './Images';
import ApplicationStyles from './ApplicationStyles';

let CURRENT_THEME = 'oreegano';

export function getCurrentTheme() {
  return CURRENT_THEME;
}

export function changeTheme(name) {
  if (name === 'hoover') {
    Colors.activeButton = Colors.hoover;
    CURRENT_THEME = name;
  }
  if (name === 'candy') {
    Colors.activeButton = Colors.candy;
    CURRENT_THEME = name;
  }
}

export {Colors, Fonts, Images, Metrics, ApplicationStyles, CURRENT_THEME};
