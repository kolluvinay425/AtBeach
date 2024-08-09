/* official */
import React from 'react';
import ApplicationComponent from '../Containers/ApplicationComponent';
import {Text, TouchableOpacity, View} from 'react-native';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import PropTypes from 'prop-types';

import icoMoonConfig from '../../assets/fonts/selection.json';
import stylesfactory from './Styles/NavigationBarButtonStyle';

const OIcon = createIconSetFromIcoMoon(icoMoonConfig);

export default class NavigationBarButton extends ApplicationComponent {
  static propTypes = {
    iconName: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string,
    options: PropTypes.object,
    handler: PropTypes.func,
  };

  static defaultProps = {
    iconName: '',
    iconSize: 30,
    iconColor: 'white',
    options: {},
    handler: () => {},
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.state = {
      ...this.state,
    };
  }

  render() {
    if (this.props.options) {
      const {
        iconName,
        iconSize,
        iconColor,
        handler,
        title,
      } = this.props.options;
      return this.state.reRender ? null : (
        <TouchableOpacity style={this.styles.button} onPress={handler}>
          {iconName ? (
            <OIcon
              name={iconName}
              size={iconSize || 30}
              color={iconColor || 'white'}
            />
          ) : null}
          {title ? <Text style={this.styles.title}>{title}</Text> : null}
        </TouchableOpacity>
      );
    }
    return <View style={this.styles.button} />;
  }
}
