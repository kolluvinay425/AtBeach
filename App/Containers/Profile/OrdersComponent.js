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
  RefreshControl,
} from 'react-native';
import {SearchBar} from 'react-native-elements';

import R from 'ramda';

import {connect} from 'react-redux';
import I18n from 'i18n-js';
import Dialog, {ScaleAnimation} from 'react-native-popup-dialog';
import PropTypes from 'prop-types';
import analytics from '@react-native-firebase/analytics';

import OrderActions from '../../Redux/OrderRedux';

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
import UserAuthActions from '../../Redux/UserAuthRedux';
import BeachReportCard from './BeachReportCard';
import BeachSpotCard from '../MapTab/BeachSpotCard';

const isIOS = Platform.OS === 'ios';

class NotificationsComponent extends ApplicationComponent {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();

    this.state = {
      ...this.state,
    };
  }

  componentDidMount() {
    super._componentDidMount();

    this.props.getAllOrders();
  }

  // _renderSectionTitle = section => {
  //   return (
  //     <View style={this.styles.content}>
  //       <Text>{section.content}</Text>
  //     </View>
  //   );
  // };

  // showBeachSpotDetails = beachSpot => {
  //   this.props.navigation.navigate({
  //     routeName: beachSpot.is_private
  //       ? 'BeachSpotPrivateDetails'
  //       : 'BeachSpotDetails',
  //     params: {
  //       id: beachSpot.id,
  //     },
  //   });
  // };

  // getBeachSpotItem = report => {
  //   return this.props.beachSpots.data.find(
  //     beachSpot => beachSpot.id == report.id,
  //   );
  // };

  onRefresh = () => {
    this.props.getAllOrders();
  };

  render() {
    const {latestReports} = this.props;
    return this.state.reRender ? null : (
      <SafeAreaView style={{flex: 1, height: '100%'}}>
        <View style={{padding: Metrics.doubleBaseMargin}}>
          <Text style={{...Fonts.style.h4, color: Colors.text}}>
            Prenotazioni
          </Text>
          <Text style={{...Fonts.style.description, color: Colors.text}}>
            Work in progress...
          </Text>
        </View>
        <ScrollView
          style={{
            padding: Metrics.doubleBaseMargin,
            paddingTop: 0,
            paddingRight: Metrics.doubleBaseMargin,
            height:
              Metrics.windowHeight -
              Metrics.tabBarHeight -
              Metrics.navBarHeightAdjusted,
          }}
          refreshControl={
            <RefreshControl
              refreshing={latestReports.isFetching}
              onRefresh={this.onRefresh}
            />
          }>
          {latestReports.data &&
            latestReports.data.map(report => {
              return (
                <View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: Colors.lightgreyBorder,
                    }}
                  />
                </View>
              );
            })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  ...mapStateToPropsDefault(state),
  beachSpots: state.beachSpots.all,
  latestReports: state.beachSpots.latestReports,
});

const mapDispatchToProps = dispatch => ({
  ...mapDispatchToPropsDefault(dispatch),
  getAllOrders: () => dispatch(OrderActions.getAllOrdersRequest()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(renderWhenFocused(NotificationsComponent));
