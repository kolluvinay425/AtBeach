import React, {useRef} from 'react';
import ApplicationComponent, {
  mapDispatchToPropsDefault,
  mapStateToPropsDefault,
} from '../ApplicationComponent';

import {
  Animated,
  Platform,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  AppState,
  StyleSheet,
} from 'react-native';
import {SearchBar} from 'react-native-elements';

import * as Animatable from 'react-native-animatable';

import R from 'ramda';

import {connect} from 'react-redux';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';

import BeachSpotActions from '../../Redux/BeachSpotRedux';
import UserAuthActions from '../../Redux/UserAuthRedux';

import stylesfactory from '../Styles/MapScreenStyle';
import buttonStylesFactory from '../../Components/Styles/ButtonStyle';
import {mapStyle} from '../Styles/MapScreenStyle';

import MapView from 'react-native-maps';
import {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import icoMoonConfig from '../../../assets/fonts/selection.json';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
const OIcon = createIconSetFromIcoMoon(icoMoonConfig);

import {
  check as checkPermission,
  request as requestPermission,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import renderWhenFocused from 'render-when-focused';
import {Colors, Metrics, Fonts, Images} from '../../Themes';

import {
  mapRef,
  markersRef,
  getGpsPointsDistance,
  getNearestSpot,
  calculateReportMaxDistance,
  isContainedInSquare,
} from '../../Lib/MapService';
import OModal from '../../Components/OModal';
import BeachSpotCard from './BeachSpotCard';

import OMarker from './Marker';
import Spinner from 'react-native-loading-spinner-overlay';
import {SEARCH_INDEX} from '../../Lib/TextSearch';
import moment from 'moment';
import {FORCE_GPS_AT} from '../../Services/Api';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import Macros from './BeachSpotSearch/Macros';
import BeachTagsAccordion from './BeachSpotSearch/BeachTagsAccordion';
import metrics from '../../Themes/Metrics';
import BeachSpotSearchByFilters from './BeachSpotSearch/BeachSpotSearchByFilters';
import {put} from 'redux-saga/effects';
import BeachSpotsActions from '../../Redux/BeachSpotRedux';

const isIOS = Platform.OS === 'ios';
const isIPhoneX = isIphoneX();

let latestClusterRendered = {latitude: 0, longitude: 0};
let latestDistance = 0;
let additionalClusters = 0;

export const CAROUSEL_WIDTH = Metrics.windowWidth;
export const CARD_MARGIN = 6;
export const CARD_WIDTH = CAROUSEL_WIDTH - CARD_MARGIN * 10;
export const CARD_HEIGHT = 100;
export const VIEWABILITY_CONFIG = {
  minimumViewTime: 0,
  viewAreaCoveragePercentThreshold: 70,
  waitForInteraction: true,
};

const MAX_ZOOM = 19;
const MIN_ZOOM_PIN = 12;
const AUTO_ZOOM_PIN = 16;
const AUTO_ZOOM_AREA = 12.5;
const MARKER_ZOOM_SHOW = 11;

const CITY_MARKER_MAX_ZOOM = 9.2;
const PIN_SHOW_MIN_ZOOM = 9.3;
const CLUSTER_AGGREGATOR_ZOOM = 8;
let latestRecordedZoom = 0;

const MAP_DRAGEND_CAROUSEL_SCROLL_TIMEOUT = [];
const REFRESH_INTERVAL = [];
let DO_REFRESH = false;
let LAST_ACTIVE = moment();

const PERMISSION_TO_CHECK = isIOS
  ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

let CLUSTER_RENDERED = [];

class MapScreen extends ApplicationComponent {
  static propTypes = {
    bestRecipes: PropTypes.object,
  };

  static defaultProps = {
    bestRecipes: {},
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.buttonStyles = buttonStylesFactory.getSheet();

    this.state = {
      ...this.state,
      delayFirstAlert: false,
      modelOpen: false,
      isActive: null,
      searchInput: '',
      searchResults: [],
      showPermissionModal: false,
      permissionModalCallbackType: 'all',
      permissionStatus: null,
      showSearchSuggestions: false,
      showBeachSpots: false,
      markerTracksViewChanges: true,
      // carouselRefresh: 0,
      mapIsBeingDragged: false,
      isLoadingGps: false,
      isCloseToSpot: false,
      showReportButton: false,
      showReportButtonCheck: false,
      showReportButtonNew: false,
      highlightedBeachSpot: null,
      gpsLoop: 0,
      citiesArray: [],
      reRenderPins: true,
      modalizeDraggable: true,
      refreshFlatList: false,
      visibleBeachSpots: [],
      textSearchInProgress: false,
      showZoomOutAlert: false,
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

  setModel = () => {
    this.setState({modelOpen: false});
  };
  _handleAppStateChange = state => {
    // console.log("STATO CAMBIATO", state)
    if (state === 'active') {
      const duration = moment.duration(moment().diff(LAST_ACTIVE)).asMinutes();
      if (duration > 5) {
        this.checkPermissionAndSetGpsWatcher();
        this.doAllRequests();
        // DO_REFRESH = false;
        // this.setRefreshInterval();
      }
    } else {
      LAST_ACTIVE = moment();
      Geolocation.stopObserving();
    }
  };

  checkPermissionAndSetGpsWatcher = () => {
    checkPermission(PERMISSION_TO_CHECK)
      .then(result => {
        if (result == RESULTS.GRANTED) {
          this.setState({permissionStatus: 'granted'});
        }

        Geolocation.watchPosition(
          info => {
            // console.log("SET USER LOCATION FROM WATCHER")

            const coordinates =
              __DEV__ && FORCE_GPS_AT.force ? FORCE_GPS_AT : info.coords;

            this.props.setUserLocation(coordinates);
          },
          () => {},
          {
            enableHighAccuracy: true,
          },
        );
      })
      .catch(error => {
        // …
      });
  };

  componentDidMount() {
    super._componentDidMount();

    // this.doAllRequests()

    AppState.addEventListener('change', this._handleAppStateChange);

    this.checkPermissionAndSetGpsWatcher();

    this.removeRefreshInterval();
    // this.setRefreshInterval();

    // console.log('request on mount')
    this.doAllRequests();
    // THIS IS TO RELOAD AUTOMATICALLY
    // this.focusListenerRefresh = this.props.navigation.addListener(
    //   'didFocus',
    //   () => {
    //     this.props.fireRedrawMarkers();
    //
    //     if (DO_REFRESH) {
    //       // console.log('request on focus')
    //       this.doAllRequests();
    //       DO_REFRESH = false;
    //       this.setRefreshInterval();
    //     }
    //   },
    // );

    // analytics().logEvent(`Page_${this.props.navigation.state.routeName}`, {});

    //
    // setTimeout(() => {
    //   if (!this.props.isHomeTooltipDone) {
    //     this.setState({
    //       popupMiaVisible: true
    //     });
    //   }
    // }, 2000);

    setTimeout(() => {
      this.setState({delayFirstAlert: true});
    }, 2000);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    super._UNSAFE_componentWillReceiveProps(newProps);

    // ORDERING ALPHABETICALLY IF FIRST TIME
    if (
      (this.state.citiesArray.length < 1 && newProps.places.cities) ||
      (this.props.places.cities &&
        newProps.places.cities &&
        newProps.places.cities !== this.props.places.cities)
    ) {
      let ca = Object.keys(newProps.places.cities).map(
        city => newProps.places.cities[city],
      );
      ca = R.sort(
        (a, b) => a.name[I18n.locale].localeCompare(b.name[I18n.locale]),
        ca,
      );
      this.setState({citiesArray: ca});
    }

    // ALWAYS SET VISIBLE SPOT, EVERY CHANGE MATTERS
    this.setState(
      {visibleBeachSpots: newProps.beachSpots.data.filter(bs => bs.isVisible)},

      // AFTER SETTNIG VISIBLE GET THE CLOSEST AND SEE IF IS WITNIN MAP
      () => {
        mapRef.map.getCamera().then(camera => {
          const closestSpot = getNearestSpot(this.state.visibleBeachSpots, [
            camera.center.latitude,
            camera.center.longitude,
          ]);

          if (closestSpot) {
            mapRef.map.getMapBoundaries().then(boundaries => {
              const isVisible = isContainedInSquare(boundaries, {
                latitude: closestSpot.latitude,
                longitude: closestSpot.longitude,
              });
              if (!isVisible) {
                this.setState({showZoomOutAlert: true});
              } else {
                this.setState({showZoomOutAlert: false});
              }
            });
          } else {
            this.setState({showZoomOutAlert: true});
          }
        });
      },
    );

    // UPDATE THE FLAT LIST IF NEEDED
    if (
      this.props.beachSpots.data.filter(bs => bs.isVisible).length !==
      newProps.beachSpots.data.filter(bs => bs.isVisible).length
    ) {
      this.setState({refreshFlatList: !this.state.refreshFlatList});
    }

    if (newProps.map && newProps.map.needsCentering) {
      setTimeout(() => {
        mapRef.map.getCamera().then(camera => {
          const closestSpot = getNearestSpot(this.state.visibleBeachSpots, [
            camera.center.latitude,
            camera.center.longitude,
          ]);

          if (closestSpot) {
            this.selectBeachSpot(closestSpot, true, false);
          }
        });
        this.props.unsetMapCentering();
      }, 50);
    }

    // if (
    //   this.props.nearbySpots.isFetching == true &&
    //   newProps.nearbySpots.isFetching == false &&
    //   newProps.nearbySpots.error == false) {
    //   if (newProps.nearbySpots.center && newProps.nearbySpots.center[0] != null && newProps.nearbySpots.center[1] != null){
    //
    //     // console.log('\n\n\nCENTERING ON NEARBY\n\n\n')
    //
    //     mapRef.map.animateCamera({
    //       center: {
    //         latitude: newProps.nearbySpots.center[0],
    //         longitude: newProps.nearbySpots.center[1]
    //       },
    //       zoom: AUTO_ZOOM_AREA
    //     })
    //
    //     const beachSpot = newProps.nearbySpots.data[0]
    //
    //     // REMOVED, TOO SLOW
    //     // const closestSpot = getNearestSpot(newProps.nearbySpots.data, newProps.nearbySpots.center)
    //
    //     this.props.setPinActive(beachSpot.id)
    //
    //     const index = this.props.beachSpots.data.findIndex((beachSpotElement)=>beachSpotElement.id === beachSpot.id)
    //     this._carousel.scrollToIndex({animated: true, index: index})
    //
    //   }
    //   // console.log(' GO TO MAP ')
    // }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.focusListenerRefresh) {
      this.focusListenerRefresh.remove();
    }

    Geolocation.stopObserving();
  }

  doAllRequests = force => {
    const {getAllBeachSpots} = this.props;
    getAllBeachSpots();
  };

  removeRefreshInterval = () => {
    for (let index = REFRESH_INTERVAL.length - 1; index >= 0; index--) {
      clearInterval(REFRESH_INTERVAL[index]);
      REFRESH_INTERVAL.splice(index, 1);
    }
  };

  setRefreshInterval = () => {
    REFRESH_INTERVAL.push(
      setInterval(() => {
        if (this.props.navigation.isFocused()) {
          // console.log('DOING LOOP')
          this.doAllRequests();
          DO_REFRESH = false;
        } else {
          this.removeRefreshInterval();
          DO_REFRESH = true;
        }
      }, 600000),
    );
  };

  _renderItem = ({item, index, separators}) => {
    return (
      <BeachSpotCard
        style={{
          width: CARD_WIDTH,
          marginHorizontal: CARD_MARGIN,
          marginLeft: CARD_MARGIN,
          opacity: item.isVisible ? 1 : 0.4,
          backgroundColor: item.isVisible ? 'white' : 'grey',
          // paddingTop: index === this.state.isActive ? 4 : 0,
          // height: index === this.state.isActive ? 110 : 100,
        }}
        key={item.id}
        item={item}
        showCardDetails={this.showCardDetails}
        shadow={true}
        isActive={index === this.state.isActive}
      />
    );
  };

  updateMapOnDragComplete = data => {
    // const {showBeachSpots, mapIsBeingDragged} = this.state
    // const {beachSpots} = this.props

    mapRef.map.getCamera().then(camera => {
      latestRecordedZoom = camera.zoom;
      if (latestRecordedZoom >= MARKER_ZOOM_SHOW) {
        if (!this.state.showBeachSpots || !this.state.showReportButton) {
          this.setState({showBeachSpots: true, showReportButton: true}, () => {
            if (this.state.visibleBeachSpots && data) {
              const closestSpot = getNearestSpot(this.state.visibleBeachSpots, [
                data.latitude,
                data.longitude,
              ]);
              this.selectBeachSpot(closestSpot, true, false);
            }
          });
        }
      } else {
        if (this.state.showBeachSpots || this.state.showReportButton) {
          this.setState({showBeachSpots: false, showReportButton: false});
        }
      }
    });

    this.props.setMapCenter(data);

    setTimeout(() => {
      if (
        this.state.highlightedBeachSpot &&
        markersRef.markers[this.state.highlightedBeachSpot.id]
      ) {
        markersRef.markers[this.state.highlightedBeachSpot.id].showCallout();
      }
    }, 300);

    // if (mapIsBeingDragged && showBeachSpots) {
    //
    //   MAP_DRAGEND_CAROUSEL_SCROLL_TIMEOUT.push(setTimeout(() => {
    //     const closestSpot = getNearestSpot(beachSpots.data, [data.latitude, data.longitude])
    //
    //     const index = beachSpots.data.findIndex((beachSpotElement) => beachSpotElement.id === closestSpot.id)
    //     this._carousel.scrollToIndex({animated: false, index: index})
    //
    //     this.props.setPinActive(closestSpot.id)
    //
    //   }, 300))
    //
    // }

    this.setState({mapIsBeingDragged: false});
  };

  // onMapDragStart = () => {
  //   // for (let index = MAP_DRAGEND_CAROUSEL_SCROLL_TIMEOUT.length - 1; index >= 0; index--) {
  //   //   clearTimeout(MAP_DRAGEND_CAROUSEL_SCROLL_TIMEOUT[index]);
  //   //   MAP_DRAGEND_CAROUSEL_SCROLL_TIMEOUT.splice(index, 1);
  //   // }
  //   // this.setState({mapIsBeingDragged: true})
  // }

  // triggerNewRegionChange = true
  // updateMapOnDrag = (data) => {
  //   if (this.triggerNewRegionChange) {
  //     this.triggerNewRegionChange = false
  //     this.props.setMapCenter(data)
  //     setTimeout(()=>{this.triggerNewRegionChange = true}, 250)
  //   }
  // }

  onCityMarkerPress = city => {
    // console.log(city)
    this.handleSelectCity(city);
  };

  getItemLayout(data, index) {
    return {
      offset:
        index * (CARD_WIDTH + CARD_MARGIN * 2) +
        CARD_WIDTH / (isIOS ? 2 : 2.3) -
        CAROUSEL_WIDTH / 2,
      length: CARD_WIDTH + CARD_MARGIN * 2,
      index,
    };
  }

  onMarkerPress = (beachSpot, doScroll = true) => {
    mapRef.map.getCamera().then(camera => {
      // console.log(camera.zoom)

      let zoom = camera.zoom;

      if (camera.zoom > AUTO_ZOOM_PIN) {
        if (zoom > MAX_ZOOM) {
          zoom = AUTO_ZOOM_PIN;
        }
      } else if (camera.zoom < MIN_ZOOM_PIN) {
        zoom = AUTO_ZOOM_PIN;
      }

      // console.log(zoom)

      mapRef.map.animateCamera({
        center: {
          latitude: parseFloat(beachSpot.latitude),
          longitude: parseFloat(beachSpot.longitude),
        },
        zoom: zoom,
      });
    });

    this.selectBeachSpot(beachSpot, doScroll, true);
  };

  updateSearchInput = searchInput => {
    this.setState({searchInput: searchInput});
    const searchResults = SEARCH_INDEX.search(searchInput);

    if (searchResults.length > 0 && this.props.beachSpots.data.length > 0) {
      let beachSpotResults = searchResults.map(id => {
        if (typeof id === 'string' && id.includes('city')) {
          let real_id = id.replace('city_', '');
          return ['city', this.props.places.cities[real_id]];
        } else {
          return [
            'beachSpot',
            this.props.beachSpots.data.find(beachSpot => beachSpot.id === id),
          ];
        }
      });

      // beachSpotResults = beachSpotResults.filter(function (el) {
      //   return el != null;
      // });

      this.setState({searchResults: beachSpotResults});
    } else {
      this.setState({searchResults: []});
    }
  };

  onSearchEnter = () => {
    const searchResults = SEARCH_INDEX.search(this.state.searchInput);
    if (searchResults.length > 0) {
      const city_id = searchResults.find(
        id => typeof id === 'string' && id.includes('city'),
      );
      if (city_id) {
        const real_city_id = city_id.replace('city_', '');
        const city = this.state.citiesArray.find(
          city => city.id == real_city_id,
        );
        if (city) {
          this.handleSelectCity(city, true);
        }
      } else {
        const bs = this.props.beachSpots?.data.find(
          bs => bs.id == searchResults[0],
        );
        if (bs) {
          this.handleSelectBeachSpotSuggestion(bs);
        }
      }
    }
  };

  accessLocationAndGetSpots = spotType => {
    checkPermission(PERMISSION_TO_CHECK)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            // console.log('This feature is not available (on this device / in this context)');
            this.setState({permissionStatus: 'unavailable'});
            setTimeout(() => {
              Alert.alert(
                I18n.t('gpsDisabled_errorTitle'),
                I18n.t('gpsDisabled_errorDescription'),
              );
            }, 500);
            break;
          case RESULTS.DENIED:
            // console.log('The permission has not been requested / is denied but requestable');
            this.setState({
              permissionStatus: 'denied',
              showPermissionModal: true,
            });
            break;
          case RESULTS.GRANTED:
            // console.log('The permission is granted');
            this.setState({permissionStatus: 'granted'});
            this.geolocateAndSearchNearby(spotType);
            break;
          case RESULTS.BLOCKED:
            // console.log('The permission is denied and not requestable anymore');
            this.setState({
              permissionStatus: 'blocked',
              permissionModalCallbackType: spotType,
              showPermissionModal: true,
            });
            break;
        }
      })
      .catch(error => {
        // …
      });
  };

  handlePermissionConfirm = () => {
    const {permissionStatus, permissionModalCallbackType} = this.state;

    if (permissionStatus === 'denied') {
      requestPermission(PERMISSION_TO_CHECK).then(status => {
        if (status === 'granted') {
          this.setState({permissionStatus: 'granted'}, () => {
            this.geolocateAndSearchNearby(permissionModalCallbackType);
          });
        }
      });
    } else {
      openSettings();
    }
    this.setState({showPermissionModal: false});
  };

  handlePermissionCancel = () => {
    this.setState({showPermissionModal: false});
  };

  geolocateAndSearchNearby = (spotType, enableHighAccuracy = true) => {
    if (this.props.beachSpots.isFetching) {
      return;
    }

    let canTryAgain = false;
    if (this.state.gpsLoop < 6) {
      canTryAgain = true;
    }

    if (!this.state.isLoadingGps) {
      this.setState({isLoadingGps: true});
    }

    const {visibleBeachSpots} = this.state;

    if (visibleBeachSpots && visibleBeachSpots.length > 0) {
      Geolocation.getCurrentPosition(
        info => {
          const coordinates =
            __DEV__ && FORCE_GPS_AT.force ? FORCE_GPS_AT : info.coords;

          if (coordinates.accuracy > 100 && canTryAgain) {
            // 100 METERS ACCURACY MIN
            this.setState({gpsLoop: this.state.gpsLoop + 1}, () => {
              setTimeout(() => {
                this.geolocateAndSearchNearby(spotType);
              }, 1000);
            });
          } else {
            // console.log('LOCATION OK', coordinates)

            this.props.setUserLocation(coordinates);
            this.setState({isLoadingGps: false, gpsLoop: 0});

            const closestSpot = getNearestSpot(visibleBeachSpots, [
              coordinates.latitude,
              coordinates.longitude,
            ]);

            mapRef.map.animateCamera({
              center: {
                latitude: parseFloat(closestSpot.latitude),
                longitude: parseFloat(closestSpot.longitude),
              },
              zoom: AUTO_ZOOM_AREA,
            });

            this.selectBeachSpot(closestSpot, true, false);
          }
        },
        error => {
          // console.log(error)
          if (enableHighAccuracy) {
            this.geolocateAndSearchNearby(spotType, false);
          } else {
            this.setState({isLoadingGps: false, gpsLoop: 0});
            setTimeout(() => {
              Alert.alert(
                I18n.t('gpsDisabled_errorTitle'),
                `${I18n.t('gpsDisabled_errorDescription')} \n\n ${
                  error.message
                }`,
              );
            }, 500);
          }
        },
        {
          enableHighAccuracy: enableHighAccuracy,
          timeout: 7000, // MAX 7 SECONDS
          maximumAge: 60000,
        },
      );
    } else {
      this.setState({isLoadingGps: false});
    }
  };

  handleSelectCity = (city, zoomAll = false) => {
    if (!city) {
      return;
    }

    const {beachSpots} = this.props;

    if (!beachSpots) {
      return;
    }

    const closestCluster = getNearestSpot(
      CLUSTER_RENDERED,
      city.center,
      false,
      [city],
    );
    let closestClusterDistance = 0;
    if (closestCluster) {
      closestClusterDistance = getGpsPointsDistance(
        closestCluster.latitude,
        closestCluster.longitude,
        city.center[0],
        city.center[1],
      );
    }
    mapRef.map.getCamera().then(camera => {
      latestRecordedZoom = camera.zoom;
      if (
        !zoomAll &&
        camera.zoom < CITY_MARKER_MAX_ZOOM &&
        closestClusterDistance < 15
      ) {
        mapRef.map.animateCamera({
          center: {
            latitude: parseFloat(city.center[0]),
            longitude: parseFloat(city.center[1]),
          },
          zoom: PIN_SHOW_MIN_ZOOM,
        });
      } else {
        this.setState({showSearchSuggestions: false});
        this.searchBar.cancel();

        const closestSpot = getNearestSpot(
          this.state.visibleBeachSpots,
          city.center,
        );

        if (!closestSpot) {
          return;
        }

        mapRef.map.animateCamera({
          center: {
            latitude: parseFloat(closestSpot.latitude),
            longitude: parseFloat(closestSpot.longitude),
          },
          zoom: AUTO_ZOOM_AREA,
        });

        this.selectBeachSpot(closestSpot, true, false);
      }

      // ADDED THIS TO FORCE PIN REFRESH ON MARKER PRESS, IN THIS WAY CLUSTERS CAN UPDATE ON ZOOM
      // setTimeout(() => {
      //   this.updateMapOnDragComplete();
      // }, 1000);
    });
  };

  selectBeachSpot = (
    beachSpot,
    doCarouselScroll = true,
    doCarouselAnimation = true,
  ) => {
    const {userAuth, beachSpots} = this.props;

    if (!beachSpots || !beachSpot) {
      return;
    }

    this.props.setPinActive(beachSpot.id);

    // CALCULATE DISTANCE
    let highlightedBeachSpotDistance = null;
    if (userAuth.geolocation.coords.latitude) {
      highlightedBeachSpotDistance = getGpsPointsDistance(
        userAuth.geolocation.coords.latitude,
        userAuth.geolocation.coords.longitude,
        beachSpot.latitude,
        beachSpot.longitude,
      );
    }

    const highlightedBeachSpotMaxDistance = calculateReportMaxDistance(
      beachSpot.length,
    );

    // SET MEGAPHONE STATE
    let megaphoneState = {};
    if (
      !beachSpot.last_spot_state.user_id &&
      beachSpot.last_spot_state.reports > 0
    ) {
      megaphoneState = {
        showReportButtonCheck: true,
        showReportButtonNew: false,
      };
    } else if (!beachSpot.last_spot_state.user_id) {
      megaphoneState = {
        showReportButtonCheck: false,
        showReportButtonNew: true,
      };
    }

    this.setState({
      ...megaphoneState,
      isCloseToSpot:
        highlightedBeachSpotDistance &&
        highlightedBeachSpotDistance < highlightedBeachSpotMaxDistance,
      highlightedBeachSpot: beachSpot,
      highlightedBeachSpotDistance: highlightedBeachSpotDistance,
      highlightedBeachSpotMaxDistance: highlightedBeachSpotMaxDistance,
    });

    // CAROUSEL SCROLL
    if (doCarouselScroll) {
      const index = this.state.visibleBeachSpots.findIndex(
        beachSpotElement => beachSpotElement.id === beachSpot.id,
      );
      this._carousel.scrollToIndex({
        animated: doCarouselAnimation,
        index: index,
        viewPosition: isIOS ? 0 : -0.6,
      });
    }

    // RE RENDER PINS TO FIX IOS BUG ON PIN SIZE INCREASE
    this.setState({reRenderPins: false}, () => {
      this.setState({reRenderPins: true});
    });
  };

  handleSelectBeachSpotSuggestion = beachSpot => {
    if (!beachSpot) {
      return;
    }

    this.setState(
      {showSearchSuggestions: false, textSearchInProgress: true},
      () => {
        mapRef.map.animateCamera({
          center: {
            latitude: parseFloat(beachSpot.latitude),
            longitude: parseFloat(beachSpot.longitude),
          },
          zoom: AUTO_ZOOM_PIN,
        });

        this.searchBar.cancel();
        this.props.updateBeachSpotsVisible(true, () => {
          setTimeout(() => {
            this.selectBeachSpot(beachSpot, true, false);
          }, 500);

          this.props.setSearchFiltersActive([]);

          this.setState({textSearchInProgress: false});
        });
      },
    );
  };

  renderSearchSuggestionCity = city => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.handleSelectCity(city, true);
        }}>
        <View style={this.styles.searchSuggestionElement}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={this.styles.searchSuggestionText}>
            {city.name[I18n.locale]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderSearchSuggestionBeachSpot = beachSpot => {
    if (beachSpot[0] === 'beachSpot') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.handleSelectBeachSpotSuggestion(beachSpot[1]);
          }}>
          <View style={this.styles.searchSuggestionElementBeachSpot}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={this.styles.searchSuggestionText}>
              {beachSpot[1].name}
            </Text>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={this.styles.searchSuggestionTextSecond}>
              {beachSpot[1].locality} - {beachSpot[1].city.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.handleSelectCity(beachSpot[1], true);
          }}>
          <View style={this.styles.searchSuggestionElement}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={this.styles.searchSuggestionText}>
              {beachSpot[1].name[I18n.locale]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  renderSearchSuggestions = () => {
    const {citiesArray, searchResults} = this.state;

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        style={this.styles.searchSuggestionsContainer}>
        {searchResults.length > 0 &&
          searchResults.map(beachSpot =>
            this.renderSearchSuggestionBeachSpot(beachSpot),
          )}
        {!searchResults.length > 0 &&
          citiesArray.map(city => this.renderSearchSuggestionCity(city))}

        <View style={this.styles.searchSuggestionElement}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={this.styles.searchSuggestionText}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  };

  showSearchSuggestions = () => {
    this.setState({showSearchSuggestions: true});
  };

  hideSearchSuggestions = () => {
    this.setState({showSearchSuggestions: false});
  };

  showCardDetails = beachSpot => {
    if (!this.carouselBeginDragged) {
      this.props.navigation.navigate({
        routeName: beachSpot.is_private
          ? 'BeachSpotPrivateDetails'
          : 'BeachSpotDetails',
        params: {
          id: beachSpot.id,
        },
      });
    }
  };

  onCarouselScrollBegin = () => {
    // console.log('CAROUSEL DRAGGED')
    // this.setState({showReportButton: false})
    this.carouselBeginDragged = true;
  };
  onCarouselMomentumScrollEnd = () => {
    if (this.carouselBeginDragged && this.latestViewableElement) {
      this.onMarkerPress(this.latestViewableElement, false);
      this.carouselBeginDragged = false;
    }
  };

  onCarouselViewChanged = data => {
    console.log('carousel changed', data.viewableItems[0]?.index);
    if (this.carouselBeginDragged) {
      // SET LATEST VIEWABLE ITEM
      if (data.viewableItems && data.viewableItems[0]) {
        this.setState({isActive: data.viewableItems[0]?.index});
        this.latestViewableElement = data.viewableItems[0].item;
      }
    }
  };
  onViewableItemsChanged = ({viewableItems, changed}) => {
    const index = viewableItems[0]?.index;
    this.setState({isActive: index});
    // console.log('Visible items are', viewableItems[0]?.index);
    // console.log('Changed in this iteration', changed);
  };

  toggleHideFull = () => {
    if (this.props.filtered.hideFull) {
      this.props.unsetFilterHideFull();
    } else {
      this.props.setFilterHideFull();
    }
    // this.setState({carouselRefresh: this.state.carouselRefresh+1})
    // console.log(this.state.carouselRefresh)
  };

  toggleShowOnlyAdmin = () => {
    if (this.props.filtered.onlyOwnedBy) {
      this.props.unsetFilterOnlyOwned();
    } else {
      if (this.props.userAuth.details.owner) {
        this.props.setFilterOnlyOwned(this.props.userAuth.details.owner.id);
      }
    }
    // this.setState({carouselRefresh: this.state.carouselRefresh+1})
    // console.log(this.state.carouselRefresh)
  };

  renderFloatingButtons = () => {
    return (
      <View
        style={[
          this.styles.floatingButtonsContainer,
          {
            bottom:
              latestRecordedZoom >= MARKER_ZOOM_SHOW
                ? isIOS
                  ? isIPhoneX
                    ? CARD_HEIGHT + 125
                    : CARD_HEIGHT + 110
                  : CARD_HEIGHT + 30
                : isIOS
                ? isIPhoneX
                  ? 125
                  : 110
                : 15,
          },
        ]}>
        <TouchableOpacity
          onPress={() => this.showSearchFiltersModal(true)}
          style={this.styles.tagContainerShadow}>
          {this.props.filtered.searchFiltersActive.length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -5,
                left: -5,
                width: 20,
                height: 20,
                color: 'white',
                backgroundColor: Colors.red,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 999,
                borderStyle: 'solid',
              }}>
              <Text style={{color: 'white'}}>
                {this.props.filtered.searchFiltersActive.length}
              </Text>
            </View>
          )}
          <OIcon name={'filters'} color={Colors.text} size={25} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.accessLocationAndGetSpots('all')}
          style={[
            this.styles.tagContainerShadow,
            {
              backgroundColor:
                this.state.permissionStatus == 'blocked'
                  ? '#7B7B7B'
                  : this.state.permissionStatus == 'denied'
                  ? '#7B7B7B'
                  : this.state.permissionStatus == 'granted'
                  ? 'white'
                  : 'white',
            },
          ]}>
          <Icon name={'crosshairs-gps'} color={Colors.darkgrey} size={20} />
          {/* <Text style={this.styles.tagText}>
              {I18n.t('mapFilter_showClosest')}
            </Text> */}
        </TouchableOpacity>
        {/*{login.isLogged && details.is_owner && (*/}
        {/*  <TouchableOpacity*/}
        {/*    onPress={this.toggleShowOnlyAdmin}*/}
        {/*    style={[*/}
        {/*      this.styles.tagContainerShadow,*/}
        {/*      {*/}
        {/*        backgroundColor: filtered.onlyOwnedBy*/}
        {/*          ? Colors.activeButton*/}
        {/*          : 'white',*/}
        {/*      },*/}
        {/*    ]}>*/}
        {/*    <Icon*/}
        {/*      name={'crown'}*/}
        {/*      color={filtered.onlyOwnedBy ? 'white' : Colors.darkgrey}*/}
        {/*      size={16}*/}
        {/*    />*/}
        {/*    <Text*/}
        {/*      style={[*/}
        {/*        this.styles.tagText,*/}
        {/*        {color: filtered.onlyOwnedBy ? 'white' : null},*/}
        {/*      ]}>*/}
        {/*      {I18n.t('mapFilter_showAdministrated')}*/}
        {/*    </Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*)}*/}
        {/*<TouchableOpacity*/}
        {/*  onPress={this.toggleHideFull}*/}
        {/*  style={[*/}
        {/*    this.styles.tagContainerShadow,*/}
        {/*    {*/}
        {/*      backgroundColor: filtered.hideFull*/}
        {/*        ? Colors.activeButton*/}
        {/*        : 'white',*/}
        {/*    },*/}
        {/*  ]}>*/}
        {/*  <IconFeather*/}
        {/*    name={'users'}*/}
        {/*    color={filtered.hideFull ? 'white' : Colors.darkgrey}*/}
        {/*    size={16}*/}
        {/*  />*/}
        {/*  <Text*/}
        {/*    style={[*/}
        {/*      this.styles.tagText,*/}
        {/*      {color: filtered.hideFull ? 'white' : null},*/}
        {/*    ]}>*/}
        {/*    {I18n.t('mapFilter_hideFull')}*/}
        {/*  </Text>*/}
        {/*</TouchableOpacity>*/}
      </View>
    );
  };
  showSearchFiltersModal = state => {
    this.setState({isFilterModalOpen: state});
  };

  _keyExtractor = (item, i) => i.toString();

  // getBeachSpotName = (highlightedBeachSpot) => {
  //   const state = this.props.beachStates[highlightedBeachSpot.last_spot_state.beach_state_id]['name'][I18n.locale]
  //   return state.charAt(0).toUpperCase() + state.slice(1)
  // }

  renderMegaphoneCTA = () => {
    const {beachStates} = this.props;
    const {
      showReportButtonNew,
      showReportButtonCheck,
      highlightedBeachSpot,
    } = this.state;

    return (
      <Animatable.View
        animation="tada"
        easing="ease-in"
        delay={0}
        iterationDelay={3700}
        duration={1000}
        iterationCount="infinite"
        useNativeDriver={true}
        style={this.styles.megaphoneCtaContainer}>
        <TouchableOpacity
          onPress={() => {
            this.showCardDetails(highlightedBeachSpot);
          }}>
          <Text numberOfLines={2} style={this.styles.megaphoneCtaText}>
            {showReportButtonNew &&
              I18n.t('beachSpotMegaphone_nearReportCTAnew')}
            {showReportButtonCheck &&
              I18n.t('beachSpotMegaphone_nearReportCTAcheck', {
                stateName:
                  beachStates[
                    highlightedBeachSpot.last_spot_state.beach_state_id
                  ].name[I18n.locale],
              })}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  render() {
    const {beachSpots, places, userAuth, beachStates} = this.props;
    const {visibleBeachSpots, showZoomOutAlert, delayFirstAlert} = this.state;
    const {
      reRender,
      showBeachSpots,
      permissionStatus,
      showPermissionModal,
      searchInput,
      showSearchSuggestions,
      isLoadingGps,
      showReportButton,
      highlightedBeachSpot,
      isCloseToSpot,
    } = this.state;

    CLUSTER_RENDERED = [];
    // console.log("distance", highlightedBeachSpotDistance)
    // console.log("max", highlightedBeachSpotMaxDistance)
    // console.log(highlightedBeachSpotDistance < highlightedBeachSpotMaxDistance)

    return reRender ? null : (
      <View style={this.styles.mapContainer}>
        <Spinner
          cancelable={true}
          visible={isLoadingGps}
          textContent={I18n.t('GPS_positionLoading')}
          textStyle={{color: 'white'}}
        />
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={this.styles.map}
          initialRegion={{
            latitude: 41.026737406025276,
            longitude: 16.87006775289774,
            latitudeDelta: 5.126042403742574,
            longitudeDelta: 4.119872376322746,
          }}
          customMapStyle={mapStyle}
          showsUserLocation={permissionStatus === 'granted'}
          showsMyLocationButton={false}
          loadingEnabled={false}
          onRegionChangeComplete={this.updateMapOnDragComplete}
          // onPanDrag={this.onMapDragStart}
          // onRegionChange={this.updateMapOnDrag}
          ref={ref => {
            mapRef.map = ref;
          }}
          // superClusterRef={superClusterRef.superCluster}
          tracksViewChanges={false}
          // radius={1}
          // extent={256}
          // renderCluster={this.renderCluster}
          maxZoom={AUTO_ZOOM_PIN}
          showsPointsOfInterest={false}>
          {showBeachSpots &&
            !beachSpots.isFetching &&
            visibleBeachSpots &&
            visibleBeachSpots.map((beachSpot, index) => {
              if (!beachSpot.isOutOfScreen && beachSpot.isVisible) {
                return (
                  // THIS CHECK FORCES RERENDER IF PIN BECOMES ACTIVE (FIX IOS BUG ON SIZE INCREASE)
                  (!beachSpot.isActive || this.state.reRenderPins) && (
                    <OMarker
                      key={index}
                      beachSpot={beachSpot}
                      onMarkerPress={this.onMarkerPress}
                    />
                  )
                );
              } else {
                return null;
              }
            })}
          {!showBeachSpots &&
            !beachSpots.isFetching &&
            visibleBeachSpots &&
            places.cities &&
            Object.keys(places.cities).map(city => {
              // latestDistance = getGpsPointsDistance(
              //   latestClusterRendered.latitude,
              //   latestClusterRendered.longitude,
              //   places.cities[city].latitude,
              //   places.cities[city].longitude,
              // );

              // if (
              //   places.cities[city].latitude &&
              //   (latestDistance > 50 ||
              //     latestRecordedZoom >= CLUSTER_AGGREGATOR_ZOOM)
              // ) {
              // latestClusterRendered = {
              //   latitude: places.cities[city].latitude,
              //   longitude: places.cities[city].longitude,
              // };

              const visibleSpots = visibleBeachSpots.filter(
                bs => bs.city.id == city,
              );

              const clusterNumber = visibleSpots.length;

              //+ additionalClusters;
              // console.log('COUNT - ADDITIONAL - TOTAL', `${places.cities[city].beach_spot_count} - ${additionalClusters} - ${clusterNumber}`)
              // additionalClusters = 0;

              if (clusterNumber > 0) {
                CLUSTER_RENDERED.push(places.cities[city]);
                return (
                  <OMarker
                    beachSpotCount={clusterNumber}
                    // key={Math.random()}
                    beachSpot={places.cities[city]}
                    onMarkerPress={this.onCityMarkerPress}
                    pinColor={Colors.pinGroup}
                    noPin={true}
                  />
                );
              }
              // } else {
              //   if (places.cities[city].beach_spot_count) {
              //     additionalClusters += places.cities[city].beach_spot_count;
              //   }
              //   return null;
              // }
            })}
        </MapView>
        {!beachSpots.isFetching && showZoomOutAlert && delayFirstAlert && (
          <View
            style={{
              position: 'absolute',
              top: isIOS ? (isIPhoneX ? 190 : 160) : 140,
              justifyContent: 'center',
              height: 60,
              width: '80%',
              marginHorizontal: '10%',
              backgroundColor: Colors.redShade,
              paddingHorizontal: 25,
              paddingVertical: 10,
              borderRadius: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: Fonts.size.small,
                fontFamily: Fonts.type.base,
                color: 'white',
              }}>
              {visibleBeachSpots.length} risultati.{' '}
              {visibleBeachSpots.length > 0
                ? 'Sposta la mappa per visualizzare i punti piu vicini'
                : 'Prova con diversi filtri'}
            </Text>
          </View>
        )}
        {/* <SearchModal isModal={this.state.modelOpen} setModal={this.setModel} />
        <TouchableOpacity onPress={() => this.state({modelOpen: true})}>
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 0,
            }}>
            <IconFeather
              name={'arrow-left'}
              color={'rgba(255, 59, 95, 1)'}
              size={25}
              style={{
                marginRight: 15,
              }}
            />
            <Text>filters</Text>
          </View>
        </TouchableOpacity> */}
        {visibleBeachSpots && (
          <View
            style={[
              this.styles.carouselContainer,
              {
                bottom: showBeachSpots
                  ? isIOS
                    ? isIPhoneX
                      ? 105
                      : 90
                    : 0
                  : -500,
              },
            ]}>
            <FlatList
              bounces={false}
              horizontal
              data={visibleBeachSpots}
              extraData={this.state.refreshFlatList}
              renderItem={this._renderItem}
              keyExtractor={item => item.id}
              containerWidth={CAROUSEL_WIDTH}
              ref={c => {
                this._carousel = c;
              }}
              getItemLayout={this.getItemLayout}
              onScrollBeginDrag={this.onCarouselScrollBegin}
              onViewableItemsChanged={this.onCarouselViewChanged}
              onMomentumScrollEnd={this.onCarouselMomentumScrollEnd}
              viewabilityConfig={VIEWABILITY_CONFIG}
              updateCellsBatchingPeriod={4000}
              // automaticallyAdjustContentInsets={false}
              contentContainerStyle={{
                alignItems: 'flex-end',
              }}
              style={{width: Metrics.windowWidth}}
              showsHorizontalScrollIndicator={false}
              // initialScrollIndex={1}

              numColumns={1}
              snapToAlignment={'center'}
              snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
              decelerationRate={isIOS ? 0 : 'fast'}
              pagingEnabled
            />
          </View>
        )}
        <Portal>
          <BeachSpotSearchByFilters
            isVisible={this.state.isFilterModalOpen}
            onClose={() => this.showSearchFiltersModal(false)}
          />
        </Portal>
        <SearchBar
          platform={'android'}
          placeholder={I18n.t('searchBar_placeholder')}
          onChangeText={this.updateSearchInput}
          value={searchInput}
          containerStyle={this.styles.searchBarContainer}
          inputContainerStyle={this.styles.searchBarInputContainer}
          inputStyle={this.styles.searchBarInput}
          onSubmitEditing={this.onSearchEnter}
          placeholderTextColor={Colors.grey}
          onFocus={this.showSearchSuggestions}
          onBlur={this.hideSearchSuggestions}
          ref={search => (this.searchBar = search)}
        />
        <Macros />
        {this.renderFloatingButtons()}
        {showPermissionModal && (
          <OModal
            isVisible={showPermissionModal}
            closeHandler={() => this.setState({showPermissionModal: false})}
            confirmHandler={this.handlePermissionConfirm}
            cancelHandler={this.handlePermissionCancel}
            title={I18n.t('permissionModalGPS_title')}
            message={I18n.t('permissionModalGPS_message')}
            confirmMessage={
              permissionStatus === 'blocked'
                ? I18n.t('permissionModalGPS_blocked')
                : I18n.t('permissionModalGPS_ok')
            }
            cancelMessage={isIOS ? null : I18n.t('permissionModalGPS_cancel')}
          />
        )}

        {beachSpots.isFetching && (
          <ActivityIndicator
            style={[
              this.styles.ActivityIndicator,
              {bottom: showBeachSpots ? 160 : 20},
            ]}
            size="large"
            color={Colors.pinBlack}
          />
        )}

        {/*{showReportButton &&*/}
        {/*  (isCloseToSpot ? (*/}
        {/*    this.renderMegaphoneCTA()*/}
        {/*  ) : (*/}
        {/*    <Animatable.View*/}
        {/*      animation="tada"*/}
        {/*      easing="ease-in"*/}
        {/*      delay={0}*/}
        {/*      iterationDelay={1700}*/}
        {/*      duration={1000}*/}
        {/*      iterationCount="infinite"*/}
        {/*      useNativeDriver={true}*/}
        {/*      style={this.styles.megaphoneContainer}>*/}
        {/*      <TouchableOpacity*/}
        {/*        onPress={() => {*/}
        {/*          this.showCardDetails(highlightedBeachSpot);*/}
        {/*        }}>*/}
        {/*        <IconEntypo*/}
        {/*          style={this.styles.megaphoneIcon}*/}
        {/*          name={'megaphone'}*/}
        {/*          size={33}*/}
        {/*          color={'white'}*/}
        {/*        />*/}
        {/*      </TouchableOpacity>*/}
        {/*    </Animatable.View>*/}
        {/*  ))}*/}

        {showSearchSuggestions && this.renderSearchSuggestions()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  ...mapStateToPropsDefault(state),
  map: state.beachSpots.map,
  places: state.startup.initVariables.places,
  beachSpots: state.beachSpots.all,
  beachStates: state.startup.initVariables.beach_states,
  // filteredBeachSpots: state.beachSpots.filtered,
  filtered: state.beachSpots.filtered,
  // nearbySpots: state.beachSpots.nearby,
  userAuth: state.userAuth,
});

const mapDispatchToProps = dispatch => ({
  ...mapDispatchToPropsDefault(dispatch),
  getAllBeachSpots: page =>
    dispatch(BeachSpotActions.getAllBeachSpotsRequest(page)),
  updateBeachSpotsVisible: (resetAll, resolve) =>
    new Promise(() => {
      dispatch(BeachSpotsActions.updateBeachSpotsVisible(resetAll));
      resolve();
    }),
  unsetMapCentering: () => dispatch(BeachSpotActions.unsetMapNeedsCentering()),
  setMapCenter: center => dispatch(BeachSpotActions.setMapCenter(center)),
  // getNearbyBeachSpots: (params) => dispatch(BeachSpotActions.getNearbyBeachSpotsRequest(params)),
  setPinActive: id => dispatch(BeachSpotActions.setPinActive(id)),
  fireRedrawMarkers: type => dispatch(BeachSpotActions.fireRedrawMarkers(type)),
  setFilterHideFull: () => dispatch(BeachSpotActions.setFilterHideFull()),
  unsetFilterHideFull: () => dispatch(BeachSpotActions.unsetFilterHideFull()),
  setFilterOnlyOwned: userId =>
    dispatch(BeachSpotActions.setFilterOnlyOwned(userId)),
  unsetFilterOnlyOwned: userId =>
    dispatch(BeachSpotActions.unsetFilterOnlyOwned(userId)),
  setUserLocation: info => dispatch(UserAuthActions.setUserLocation(info)),
  setSearchFiltersActive: filters =>
    dispatch(BeachSpotActions.setSearchFiltersActive(filters)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(renderWhenFocused(MapScreen));
