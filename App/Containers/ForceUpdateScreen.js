// @flow

import React from 'react';
import ApplicationComponent from './ApplicationComponent';
import {
  ImageBackground,
  Linking,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';

import stylesfactory from './Styles/ForceUpdateScreenStyle';
import {Images} from '../Themes/';

const isIOS = Platform.OS === 'ios';

class ProfileBioScreen extends ApplicationComponent {
  static propTypes = {
    userAuth: PropTypes.object,
  };

  static defaultProps = {
    userAuth: {},
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.state = {
      ...this.state,
    };
  }

  static navigationOptions = () => ({
    headerStyle: {
      borderBottomWidth: 0,
      backgroundColor: 'transparent',
      elevation: 0,
    },
  });

  handlePress = () => {
    if (isIOS) {
      let locale = 'it';
      if (this.props.userAuth && this.props.userAuth.locale) {
        locale = this.props.userAuth.locale.split('-')[0];
      }
      Linking.openURL(
        `https://apps.apple.com/${locale}/app/inspiaggia/id1518640505`,
      );
    } else {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=it.innopa.inspiaggia',
      );
    }
  };

  renderContainer = () => (
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
        {I18n.t('updateTitle')}
      </Text>
      <Text style={[this.styles.messageContent, {marginVertical: 40}]}>
        {I18n.t('updateMessage')}
      </Text>
      <TouchableOpacity
        onPress={() => this.handlePress()}
        style={[this.styles.fullButton, {marginVertical: 6}]}>
        <Text style={this.styles.fullButtonText}>
          {I18n.t('updateAction').toUpperCase()}
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  );

  render() {
    if (isIOS) {
      return this.state.reRender ? null : (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          {this.renderContainer()}
        </View>
      );
    }
    return this.state.reRender ? null : this.renderContainer();
  }
}

const mapStateToProps = state => ({
  userAuth: state.userAuth,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileBioScreen);
