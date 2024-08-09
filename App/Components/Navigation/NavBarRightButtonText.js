// @flow

import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import {Colors} from '../../Themes/Colors';
import stylesfactory from '../Styles/NavBar/RightButtonTextStyle';

const propTypes = {
  navigation: PropTypes.object,
  color: PropTypes.any,
  text: PropTypes.any,
};

const defaultProps = {
  text: '',
  navigation: {},
  color: Colors.activeButton,
};

const NavBarRightButtonText = props => {
  const styles = stylesfactory.getSheet();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => props.onPressHandler()}>
      <Text style={styles.navBarRightButtonText}>{props.text}</Text>
    </TouchableOpacity>
  );
};

NavBarRightButtonText.propTypes = propTypes;
NavBarRightButtonText.defaultProps = defaultProps;

export default NavBarRightButtonText;
