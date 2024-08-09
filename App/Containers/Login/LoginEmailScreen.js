import React, {useState} from 'react';
import ApplicationComponent from '../ApplicationComponent';
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import I18n from 'i18n-js';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';

import icoMoonConfig from '../../../assets/fonts/selection.json';
import {
  capitalizeFirstLetter,
  validateEmail,
  validatePassword,
} from '../../Lib/Utilities';
import stylesfactory from '../Styles/LoginEmailScreenStyle';
import {Fonts, Images, Metrics} from '../../Themes';
import {Colors} from '../../Themes/Colors';
import UserAuthActions from '../../Redux/UserAuthRedux';
// import analytics from '@react-native-firebase/analytics';
import BackButton from '../../Components/Navigation/BackButton';
import MenuItem from '../../Components/MenuItem';
import DeviceInfo from 'react-native-device-info';

const OIcon = createIconSetFromIcoMoon(icoMoonConfig);
const REGISTER_URL = 'https://spiagge.innopa.it/users/sign_up';
const PWD_URL = 'https://spiagge.innopa.it/users/password/new';
const brandName = DeviceInfo.getBrand().toUpperCase();

type LoginEmailScreenProps = {
  isFetching: boolean,
  attemptLogin: () => void,
  locale: string,
  login: object,
};

class LoginEmailScreen extends ApplicationComponent {
  props: LoginEmailScreenProps;

  constructor(props: LoginEmailScreenProps) {
    super(props);

    this.styles = stylesfactory.getSheet();

    this.state = {
      ...this.state,
      email: '',
      password: '',
      errorEmail: '',
      errorEmailRequired: '',
      errorPassword: '',
      errorPasswordRequired: '',
      isModalOpen: false,
      isPwdModalOpen: false,
      showEmailMessage: false,
      showPwdMessage: false,
      isScrollEnable: true,
    };
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    headerLeft: <BackButton color={Colors.text} navigation={navigation} />,
    title: navigation.state.params.title ? navigation.state.params.title : '',
  });

  componentDidMount() {
    super._componentDidMount();
    // analytics().logEvent(`Page_${this.props.navigation.state.routeName}`, {});
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {userAuth, navigation} = this.props;
    const isError =
      userAuth.login.isFetching &&
      !newProps.userAuth.login.isFetching &&
      newProps.userAuth.login.error;

    if (isError) {
      this.setState({errorServer: I18n.t('errorLoginServer')});
    }
  }

  strip = str => str.replace(/^\s+|\s+$/g, '');

  handleLogin = () => {
    const {email, password} = this.state;

    const fixedEmail = this.strip(email.trim());
    const isEmailValid = validateEmail(fixedEmail);
    const isPasswordValid = validatePassword(password);

    this.setState({
      errorServer: '',
      errorEmail: '',
      errorEmailRequired: '',
      errorPassword: '',
      errorPasswordRequired: '',
    });

    if (!email) {
      this.setState({
        errorEmailRequired: I18n.t('fieldRequiredValidation'),
      });
    }
    if (!password) {
      this.setState({
        errorPasswordRequired: I18n.t('fieldRequiredValidation'),
      });
    }

    if (email && !isEmailValid) {
      this.setState({
        errorEmail: I18n.t('emailValidation'),
      });
    }
    if (password && !isPasswordValid) {
      this.setState({
        errorPassword: I18n.t('passwordValidation'),
      });
    }
    if (isEmailValid && isPasswordValid) {
      this.props.attemptLogin(fixedEmail, password);
    }
  };

  handleRegister = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  handleLostPassword = () => {
    this.setState({
      isPwdModalOpen: true,
    });
  };

  handleStateChange = state => {
    if (state.url.indexOf('/users') < 0) {
      this.setState({
        isModalOpen: false,
        showEmailMessage: true,
      });
    }
  };

  handlePwdStateChange = state => {
    if (state.url.indexOf('/users/password') < 0) {
      this.setState({
        isPwdModalOpen: false,
        showPwdMessage: true,
      });
    }
  };

  renderUserName = () => (
    <View style={this.styles.content}>
      <Text style={this.styles.label}>
        {capitalizeFirstLetter(I18n.t('email'))}
      </Text>
      <TextInput
        testID="email"
        style={this.styles.textInput}
        autoCapitalize="none"
        onChangeText={text => this.setState({email: text})}
        underlineColorAndroid="transparent"
        selectionColor={Colors.activeButton}
        returnKeyType="done"
        value={this.state ? this.state.email : ''}
        placeholder={I18n.t('emailPH')}
        placeholderTextColor={Colors.grey}
        onTouchStart={() => this.setState({isScrollEnable: false})}
        onEndEditing={() => this.setState({isScrollEnable: true})}
        caretHidden={brandName === 'XIAOMI' ? true : false}
      />
      <Text style={this.styles.error}>
        {this.state.errorEmailRequired || this.state.errorEmail}
      </Text>
    </View>
  );

  renderPassword = () => (
    <View style={this.styles.content}>
      <Text style={this.styles.label}>
        {capitalizeFirstLetter(I18n.t('password'))}
      </Text>
      <TextInput
        testID="password"
        style={this.styles.textInput}
        autoCapitalize="none"
        onChangeText={text => this.setState({password: text})}
        underlineColorAndroid="transparent"
        selectionColor={Colors.activeButton}
        returnKeyType="done"
        secureTextEntry
        value={this.state ? this.state.password : ''}
        placeholder={I18n.t('passwordPH')}
        placeholderTextColor={Colors.grey}
      />
      <Text style={this.styles.error}>
        {this.state.errorPasswordRequired || this.state.errorPassword}
      </Text>
    </View>
  );

  renderSeparator = () => <View style={this.styles.separator} />;

  renderLostPasswordModal = () => (
    <Modal
      animationType={'slide'}
      transparent
      onRequestClose={() => {}}
      visible={this.state.isPwdModalOpen}>
      <WebView
        ref={component => (this.webRef = component)}
        source={{
          uri: `${PWD_URL}?locale=${this.props.userAuth.locale}&app=1`,
        }}
        onNavigationStateChange={this.handlePwdStateChange}
      />
      <View style={this.styles.modalHeader}>
        <TouchableOpacity
          onPress={() =>
            this.setState({
              isPwdModalOpen: false,
            })
          }>
          <OIcon
            name="close"
            size={Metrics.icons.regular}
            color={Colors.activeButton}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );

  renderRegisterModal = () => (
    <Modal
      animationType={'slide'}
      transparent
      onRequestClose={() => {}}
      visible={this.state.isModalOpen}>
      <WebView
        ref={component => (this.webRef = component)}
        source={{
          uri: `${REGISTER_URL}?locale=${this.props.userAuth.locale}&app=1`,
        }}
        onNavigationStateChange={this.handleStateChange}
      />
      <View style={this.styles.modalHeader}>
        <TouchableOpacity
          onPress={() =>
            this.setState({
              isModalOpen: false,
            })
          }>
          <OIcon
            name="close"
            size={Metrics.icons.regular}
            color={Colors.activeButton}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );

  render() {
    const {userAuth} = this.props;
    return this.state.reRender ? null : (
      <SafeAreaView>
        <View style={{...this.styles.mainTabContainer, paddingTop: 50}}>
          <Image
            source={Images.weAreInPuglia}
            style={{
              width: Metrics.windowWidth / 2,
              height: 30,
              marginTop: -30,
              marginBottom: 20,
              marginLeft: 0,
              resizeMode: 'contain',
            }}
          />
          <KeyboardAwareScrollView
            style={{width: Metrics.windowWidth - Metrics.doubleBaseMargin * 2}}
            enableOnAndroid={true}
            scrollEnabled={this.state.isScrollEnable} // FIXES XIAOMI BUG https://github.com/facebook/react-native/issues/27204
          >
            <Text style={[Fonts.style.normal, {marginBottom: 50}]}>
              {I18n.t('loginScreen_titleReserved')}
            </Text>
            {this.renderUserName()}
            {this.renderSeparator()}
            {this.renderPassword()}
            <Text style={this.styles.error}>{this.state.errorServer}</Text>
            <TouchableOpacity
              testID="loginbutton"
              style={this.styles.button}
              onPress={this.handleLogin}>
              <Text style={this.styles.text}>{I18n.t('signIn')}</Text>
            </TouchableOpacity>

            {/*<TouchableOpacity*/}
            {/*  style={this.styles.activeContainer}*/}
            {/*  onPress={this.handleRegister}*/}
            {/*>*/}
            {/*  <Text style={this.styles.activeText}>{I18n.t("register")}</Text>*/}
            {/*</TouchableOpacity>*/}
            {/*<TouchableOpacity*/}
            {/*  style={this.styles.activeContainer}*/}
            {/*  onPress={this.handleLostPassword}*/}
            {/*>*/}
            {/*  <Text style={this.styles.activeText}>{I18n.t("lostpwd")}</Text>*/}
            {/*</TouchableOpacity>*/}

            {this.state.showEmailMessage && (
              <View style={this.styles.infoTextContainer}>
                <Text style={this.styles.infoText}>
                  {I18n.t('emailMessage')}
                </Text>
              </View>
            )}
            {this.state.showPwdMessage && (
              <View style={this.styles.infoTextContainer}>
                <Text style={this.styles.infoText}>
                  {I18n.t('emailPwdMessage')}
                </Text>
              </View>
            )}
            {userAuth.login.isFetching ? (
              <ActivityIndicator
                animating={userAuth.login.isFetching}
                style={{height: 50}}
                color={Colors.grey}
                size="small"
              />
            ) : (
              <View style={{height: 50}} />
            )}
            {this.renderRegisterModal()}
            {this.renderLostPasswordModal()}
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  userAuth: state.userAuth,
  dietPreferences: state.dietPreferences,
});

const mapDispatchToProps = dispatch => ({
  attemptLogin: (username, password) =>
    dispatch(UserAuthActions.loginRequestEmail({username, password})),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginEmailScreen);
