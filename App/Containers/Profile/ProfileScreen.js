import React, {useRef} from 'react';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';

import ApplicationComponent, {
  mapDispatchToPropsDefault,
  mapStateToPropsDefault,
} from '../ApplicationComponent';

import {
  Animated,
  Platform,
  SafeAreaView,
  Text,
  UIManager,
  View,
  PanResponder,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import {SearchBar} from 'react-native-elements';

import R from 'ramda';
import ActionSheet from 'react-native-actionsheet';

import {connect} from 'react-redux';
import I18n from 'i18n-js';
import Dialog, {ScaleAnimation} from 'react-native-popup-dialog';
import PropTypes from 'prop-types';
import analytics from '@react-native-firebase/analytics';

import DeviceInfo from 'react-native-device-info';

import BeachSpotActions from '../../Redux/BeachSpotRedux';

import stylesfactory from '../Styles/ProfilScreenStyle';

import MapView from 'react-native-map-clustering';
import {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  check as checkPermission,
  request as requestPermission,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

import moment from 'moment';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import renderWhenFocused from 'render-when-focused';
import {AuthModalContainer} from '../Login/AuthModalContainer';
import {LoginScreen} from '../Login/LoginScreen';
import MenuItem from '../../Components/MenuItem';
import {NavigationActions, StackActions} from 'react-navigation';
import UserAuthActions from '../../Redux/UserAuthRedux';
import {Fonts, Colors, Images, Metrics} from '../../Themes';
import {ProfileForm} from '../Login/AuthForms/ProfileForm';
import {color} from 'react-native-reanimated';
import metrics from '../../Themes/Metrics';
import Header from '../../Components/Header';

const isIOS = Platform.OS === 'ios';

class ProfileScreen extends ApplicationComponent {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();

    this.state = {
      ...this.state,
    };
  }

  static navigationOptions = ({navigation}) => ({
    tabBarOnPress: data => {
      const {scene} = data;
      if (scene.focused) {
        const stackNavigation = scene.route.routes[0];
        if (
          !!stackNavigation &&
          !!stackNavigation.params &&
          !!stackNavigation.params.scrollToTop
        ) {
          stackNavigation.params.scrollToTop();
        }
      } else {
        navigation.navigate({
          routeName: 'Map',
        });
      }
    },
  });

  componentDidMount() {
    super._componentDidMount();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    super._UNSAFE_componentWillReceiveProps(newProps);

    const isOK =
      this.props.userAuth.login.isFetching &&
      !newProps.userAuth.login.isFetching &&
      !newProps.userAuth.login.error &&
      newProps.userAuth.login.isLogged;

    // console.log("was isfetchin", this.props.userAuth.login.isFetching)
    // console.log("is isfetching", newProps.userAuth.login.isFetching)
    // console.log("is error", newProps.userAuth.login.error)
    // console.log("is islogged", newProps.userAuth.login.isLogged)

    if (isOK) {
      this.props.navigation.navigate({
        routeName: 'Home',
        key: `Always-push-${Math.random() * 10000}`,
      });
    }
  }

  handleLogout = () => {
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({routeName: 'Profile'}),
    //     NavigationActions.navigate({routeName: 'Explore'})
    //   ],
    // });
    // this.props.navigation.dispatch(resetAction);
    // this.props.navigation.navigate({routeName: 'StartUp'})

    this.props.logout();
    this.props.navigation.navigate({routeName: 'StartUp'});
  };
  showReservationScreen = () => {
    this.props.navigation.navigate({
      routeName: 'Reservations',
      // params: {
      //   id: beachSpot.id,
      // },
    });
  };
  render() {
    const {navigation, userAuth} = this.props;
    if (!userAuth.login.isLogged) {
      return <AuthModalContainer />;
    }

    if (userAuth.login.isLogged) {
      return this.state.reRender ? null : (
        <SafeAreaView
          style={{
            flex: 1,
            height: metrics.windowHeight,
            width: metrics.windowWidth,
          }}>
          <Header heading={I18n.t('tabs_profile')} />

          <View style={{padding: 30, alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: Colors.titleBlue,
                width: metrics.windowHeight > 750 ? 60 : 50,
                height: metrics.windowHeight > 750 ? 60 : 50,
                borderRa5ius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                // marginVertical: 10,
              }}>
              <Image
                source={Images.user}
                style={{width: 30, height: 30}}
                resizeMode={'cover'}
              />
            </View>

            <Text style={[Fonts.style.h6]}>{userAuth.details.name}</Text>
            <Text
              style={[
                Fonts.style.small,
                {
                  // marginTop: 10,
                  // marginBottom: 30,
                  color: Colors.lightTextReadable,
                },
              ]}>
              {userAuth.details.email}
            </Text>
          </View>
          <ScrollView bounces={isIOS}>
            {/*<MenuItem*/}
            {/*  title={I18n.t('reservations_heading')}*/}
            {/*  iconName="ballot-outline"*/}
            {/*  onPress={() => {*/}
            {/*    this.showReservationScreen();*/}
            {/*  }}*/}
            {/*/>*/}
            <MenuItem
              title={I18n.t('profile_management')}
              iconName="account-outline"
              onPress={() => {
                this._modalRef?.open();
              }}
            />
            <MenuItem
              title={I18n.t('language_change')}
              iconName="flag-outline"
              onPress={() => {
                this.ActionSheetLanguage.show();
              }}
            />

            <MenuItem
              title={I18n.t('profile_tos')}
              iconName="ballot-outline"
              onPress={() => {
                Linking.openURL(
                  'https://drive.google.com/file/d/1JVDU6MXlz3AfdyWJzEpdq7XnF1wD2owz/view?usp=sharing',
                );
              }}
            />
            <MenuItem
              title={I18n.t('profile_pp')}
              iconName="lock-outline"
              onPress={() => {
                Linking.openURL(
                  'https://drive.google.com/file/d/11cWOZpNA_V5lTDpmZcCmeaVX6kFelnKD/view?usp=sharing',
                );
              }}
            />
            {/* <MenuItem
                  title={`${I18n.t(
                    'version',
                  )} ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}
                  onPress={() => {}}
                /> */}
            <MenuItem
              title={I18n.t('logOut')}
              iconName="logout"
              onPress={this.handleLogout}
            />
            <Text
              style={{
                textAlign: 'center',
                color: '#CACACA',
              }}>
              {`${I18n.t(
                'version',
              )} ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}
            </Text>
            <View style={{height: 150}}></View>
          </ScrollView>
          <Portal>
            <Modalize
              ref={o => (this._modalRef = o)}
              handlePosition="inside"
              adjustToContentHeight
              scrollViewProps={{keyboardShouldPersistTaps: 'always'}}
              modalStyle={{
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}>
              <ProfileForm ref={this._modalRef} />
            </Modalize>
          </Portal>
          <ActionSheet
            ref={o => (this.ActionSheetLanguage = o)}
            title={I18n.t('language_change')}
            // options={[I18n.t('cancel'), 'Italiano', 'English', 'Español', 'Français', 'Deutsch']}
            options={[I18n.t('cancel'), 'Italiano', 'English']}
            cancelButtonIndex={0}
            destructiveButtonIndex={-1}
            onPress={index => {
              let locale = 'it';
              switch (index) {
                case 1:
                  locale = 'it';
                  break;
                case 2:
                  locale = 'en';
                  break;
                case 3:
                  locale = 'es';
                  break;
                case 4:
                  locale = 'fr';
                  break;
                case 5:
                  locale = 'de';
                  break;
                default:
                  return;
              }

              this.props.setLocalizationAndRestart(locale);
            }}
          />
        </SafeAreaView>
      );
    }
  }
}

const mapStateToProps = state => ({
  ...mapStateToPropsDefault(state),
  userAuth: state.userAuth,
});

const mapDispatchToProps = dispatch => ({
  ...mapDispatchToPropsDefault(dispatch),
  setLocalizationAndRestart: locale =>
    dispatch(UserAuthActions.setLocalization(locale, true)),
  logout: () => dispatch(UserAuthActions.logout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(renderWhenFocused(ProfileScreen));
