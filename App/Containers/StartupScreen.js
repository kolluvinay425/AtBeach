// @flow

import {ActivityIndicator, ImageBackground, Platform} from 'react-native';
import {Images, Metrics} from '../Themes';
import React from 'react';
import ApplicationComponent from './ApplicationComponent';
import NetInfo from '@react-native-community/netinfo';
import {connect} from 'react-redux';
import {NavigationActions, StackActions} from 'react-navigation';
// import type { Notification, NotificationOpen } from 'react-native-firebase'; TODO !!!!!
// import SplashScreen from "react-native-smart-splash-screen";
import PropTypes from 'prop-types';
import StartupActions from '../Redux/StartupRedux';

const isIOS = Platform.OS === 'ios';

class ConnectedNavigationNavRouter extends ApplicationComponent {
  static propTypes = {
    isReady: PropTypes.bool,
    userAuth: PropTypes.object,
    dispatch: PropTypes.func,
    getNotifications: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.number,
    forceUpdate: PropTypes.bool,
    error: PropTypes.object,
  };

  static defaultProps = {
    isReady: false,
    userAuth: {},
    dispatch: () => {},
    name: '',
    id: undefined,
    forceUpdate: false,
    error: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      // hasError: false,
      navigateTo: null,
    };
  }

  componentDidMount() {
    super._componentDidMount();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {isReady, userAuth, forceUpdate, error, navigation} = newProps;

    if (forceUpdate) {
      navigation.navigate('ForceUpdate');
    } else if (isReady) {
      // ONLY ONCE IF THE STATE CHANGES

      if (userAuth.isOnBoardingViewed) {
        navigation.navigate('Map'); // COMMENTING THIS TEMP FOR INNOPA
      } else {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'OnBoardingScreen',
            }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      }
    }
  }

  componentWillUnmount() {
    if (this.subs) {
      this.subs.remove();
    }

    // if (this.notificationOpenedListener) {
    //   this.notificationOpenedListener();
    // }
    // this.notificationListener()
  }

  // componentDidCatch(error, info) {
  //   this.setState({hasError: true});
  // }

  getStatusMessage = code => {
    switch (code) {
      case 503:
        return 'Servizio temporaneamente non disponibile';
      default:
        return 'Qualcosa è andato storto';
    }
  };

  render() {
    return this.state.reRender ? null : (
      <ImageBackground
        testID="startup"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: Metrics.windowHeight,
          width: Metrics.windowWidth,
          justifyContent: 'flex-end',
          paddingBottom: Metrics.windowHeight / 6,
        }}
        source={Images.splash}>
        <ActivityIndicator animating style={{height: 80}} size="small" />
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  isReady: state.startup.isReady,
  error: state.startup.error,
  forceUpdate: state.startup.forceUpdate,
  userAuth: state.userAuth,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedNavigationNavRouter);
