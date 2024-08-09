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
import IconIonicon from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import BeachSpotActions from '../../Redux/BeachSpotRedux';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from 'i18n-js';
import WeatherForecast from '../../Components/WeatherForecast';
import moment from 'moment';
import {isIphoneX} from 'react-native-iphone-x-helper';

const isIOS = Platform.OS === 'ios';
const isIPhoneX = isIphoneX();

class WeatherForecastsModal extends ApplicationComponent {
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
      weatherRequested: false,
      canRenderNow: false,
      stickyHeaders: [],
    };
  }

  componentDidMount() {
    super._componentDidMount();

    this.setState({weatherRequested: false});
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    // console.log("PROPS",this.props)
    // console.log("NEW PROPS", newProps)
    if (this.props.isVisible != newProps.isVisible && newProps.isVisible) {
      setTimeout(() => {
        this.setState({canRenderNow: true});
      }, 700);

      if (this.state.weatherRequested === false) {
        this.setState({weatherRequested: true});
        this.props.getWeatherForecasts(newProps.beachSpotId);
      }
    }

    if (this.props.isVisible != newProps.isVisible && !newProps.isVisible) {
      setTimeout(() => {
        this.setState({canRenderNow: false});
      }, 700);
    }
  }

  renderNavBar = beachSpot => {
    return (
      <View
        style={{
          justifyContent: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Metrics.doubleBaseMargin,
          paddingTop: isIOS
            ? isIPhoneX
              ? Metrics.navBarOverStatusPaddingTop + Metrics.baseMargin
              : Metrics.navBarOverStatusPaddingTop + Metrics.doubleBaseMargin
            : Metrics.doubleBaseMargin,
          // paddingTop: 0,//isIOS ? isIPhoneX ? Metrics.navBarOverStatusPaddingTop+Metrics.baseMargin : Metrics.navBarOverStatusPaddingTop+Metrics.doubleBaseMargin : Metrics.doubleBaseMargin,
          // marginTop: isIOS ? 0 : Metrics.baseMargin,
          // paddingTop: Metrics.navBarOverStatusPaddingTop+Metrics.doubleBaseMargin,
          backgroundColor: 'transparent',
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
            {I18n.t('weatherForecast_title48')}
          </Text>
          <Text
            style={{
              ...Fonts.style.small,
              color: Colors.text,
              marginLeft: Metrics.doubleBaseMargin,
              lineHeight: 17,
            }}>
            {beachSpot.locality} ({beachSpot.city.name})
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const {canRenderNow, stickyHeaders} = this.state;
    const {isVisible, beachSpot, weatherForecasts} = this.props;

    let dayString = '';

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
          {this.renderNavBar(beachSpot)}
          {(weatherForecasts.isFetching || !canRenderNow) && (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <ActivityIndicator
                style={{}}
                size="large"
                color={Colors.pinBlack}
              />
            </View>
          )}

          {!weatherForecasts.isFetching &&
            canRenderNow &&
            weatherForecasts &&
            weatherForecasts.data &&
            weatherForecasts.data.stg && (
              <ScrollView
                stickyHeaderIndices={stickyHeaders}
                // style={{flex: 1}}
                // contentContainerStyle={{ flex: 1, flexGrow: 1, borderColor: 'green', borderWidth: 5 }}
              >
                {weatherForecasts.data.stg.map((lastWeatherInfo, index) => {
                  const newDayString = moment(lastWeatherInfo.time).format(
                    'DD/MM/YYYY',
                  );
                  if (newDayString !== dayString) {
                    dayString = newDayString;
                    stickyHeaders.push(index);
                    return (
                      <View>
                        <View
                          style={{
                            paddingHorizontal: Metrics.doubleBaseMargin,
                            backgroundColor: 'white',
                            paddingVertical: Metrics.doubleBaseMargin,
                            marginBottom: 20,
                            flexDirection: 'row',
                            alignItems: 'space-between',
                            borderBottomColor: Colors.lightgrey,
                            borderBottomWidth: 1,
                          }}>
                          <View style={{flex: 1}}>
                            <Text
                              style={{
                                color: Colors.text,
                                fontFamily: Fonts.type.bold,
                                fontSize: 16,
                                textTransform: 'uppercase',
                              }}>
                              {moment(lastWeatherInfo.time).format('dddd')}
                            </Text>
                          </View>
                          <View style={{flex: 1}}>
                            <Text
                              style={{
                                color: Colors.text,
                                fontFamily: Fonts.type.bold,
                                fontSize: 16,
                                textAlign: 'right',
                                textTransform: 'uppercase',
                              }}>
                              {newDayString}
                            </Text>
                          </View>
                        </View>
                      </View>
                      // <View>
                      //   <WeatherForecast lastWeatherInfo={lastWeatherInfo}/>
                      // </View>
                    );
                  } else {
                    return (
                      <WeatherForecast
                        style={{marginBottom: 20}}
                        lastWeatherInfo={lastWeatherInfo}
                      />
                    );
                  }
                })}
              </ScrollView>
            )}
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    beachSpot:
      state.beachSpots &&
      state.beachSpots.all &&
      state.beachSpots.all.data.length > 0
        ? state.beachSpots.all.data.find(beachSpot => {
            return beachSpot.id === props.beachSpotId;
          })
        : {},
    weatherForecasts: state.beachSpots.weatherForecasts,
  };
};

const mapDispatchToProps = dispatch => ({
  getWeatherForecasts: beachSpotId =>
    dispatch(BeachSpotActions.getWeatherForecastsRequest(beachSpotId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WeatherForecastsModal);
