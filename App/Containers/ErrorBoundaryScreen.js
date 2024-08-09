import React from 'react';
import ApplicationComponent from './ApplicationComponent';

import {
  Image,
  ImageBackground,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNRestart from 'react-native-restart';
import {Images, Metrics} from '../Themes/';
import {Colors} from '../Themes/Colors';
import stylesfactory from '../Components/Styles/EmptyContainerStyle';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import * as Sentry from '@sentry/react-native';
import {connect} from 'react-redux';
// import ErrorContainer from "../Components/ErrorContainer";

// import Error from "./error.png";

class ErrorBoundaryScreen extends ApplicationComponent {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    height: PropTypes.number,
    autoRestart: PropTypes.bool,
    style: PropTypes.object,
  };

  static defaultProps = {
    title: '',
    message: '',
    height: Metrics.windowHeight,
    autoRestart: true,
    style: {},
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();

    this.state = {
      ...this.state,
      error: false,
      message: '',
    };
  }

  componentDidCatch(err, errInfo) {
    // console.log(err);
    // console.log(errInfo);
    this.setState({
      error: true,
      message: errInfo.componentStack.toString(),
    });

    Sentry.captureException(err);

    this.props.expireCache();

    setTimeout(() => {
      if (!__DEV__ && this.props.autoRestart) {
        RNRestart.Restart();
      }
    }, 10000);
  }

  render() {
    const {height, style} = this.props;
    if (this.state.error) {
      return this.state.reRender ? null : (
        <ImageBackground
          style={[
            this.styles.mainTabContainer,
            {justifyContent: 'center', alignItems: 'center', padding: 22},
          ]}
          source={Images.bg}>
          <Image
            style={[{height: 155, width: 155, marginBottom: 30}]}
            source={Images.logo}
          />
          <Text style={[this.styles.bigMessageContent, {fontSize: 21}]}>
            {I18n.t('errorTitle')}
          </Text>
          <Text style={[this.styles.messageContent, {marginVertical: 40}]}>
            {I18n.t('errorMessage')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                `mailto:info@innopa.com?subject=BUG-APP&body=${I18n.t(
                  'errorReport_emailMessage',
                )}`,
              );
              RNRestart.Restart();
            }}
            style={[this.styles.fullButton, {marginVertical: 6}]}>
            <Text style={this.styles.fullButtonText}>
              {I18n.t('errorReport_resetButton')}
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      );
    }
    return this.props.children;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  expireCache: data => dispatch({type: 'EXPIRE_CACHE'}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorBoundaryScreen);
