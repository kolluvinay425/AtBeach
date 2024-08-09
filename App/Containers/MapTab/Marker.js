import {setMarkerRef, markersRef} from '../../Lib/MapService';
import {Callout, Marker} from 'react-native-maps';
import React, {Component} from 'react';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../../../assets/fonts/selection.json';
import {computePinColor} from '../../Lib/Utilities';
import moment from 'moment';
import {Text, View} from 'react-native';
import {markerstyles} from '../Styles/MarkerStyle';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import {Colors} from '../../Themes';
import I18n from 'i18n-js';

const OIcon = createIconSetFromIcoMoon(icoMoonConfig, 'icomoon', 'icomoon.ttf');

export default class OMarker extends Component {
  constructor(props) {
    super(props);
  }

  computePinIcon = () => {
    if (this.props.pinIcon) {
      return this.props.pinIcon;
    }

    if (this.props.beachSpot.isActive) {
      return 'pin01';
    } else {
      return 'pin02';
    }
  };

  getMarkerTitle = beachSpot => {
    if (
      beachSpot.last_spot_state &&
      beachSpot.last_spot_state.created_at &&
      beachSpot.last_spot_state.beach_state_id != 0
    ) {
      const state = `${
        beachSpot.last_spot_state.beach_state_id == 1 ? I18n.t('beachSpotState_free') :
          beachSpot.last_spot_state.beach_state_id == 2 ? I18n.t('beachSpotState_almostFull') :
            I18n.t('beachSpotState_full')
      } (${moment(beachSpot.last_spot_state.created_at).fromNow()})`

      return state;
    } else {
      return '';
    }
  };

  setCalloutActiveOnLoad = beachSpot => {
    if (beachSpot.isActive) {
      setTimeout(() => {
        if (markersRef.markers[beachSpot.id]) {
          markersRef.markers[beachSpot.id].showCallout();
        }
      }, 500);
    }
  };

  _keyExtractor = beachSpot => `${beachSpot.id}`;

  render() {
    const {
      beachSpot,
      pinColor,
      onMarkerPress,
      beachSpotCount,
      noPin,
    } = this.props;
    const computedPinColor = computePinColor(
      beachSpot.is_private,
      beachSpot.last_spot_state,
      pinColor,
      beachSpot.isActive,
    );

    const markerTitle = this.getMarkerTitle(beachSpot);
    return (
      <Marker
        coordinate={{
          latitude: parseFloat(beachSpot.latitude),
          longitude: parseFloat(beachSpot.longitude),
        }}
        ref={ref => {
          setMarkerRef(beachSpot.id, ref);
          this.setCalloutActiveOnLoad(beachSpot); // PUT HERE TO DRAW CALLOUT AFTER REFRESH
        }}
        tracksViewChanges={false}
        tracksInfoWindowChanges={false}
        key={this._keyExtractor}
        onPress={() => {
          onMarkerPress(beachSpot);
        }}>
        {!noPin && (
          <OIcon
            color={computedPinColor}
            size={this.props.beachSpot.isActive ? 60 : 40}
            name={this.computePinIcon()}
          />
        )}
        {noPin && (
          <View style={markerstyles.Markercontainer}>
            <Text style={markerstyles.Markertext}>{beachSpotCount}</Text>
          </View>
        )}
        {markerTitle !== '' && (
          <Callout tooltip={true}>
            <View style={markerstyles.container}>
              <View style={markerstyles.content}>
                <Text style={markerstyles.text}>{markerTitle}</Text>
              </View>
            </View>
          </Callout>
        )}
      </Marker>
    );
  }
}
