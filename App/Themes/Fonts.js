// @flow
import {Platform} from 'react-native';
import {Colors} from './Colors';
import metrics from './Metrics';

const type = {
  light: 'Montserrat-Light',
  base: 'Montserrat-Regular',
  bold: 'Montserrat-SemiBold',
  fancy: 'PlayfairDisplaySC-Regular',
  fancyBold: 'PlayfairDisplaySC-Bold',
  droid: 'DroidSerif',
  droidBold: 'DroidSerif-Bold',
  droidItalic: 'DroidSerif-Italic',
  droidBoldItalic: 'DroidSerif-BoldItalic',
};

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 28, // Math.round(Metrics.windowWidth * 0.075),
  h5: 24, // Math.round(Metrics.windowWidth * 0.0625),
  h6: 19,
  input: 22, // Math.round(Metrics.windowWidth * 0.059375),
  regular: 20, // Math.round(Metrics.windowWidth * 0.053),
  title: Platform.OS === 'ios' ? 17 : 18,
  medium: 16, // Math.round(Metrics.windowWidth * 0.04375),
  normal: 15, // Math.round(Metrics.windowWidth * 0.04),
  small: 14, // Math.round(Metrics.windowWidth * 0.0375),
  mini: 12, // Math.round(Metrics.windowWidth * 0.0375),
  tiny: 11, // Math.round(Metrics.windowWidth * 0.0281),
};

const height = {
  normal: 24,
};

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1,
  },
  h2: {
    fontWeight: 'bold',
    fontSize: size.h2,
  },
  h3: {
    fontFamily: type.base,
    fontSize: size.h3,
  },
  h4: {
    fontFamily: type.bold,
    fontSize: size.h4,
  },
  h5: {
    fontFamily: type.bold,
    fontSize: metrics.windowHeight > 750 ? size.h5 : size.regular,
  },
  h6: {
    fontFamily: type.bold,
    fontSize: size.h6,
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular,
  },
  description: {
    fontFamily: type.base,
    fontSize: metrics.windowHeight > 750 ? size.medium : size.small,
  },
  small: {
    fontFamily: type.base,
    fontSize: size.small,
  },
  navBarTitle: {
    fontFamily: type.base,
    fontSize: size.title,
  },
  bigNavBarTitle: {
    fontFamily: type.bold,
    fontSize: size.h4,
  },
  description2019: {
    color: Colors.text,
    fontSize: size.medium,
    fontFamily: type.light,
    lineHeight: height.normal,
  },
};

export default {
  type,
  size,
  style,
};
