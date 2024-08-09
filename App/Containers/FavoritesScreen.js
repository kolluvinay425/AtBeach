import React, {useRef} from 'react';
import ApplicationComponent, {
  mapDispatchToPropsDefault,
  mapStateToPropsDefault,
} from './ApplicationComponent';

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
  ImageBackground,
} from 'react-native';
import {SearchBar} from 'react-native-elements';

import R from 'ramda';

import {connect} from 'react-redux';
import I18n from 'i18n-js';

import BeachSpotActions from '../Redux/BeachSpotRedux';

import stylesfactory from './Styles/MapScreenStyle';

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

import renderWhenFocused from 'render-when-focused';
import {Colors, Fonts, Images, Metrics} from '../Themes';
import BeachSpotCard from './MapTab/BeachSpotCard';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import metrics from '../Themes/Metrics';
import Header from '../Components/Header';

const isIOS = Platform.OS === 'ios';

class FavoritesScreen extends ApplicationComponent {
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

    this.doAllRequests();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    super._UNSAFE_componentWillReceiveProps(newProps);
  }

  doAllRequests = force => {};

  showBeachSpotDetails = beachSpot => {
    this.props.navigation.navigate({
      routeName: beachSpot.is_private
        ? 'BeachSpotPrivateDetails'
        : 'BeachSpotDetails',
      params: {
        id: beachSpot.id,
      },
    });
  };
  updateSpot = beachSpot => {
    this.setState({beachSpot: beachSpot});
  };
  deleteFav = id => {
    this.props.removeFromFav(id);
  };
  LeftActions = (dragX, spot) => {
    const scale = dragX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1.1],
    });
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 50,
        }}>
        <TouchableOpacity onPress={() => this.deleteFav(spot.id)}>
          <Animated.Text style={{transform: [{scale}]}}>
            <MaterialIcon
              name={'delete'}
              size={Metrics.icons.small}
              color={'red'}
            />
          </Animated.Text>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    const {beachSpots, favorites, beachSpot, navigation} = this.props;

    return this.state.reRender ? null : (
      <SafeAreaView
        style={{width: metrics.windowWidth, height: metrics.windowHeight}}>
        <Header heading={I18n.t('favorites_title')} />
        {beachSpots && beachSpots.data && favorites.length > 0 && (
          <ScrollView
            style={{
              padding: Metrics.doubleBaseMargin,
              paddingTop: 0,
              paddingRight: Metrics.doubleBaseMargin,
              height:
                Metrics.windowHeight -
                Metrics.tabBarHeight -
                Metrics.navBarHeightAdjusted,
            }}>
            {favorites.map(beachSpotId => {
              const beachSpot = beachSpots.data.find(
                bs => bs.id === beachSpotId,
              );

              if (beachSpot) {
                // this.updateSpot(beachSpot);
                return (
                  <View key={`${beachSpotId}`}>
                    <Swipeable
                      renderRightActions={dragX =>
                        this.LeftActions(dragX, beachSpot)
                      }
                      friction={2}>
                      <BeachSpotCard
                        style={{paddingLeft: 0, paddingRight: 0}}
                        isNotMap={true}
                        key={beachSpotId}
                        item={beachSpot}
                        showCardDetails={this.showBeachSpotDetails}
                      />
                    </Swipeable>
                  </View>
                );
              } else {
                return null;
              }
            })}
            <View key="DUMMY" style={{height: 100}} />
          </ScrollView>
        )}
        {favorites.length < 1 && (
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image
              source={Images.sdraio}
              style={{
                width: '100%',
                height: metrics.windowHeight > 750 ? 300 : 200,
                alignSelf: 'center',
              }}
              resizeMode={'contain'}
            />
            <View style={{padding: Metrics.doubleBaseMargin}}>
              <Text style={[Fonts.style.h5, {textAlign: 'center'}]}>
                Nessuna preferenza?
              </Text>
              <Text style={[Fonts.style.description, {textAlign: 'center'}]}>
                {I18n.t('favorites_subtitle')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate({
                  routeName: 'Map',
                });
              }}
              style={{
                backgroundColor: '#FF3B5F',
                color: '#FFFFFF',
                height: 56,
                minWidth: metrics.windowWidth / 1.5,
                borderRadius: 99,
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'rgba(255,255,255, 1)',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                Aggiungi la tua preferita
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  ...mapStateToPropsDefault(state),
  favorites: state.beachSpots.favorites,
  beachSpots: state.beachSpots.all,
});

const mapDispatchToProps = dispatch => ({
  ...mapDispatchToPropsDefault(dispatch),
  getAllBeachSpots: page =>
    dispatch(BeachSpotActions.getAllBeachSpotsRequest(page)),
  getNearbyBeachSpots: params =>
    dispatch(BeachSpotActions.getNearbyBeachSpotsRequest(params)),
  setPinActive: id => dispatch(BeachSpotActions.setPinActive(id)),
  removeFromFav: id => dispatch(BeachSpotActions.removeBeachSpotFavorite(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(renderWhenFocused(FavoritesScreen));
