// @flow

import React from 'react';
import {Animated, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Colors} from '../../Themes/Colors';
import stylesfactory from '../Styles/NavBar/BackButtonStyle';

const icon = require('../../Images/back-icon/back-icon.png');
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../../../assets/fonts/selection.json';
const OIcon = createIconSetFromIcoMoon(icoMoonConfig);

const propTypes = {
  screenName: PropTypes.string,
  navigation: PropTypes.object,
  color: PropTypes.any,
};

const defaultProps = {
  screenName: '',
  navigation: {},
  color: Colors.activeButton,
};

const BackButton = props => {
  const styles = stylesfactory.getSheet();

  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={() => props.navigation.goBack()}>
      {props.icon == 'close' ? (
        <OIcon name="close" size={34} color={props.color} />
      ) : (
        <Animated.Image
          style={[styles.icon, {tintColor: props.color}]}
          source={icon}
        />
      )}
    </TouchableOpacity>
  );
};

BackButton.propTypes = propTypes;
BackButton.defaultProps = defaultProps;

export default connect(
  () => ({}),
  dispatch => ({
    backAction: name => dispatch({type: 'CUSTOM_NAVIGATION_BACK', name}),
  }),
)(BackButton);
