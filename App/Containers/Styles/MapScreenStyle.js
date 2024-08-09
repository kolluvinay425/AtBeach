// @flow

import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts, Metrics} from '../../Themes/';
import {Marker} from 'react-native-maps';
import React from 'react';
import {CARD_WIDTH} from '../MapTab/MapScreen';
import {isIphoneX} from 'react-native-iphone-x-helper';
import metrics from '../../Themes/Metrics';
const isIOS = Platform.OS === 'ios';
const isIPhoneX = isIphoneX();

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      container: {
        ...StyleSheet.absoluteFillObject,
        height: Metrics.windowHeight - 60,
        width: Metrics.windowWidth,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
        width: Metrics.windowWidth,
        height: isIOS
          ? isIPhoneX
            ? Metrics.windowHeight + 60
            : Metrics.windowHeight + 26
          : Metrics.windowHeight + 3,
      },
      floatingButtonsContainer: {
        position: 'absolute',
        left: metrics.windowWidth - 75,
      },
      filtersScrollView: {
        width: Metrics.windowWidth,
        position: 'absolute',
        bottom: 180,
        left:
          metrics.windowHeight > 750
            ? metrics.windowWidth - 100
            : metrics.windowWidth - 80,
      },
      tagContainerShadow: {
        marginVertical: 10,
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: {
          height: 0,
          width: 0,
        },
        elevation: 4,
        backgroundColor: 'white',
        borderColor: Colors.lightgreyBorder,
        // paddingHorizontal: 12,
        // paddingVertical: 10,
        width: 48,
        height: 48,
        flex: 1,
        flexGrow: 1,
        borderRadius: 99999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      tagText: {
        color: Colors.darkgrey,
        marginLeft: 8,
        fontSize: Fonts.size.mini,
        fontFamily: Fonts.type.bold,
      },
      searchBarContainer: {
        width: Metrics.windowWidth - Metrics.doubleBaseMargin * 2,
        position: 'absolute',
        top: Metrics.navBarOverStatusPaddingTop + 15,
        left: Metrics.doubleBaseMargin,
        backgroundColor: 'white',
        borderColor: Colors.lightgreyBorder,
        borderRadius: 10,
        borderWidth: 0,
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
          height: 0,
          width: 0,
        },
        elevation: 3,
      },
      searchBarContainerTwo: {
        width: Metrics.windowWidth - Metrics.doubleBaseMargin * 2,
        // position: 'absolute',
        // top: Metrics.navBarOverStatusPaddingTop + 15,
        // left: Metrics.doubleBaseMargin,
        backgroundColor: 'white',
        borderColor: Colors.lightgreyBorder,
        borderRadius: 10,
        borderWidth: 0,
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
          height: 0,
          width: 0,
        },
        elevation: 3,
      },
      searchBarInputContainer: {
        height: 36,
        paddingHorizontal: Metrics.marginHorizontal,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'white',
      },
      searchBarInput: {
        marginLeft: Metrics.marginHorizontal,
        marginTop: isIOS ? 3 : 6,
      },
      mapContainer: {
        // width: Metrics.screenWidth,
        flex: 1,
      },
      carouselContainer: {
        position: 'absolute',
        left: 0,
        width: Metrics.windowWidth,
      },
      searchSuggestionsContainer: {
        width: Metrics.windowWidth - Metrics.doubleBaseMargin * 2,
        height: Metrics.windowHeight - 180,
        position: 'absolute',
        top: Metrics.navBarOverStatusPaddingTop + 77,
        left: Metrics.doubleBaseMargin,
        paddingVertical: 7,
        backgroundColor: 'white',
        borderColor: Colors.lightgreyBorder,
        borderRadius: 10,
        borderWidth: 1,
      },
      searchSuggestionElement: {
        paddingVertical: 15,
        marginHorizontal: Metrics.doubleBaseMargin,
        justifyContent: 'space-between',
      },
      searchSuggestionElementBeachSpot: {
        paddingVertical: 7,
        marginHorizontal: Metrics.doubleBaseMargin,
        justifyContent: 'space-between',
      },
      searchSuggestionText: {
        flex: 1,
        color: Colors.text,
      },
      searchSuggestionTextSecond: {
        margin: 0,
        fontSize: Fonts.size.tiny,
        fontFamily: Fonts.type.light,
      },
      megaphoneContainer: {
        position: 'absolute',
        bottom: 160,
        right: Metrics.baseMargin,
        backgroundColor: Colors.pinPublic,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 3,
        width: 55,
        height: 55,
      },
      megaphoneCtaContainer: {
        position: 'absolute',
        backgroundColor: Colors.pinPublic,
        borderColor: 'white',
        overflow: 'hidden',
        height: 55,
        bottom: 160,
        right: Metrics.baseMargin,
        borderRadius: 10,
        borderWidth: 2,
      },
      megaphoneCtaText: {
        fontFamily: Fonts.type.base,
        fontSize: 14,
        color: 'white',
        paddingVertical: isIOS ? 8 : 6,
        paddingHorizontal: 14,
        textAlign: 'right',
      },
      megaphoneIcon: {padding: 7},
      ActivityIndicator: {
        position: 'absolute',
        left: (Metrics.windowWidth / 2) - 25,
        top: (Metrics.windowHeight / 3) - 25,
        height: 50,
        width: 50
      },
    });
  }
}

export const mapStyle = [
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi.attraction',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.business',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.government',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi.medical',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi.place_of_worship',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi.school',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi.sports_complex',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

// red, tomato, orange, yellow, green, gold, wheat, linen, tan, blue, aqua, teal, violet, purple, indigo, turquoise, navy and plum.
