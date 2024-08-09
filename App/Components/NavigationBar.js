/* official */
import React from 'react';
import ApplicationComponent from '../Containers/ApplicationComponent';
import {Animated, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

import NavigationBarButton from './NavigationBarButton';
import stylesfactory from './Styles/NavigationBarStyle';

export default class NavigationBar extends ApplicationComponent {
  static propTypes = {
    title: PropTypes.string,
    style: PropTypes.object,
    titleStyle: PropTypes.object,
    actionContainerStyle: PropTypes.object,
    leftButton: PropTypes.object,
    rightButton: PropTypes.object,
    isAnimated: PropTypes.bool,
    colors: PropTypes.array,
  };

  static defaultProps = {
    title: '',
    style: {},
    titleStyle: {},
    actionContainerStyle: {},
    leftButton: null,
    rightButton: null,
    isAnimated: false,
    colors: [],
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.state = {
      ...this.state,
    };
  }

  render() {
    const MyView = this.props.isAnimated ? Animated.View : LinearGradient;
    return this.state.reRender ? null : (
      <MyView
        style={[this.styles.container, {...this.props.style}]}
        colors={this.props.colors}>
        <View
          style={[
            this.styles.titleContainer,
            {...this.props.titleContainerStyle},
          ]}>
          <Text style={[this.styles.title, {...this.props.titleStyle}]}>
            {this.props.title}
          </Text>
        </View>
        <View
          style={[
            this.styles.actionContainer,
            {...this.props.actionContainerStyle},
          ]}>
          <NavigationBarButton options={this.props.leftButton} />
          <View style={this.styles.rightActionContainer}>
            <NavigationBarButton options={this.props.rightButton} />
          </View>
        </View>
      </MyView>
    );
  }
}
