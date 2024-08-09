import React, {useRef} from 'react';
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
} from 'react-native';
import {SearchBar} from 'react-native-elements';

import R from 'ramda';

import {connect} from 'react-redux';
import I18n from 'i18n-js';
import Dialog, {ScaleAnimation} from 'react-native-popup-dialog';
import PropTypes from 'prop-types';
import analytics from '@react-native-firebase/analytics';

import BeachSpotActions from '../../Redux/BeachSpotRedux';

import stylesfactory from '../Styles/MapScreenStyle';

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
import Accordion from 'react-native-collapsible/Accordion';
import {Fonts, Metrics, Colors} from '../../Themes';
import NotificationsComponent from './NotificationsComponent';
import DeviceInfo from 'react-native-device-info';
import ActionSheet from 'react-native-actionsheet';
import UserAuthActions from '../../Redux/UserAuthRedux';
import OrdersComponent from './OrdersComponent';

class InfoScreen extends ApplicationComponent {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();

    this.sections = [
      {
        index: 0,
        title: I18n.t('faq1_title'),
        content: I18n.t('faq1_description'),
      },
      {
        index: 1,
        title: I18n.t('faq2_title'),
        content: I18n.t('faq2_description'),
      },
      {
        index: 2,
        title: I18n.t('faq3_title'),
        content: I18n.t('faq3_description'),
      },
      {
        index: 3,
        title: I18n.t('faq4_title'),
        content: I18n.t('faq4_description'),
      },
      {
        index: 4,
        title: I18n.t('faq5_title'),
        content: I18n.t('faq5_description'),
      },
    ];

    this.state = {
      ...this.state,
      activeSections: [0],
    };
  }

  // _renderSectionTitle = section => {
  //   return (
  //     <View style={this.styles.content}>
  //       <Text>{section.content}</Text>
  //     </View>
  //   );
  // };

  _renderHeader = section => {
    const active = this.state.activeSections.includes(section.index);
    return (
      <View style={{paddingVertical: 10}}>
        <Text
          style={{
            ...Fonts.style.h6,
            color: active ? Colors.pinRed : Colors.text,
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={{marginBottom: 20}}>
        <Text style={{...Fonts.style.description, color: Colors.text}}>
          {section.content}
        </Text>
      </View>
    );
  };

  _renderFooter = section => {
    const active = this.state.activeSections.includes(section.index);
    return (
      <View style={{marginBottom: 20}}>
        <TouchableOpacity
          onPress={() => {
            let activeSections = this.state.activeSections;
            if (active) {
              const index = activeSections.indexOf(section.index);
              if (index > -1) {
                activeSections.splice(index, 1);
              }
            } else {
              activeSections.push(section.index);
            }
            this.setState({activeSections: activeSections});
          }}>
          <Text style={{...Fonts.style.description, color: Colors.text}}>
            {active ? 'SHOW LESS' : 'SHOW MORE'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({activeSections});
  };

  render() {
    const {userAuthDetails} = this.props;

    const logged = userAuthDetails && userAuthDetails.id;
    const owner =
      userAuthDetails && userAuthDetails.owner && userAuthDetails.owner.id;

    return this.state.reRender ? null : logged ? (
      owner ? (
        <NotificationsComponent />
      ) : (
        <OrdersComponent />
      )
    ) : (
      <SafeAreaView>
        <View style={{padding: Metrics.doubleBaseMargin}}>
          <Text style={{...Fonts.style.h4}}>Info</Text>
        </View>
        <View
          style={{
            paddingHorizontal: Metrics.doubleBaseMargin,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              ...Fonts.style.description,
              color: Colors.text,
              paddingVertical: Metrics.baseMargin,
            }}>{`${I18n.t(
            'version',
          )} ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}</Text>
          {/* <TouchableOpacity
            onPress={() => {
              this.ActionSheetLanguage.show();
            }}>
            <Text
              style={{
                ...Fonts.style.description,
                color: Colors.text,
                paddingVertical: Metrics.baseMargin,
                paddingLeft: Metrics.baseMargin,
                textTransform: 'capitalize',
              }}>{`${I18n.t('language_change')}`}</Text>
          </TouchableOpacity> */}
        </View>
        <ScrollView
          style={{
            paddingHorizontal: Metrics.doubleBaseMargin,
            height: Metrics.windowHeight - 190,
          }}>
          <Accordion
            sections={this.sections}
            activeSections={this.state.activeSections}
            touchableComponent={(props, other, other2) => {
              return <TouchableOpacity {...props} />;
            }}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            renderFooter={this._renderFooter}
            onChange={this._updateSections}
            underlayColor={Colors.pinRed}
            align={'top'}
            expandMultiple={true}
            // sectionContainerStyle={(asd) => {
            //   console.log(asd)
            // }}
          />
          <Text style={{color: 'white', fontSize: 60}}>.</Text>
        </ScrollView>

        {/* <ActionSheet
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
        /> */}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  ...mapStateToPropsDefault(state),
  userAuthDetails: state.userAuth.details,
});

const mapDispatchToProps = dispatch => ({
  ...mapDispatchToPropsDefault(dispatch),
  // setLocalizationAndRestart: locale =>
  //   dispatch(UserAuthActions.setLocalization(locale, true)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(renderWhenFocused(InfoScreen));
