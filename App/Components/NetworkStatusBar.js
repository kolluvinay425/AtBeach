import React from 'react';
import ApplicationComponent from '../Containers/ApplicationComponent';
import {
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';

import stylesfactory from './Styles/NetworkStatusBarStyle';
import NetInfo from '@react-native-community/netinfo';
import StartupActions from '../Redux/StartupRedux';
import Icon from 'react-native-vector-icons/Ionicons';

class NetworkStatusBar extends ApplicationComponent {
  static propTypes = {
    isConnected: PropTypes.bool,
  };

  static defaultProps = {
    isConnected: false,
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.state = {
      ...this.state,
      isVisible: false,
    };

    NetInfo.configure({
      reachabilityUrl: 'https://clients3.google.com/generate_204',
      reachabilityTest: async response => response.status === 204,
      reachabilityLongTimeout: 30 * 1000, // 30s
      reachabilityShortTimeout: 3 * 1000, // 3s
      reachabilityRequestTimeout: 7 * 1000, // 7s
    });

    // FIRST FETCH
    NetInfo.fetch().then(state => {
      this.props.setConnectionStatus(state);
    });
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    // FUTURE UPDATES
    this.setState({
      isVisible:
        !newProps.connectionStatus.isConnected ||
        !newProps.connectionStatus.isInternetReachable,
    });
  }

  componentDidMount() {
    // EVENT LISTENER
    const unsubscribe = NetInfo.addEventListener(state => {
      this.props.setConnectionStatus(state);
    });
  }

  hideConnectionAlert = () => {
    this.props.forceConnectedStatus();
    // this.setState({isVisible: false});
    LayoutAnimation.easeInEaseOut();
  };

  render() {
    if (this.state.isVisible) {
      return this.state.reRender ? null : (
        <View style={this.styles.container}>
          <View />
          <Text style={this.styles.message}>{I18n.t('noconnection')}</Text>
          <TouchableOpacity
            onPress={this.hideConnectionAlert}
            style={this.styles.closeContainer}>
            <Icon style={this.styles.close} name="md-refresh" color="white" />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  connectionStatus: state.startup.connectionStatus,
});

const mapDispatchToProps = dispatch => ({
  setConnectionStatus: status =>
    dispatch(StartupActions.setConnectionStatus(status)),
  forceConnectedStatus: status =>
    dispatch(StartupActions.forceConnectedStatus()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetworkStatusBar);
