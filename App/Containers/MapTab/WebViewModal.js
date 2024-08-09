// @flow

import React from 'react';
import ApplicationComponent from '../ApplicationComponent';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import {Colors, Fonts, Images, Metrics} from '../../Themes';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import WebView from 'react-native-webview';
import {isIphoneX} from 'react-native-iphone-x-helper';

const isIOS = Platform.OS === 'ios';
const isIPhoneX = isIphoneX();

class WebViewModal extends ApplicationComponent {
  static propTypes = {
    closeHandler: PropTypes.func,
  };

  static defaultProps = {
    isFetchingCode: false,
    showHtmlInfo: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
    };
  }

  componentDidMount() {
    super._componentDidMount();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    // console.log("PROPS",this.props)
    // console.log("NEW PROPS", newProps)
    if (this.props.isVisible != newProps.isVisible && newProps.isVisible) {
      setTimeout(() => {
        this.setState({canRenderNow: true});
      }, 700);
    }

    if (this.props.isVisible != newProps.isVisible && !newProps.isVisible) {
      setTimeout(() => {
        this.setState({canRenderNow: false});
      }, 700);
    }
  }

  renderNavBar = () => {
    return (
      <View
        style={{
          justifyContent: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          // height: Metrics.navBarOverStatusHeight,
          paddingHorizontal: Metrics.doubleBaseMargin,
          paddingTop: isIOS
            ? isIPhoneX
              ? Metrics.navBarOverStatusPaddingTop + Metrics.baseMargin
              : Metrics.navBarOverStatusPaddingTop + Metrics.doubleBaseMargin
            : Metrics.doubleBaseMargin,
          paddingBottom: Metrics.doubleBaseMargin,
          // paddingBottom: isIOS ? 0 : 10,
          // marginTop: isIOS ? 0 : 13,
          // paddingTop: Metrics.navBarOverStatusPaddingTop+Metrics.doubleBaseMargin,
          // backgroundColor: 'transparent',
          // shadowColor: 'black',
          // shadowOpacity: 0.1,
          // shadowRadius: StyleSheet.hairlineWidth,
        }}>
        <TouchableOpacity
          style={{
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            backgroundColor: Colors.activeButton,
            borderRadius: 50,
          }}
          onPress={this.props.closeHandler}>
          <IconFeather
            size={30}
            name={'x'}
            style={{color: 'white', textAlign: 'center', height: 30, width: 30}}
          />
        </TouchableOpacity>
        <View>
          <Text
            style={{
              ...Fonts.style.h6,
              color: Colors.text,
              marginLeft: Metrics.doubleBaseMargin,
              lineHeight: 23,
            }}>
            {'Risorsa esterna'}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const {isVisible, url} = this.props;

    return this.state.reRender ? null : (
      <Modal
        isVisible={isVisible}
        onBackButtonPress={this.props.closeHandler}
        style={{
          backgroundColor: 'white',
          width: Metrics.windowWidth,
          height: Metrics.windowHeight,
          margin: 0,
        }}>
        <View style={{flex: 1}}>
          <StatusBar barStyle="dark-content" />
          {this.renderNavBar()}
          <WebView
            style={{
              width: Metrics.windowWidth,
              height: Metrics.windowHeight,
              flex: 1,
            }}
            source={{uri: url}}
          />
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WebViewModal);
