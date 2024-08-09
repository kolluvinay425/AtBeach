import React from 'react';
import ApplicationComponent from '../../Containers/ApplicationComponent';
import {Platform, View} from 'react-native';
// import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import PropTypes from 'prop-types';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import {Colors} from '../../Themes/Colors';
import {connect} from 'react-redux';

import icoMoonConfig from '../../../assets/fonts/selection.json';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
const OIcon = createIconSetFromIcoMoon(icoMoonConfig);

const isIOS = Platform.OS === 'ios';

class TabIcon extends ApplicationComponent {
  static propTypes = {
    selected: PropTypes.bool,
    size: PropTypes.number,
    iconName: PropTypes.string,
    activeColor: PropTypes.string,
  };

  static defaultProps = {
    selected: false,
    activeColor: Colors.activeButton,
    size: 26,
    iconName: 'ios-home',
  };

  render() {
    const {selected, iconName, size, collectionName} = this.props;

    return this.state.reRender ? null : (
      <View
        style={{
          marginTop: 5,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingBottom: isIOS ? 0 : 5,
          width: 50,
        }}>
        {collectionName === 'FontAwesome5' ? (
          <FontAwesome5
            name={iconName}
            size={size}
            style={{color: selected ? Colors.activeButton : Colors.grey}}
          />
        ) : null}
        {collectionName === 'FontAwesome' ? (
          <FontAwesome
            name={iconName}
            size={size}
            style={{color: selected ? Colors.activeButton : Colors.grey}}
          />
        ) : null}
        {collectionName === 'Ionicons' ? (
          <Ionicons
            name={iconName}
            size={size}
            style={{color: selected ? Colors.activeButton : Colors.grey}}
          />
        ) : null}
        {collectionName === 'MaterialIcons' ? (
          <MaterialIcons
            name={iconName}
            size={size}
            style={{color: selected ? Colors.activeButton : Colors.grey}}
          />
        ) : null}
        {collectionName === 'inspiaggia' ? (
          <OIcon
            name={iconName}
            size={size}
            style={{color: selected ? Colors.activeButton : Colors.grey}}
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userAuth: state.userAuth,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabIcon);
