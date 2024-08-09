// @flow

import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import PropTypes from 'prop-types';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import stylesfactory from './Styles/MenuItemStyle';
import {Fonts, Metrics} from '../Themes/';
import {Colors} from '../Themes/Colors';
import icoMoonConfig from '../../assets/fonts/selection.json';
import images from '../Themes/Images';

const OIcon = createIconSetFromIcoMoon(icoMoonConfig);

const propTypes = {
  title: PropTypes.string,
  iconName: PropTypes.string,
  onPress: PropTypes.func,
  noIcon: PropTypes.bool,
};

const defaultProps = {
  title: '',
  iconName: 'chevron-right',
  onPress: () => {},
  noIcon: false,
};

const MenuItem = props => {
  const styles = stylesfactory.getSheet();

  return (
    <View>
      <TouchableOpacity style={styles.menuItem} onPress={props.onPress}>
        {!props.noIcon ? (
          <MaterialIcon
            name={props.iconName}
            size={Metrics.icons.normal}
            color={Colors.blueText}
          />
        ) : null}
        <Text style={styles.menuItemText}>{props.title}</Text>
        <View />
        <MaterialIcon
          name={'chevron-right'}
          size={Metrics.icons.small}
          color={'black'}
        />
      </TouchableOpacity>
      {/* <View style={styles.separator} /> */}
    </View>
  );
};

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default MenuItem;
