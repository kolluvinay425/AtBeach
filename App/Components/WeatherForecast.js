import React from 'react';
import ApplicationComponent from '../Containers/ApplicationComponent';
import {
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import stylesfactory from './Styles/NetworkStatusBarStyle';
import NetInfo from '@react-native-community/netinfo';
import StartupActions from '../Redux/StartupRedux';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts, Images, Metrics} from '../Themes';
import {
  averageWeatherSg,
  sortFirstArrayBySecondArray,
  weatherCompassTextConvert,
  weatherGetImage,
  weatherSeaGetImage,
} from '../Lib/Utilities';
import moment from 'moment';
import buttonStylesFactory from './Styles/ButtonStyle';
import StyleSheetFactory from './Styles/WeatherForeCastStyles';
class WeatherForecast extends ApplicationComponent {
  static propTypes = {
    isConnected: PropTypes.bool,
  };

  static defaultProps = {
    isConnected: false,
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    // this.buttonStyles = buttonStylesFactory.getSheet()
    this.weatherStyles = StyleSheetFactory.getSheet();
    this.state = {
      ...this.state,
    };
  }

  render() {
    const {lastWeatherInfo} = this.props;
    return this.state.reRender ? null : (
      <View
        style={{
          ...this.props.style,
          paddingVertical: this.props.showArrow ? Metrics.doubleBaseMargin : Metrics.baseMargin,
          paddingRight: this.props.showArrow ? 0 : Metrics.doubleBaseMargin,
        }}>
        <View style={this.weatherStyles.containerOne}>
          <View style={this.weatherStyles.containerTwo}>

            <View style={this.weatherStyles.containerThree}>
              <Image
                source={weatherGetImage(lastWeatherInfo)}
                style={this.weatherStyles.containerThreeimage}
                resizeMode={'contain'}
              />
              <Text style={this.weatherStyles.containerThreeText}></Text>
            </View>
            <Text style={this.weatherStyles.containerTwoTextOne}>
              {averageWeatherSg(lastWeatherInfo.airTemperature, true)}°
            </Text>
            <Text style={this.weatherStyles.containerTwoTextTwo}>
              {moment(lastWeatherInfo.time).format('HH:mm')}
            </Text>
          </View>

          <View style={this.weatherStyles.containerTwo}>
            <View style={this.weatherStyles.containerThree}>
              <Image
                source={weatherSeaGetImage(lastWeatherInfo)}
                style={this.weatherStyles.containerThreeimage}
                resizeMode={'contain'}
              />
              <Text style={this.weatherStyles.containerThreeText}>Onda</Text>
            </View>
            <Text style={this.weatherStyles.containerTwoTextOne}>
              {Math.round(lastWeatherInfo.waveHeight.sg * 100)}cm
            </Text>
            <Text style={this.weatherStyles.containerSubText}>
              {weatherCompassTextConvert(
                averageWeatherSg(lastWeatherInfo.waveDirection),
              )}
            </Text>
          </View>
          <View style={this.weatherStyles.containerTwo}>
            <View style={this.weatherStyles.containerThree}>
              <Image
                source={Images.weather.wind}
                style={this.weatherStyles.containerThreeimage}
                resizeMode={'contain'}
              />
              <Text style={this.weatherStyles.containerThreeText}>Vento</Text>
            </View>
            <Text style={this.weatherStyles.containerTwoTextOne}>
              {Math.round(
                averageWeatherSg(lastWeatherInfo.windSpeed, true) * 3.6,
              )}
              km/h
            </Text>
            <Text style={this.weatherStyles.containerSubText}>
              {weatherCompassTextConvert(
                averageWeatherSg(lastWeatherInfo.windDirection),
              )}
            </Text>
          </View>
          {this.props.showArrow && (
            <MaterialIcons
              name="arrow-right"
              size={26}
              style={{color: Colors.activeButton}}
            />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WeatherForecast);
