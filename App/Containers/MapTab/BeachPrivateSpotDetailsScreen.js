// @flow

import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  Modal, RefreshControl, Platform, Animated,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import I18n from 'i18n-js';
import Spinner from 'react-native-loading-spinner-overlay';
import R from 'ramda';
import moment from 'moment';

import {Fonts, Metrics, Colors, Images} from '../../Themes';
import {ReservationModal} from './Reservation/ReservationModal';
import buttonStylesFactory from '../../Components/Styles/ButtonStyle';
import stylesfactory from '../Styles/BeachSpotDetailsModal';
import {BeachSpotNavbar} from './BeachSpotNavbar';
import {AuthModal} from '../Login/AuthModal';
import BeachSpotActions from '../../Redux/BeachSpotRedux';
import IconFeather from 'react-native-vector-icons/dist/Feather';

import {
  Map,
  Tags,
  Weather,
  Description,
  Locality,
  Title,
  MediaCarousel,
  Handlebar,
} from '../../Components/BeachSpot';
import {HtmlViewer} from '../../Components/BeachSpot/HtmlViewer';
import NearBeachspots from './NearBeachspots';
import BeachspotPrivateServices from '../../Components/BeachSpot/BeachspotPrivateServices';
import TermsCancellation from '../../Components/BeachSpot/TermsCancellation';
import PrivateRegulations from '../../Components/BeachSpot/PrivateRegulations';
import BottomButton from '../../Components/BeachSpot/BottomButton';
import {isIos} from 'react-native-modalize/lib/utils/devices';
import {isIphoneX} from 'react-native-iphone-x-helper';
import BackButton from '../../Components/Navigation/BackButton';
import {BlurView} from '@react-native-community/blur';

const TOP_IMAGE_HEIGHT = (Metrics.windowHeight / 6) * 2.3;
const isIOS = Platform.OS === 'ios';
const isIPhoneX = isIphoneX();

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)

export const BeachPrivateSpotDetailsScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const animatedValue = new Animated.Value(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [showHtmlInfo, setshowHtmlInfo] = useState(false);

  const reservationModalRef = useRef(null);
  const authModalRef = useRef(null);
  const imageCarouselRef = useRef(null);

  const [modelOpen, setModelOpen] = useState(false);
  const userData = useSelector(state => state.userAuth);
  const currentBeach = useSelector(state => state.beachSpots.current.data);
  const nearBeaches = useSelector(state => state.beachSpots.nearby.data);
  // console.log('nearBeaches',nearBeaches)
  const {login} = userData;

  useEffect(() => {
    dispatch(BeachSpotActions.getBeachSpotRequest(navigation.state.params.id));
    // dispatch(
    //   BeachSpotActions.getNearbyBeachSpotsRequest({
    //     latitude: currentBeach.latitude,
    //     longitude: currentBeach.longitude,
    //     limit: 10,
    //     sea_id: currentBeach.sea_id,
    //   }),
    // );
  }, [dispatch, navigation.state.params.id]);

  useEffect(() => {
    setTimeout(() => {
      setshowHtmlInfo(true);
    }, 1500);


    // THIS DOES NOT WORK ON FUNCIONAL COMPONENTS
    const startAnchor = Metrics.parallaxHeaderHeight - 150 - Metrics.bigNavBarHeight;
    const endAnchor = Metrics.parallaxHeaderHeight - Metrics.bigNavBarHeight;
    navigation.setParams({
      titleOpacity: animatedValue.interpolate({
        inputRange: [startAnchor, endAnchor],
        outputRange: [0, 1],
        extrapolate: "clamp"
      })
    });
  }, []);

  // this.props.navigation.setParams({beachSpot: newProps.beachSpot})

  const beachSpotState = useSelector(state => state.beachSpots?.current);
  const beaches = useSelector(state => state.beachSpots.all);

  useEffect(() => {
    if (beachSpotState.data){
      navigation.setParams({ beachSpot: beachSpotState.data });
    }
  }, [beachSpotState.data]);


  const buttonStyles = buttonStylesFactory.getSheet();
  const styles = stylesfactory.getSheet();
  const showBeachSpotDetails = beachSpot => {
    navigation.navigate({
      routeName: beachSpot.is_private
        ? 'BeachSpotPrivateDetails'
        : 'BeachSpotDetails',
      key: `Always-push-${Math.random() * 10000}`,
      params: {
        id: beachSpot.id,
      },
    });
  };
  const renderBottomBar = () => (
    <View style={[styles.bottomContainer]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: '#FF3B5F',
            width: 280,
            borderRadius: 26,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (login.isLogged) {
              reservationModalRef.current?.open();
            } else {
              authModalRef.current?.open();
            }
          }}>
          <Text
            style={[
              {
                fontFamily: Fonts.type.bold,
                fontSize: Fonts.size.medium,
                color: 'white',
                // marginLeft: 10,
                fontWeight: '800',
              },
            ]}>
            {I18n.t('beachSpotBook')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (beachSpotState.isFetching) {
    return (
      <Spinner
        cancelable={false}
        visible
        textContent=""
        textStyle={{color: 'white'}}
      />
    );
  }

  if (
    !beachSpotState.data ||
    R.isEmpty(beachSpotState.data) ||
    !beachSpotState.data.is_private
  ) {
    return null;
  }

  const beachSpot = beachSpotState.data;

  const renderStartingPrice = () => (
    <View style={styles.startingPriceContainer}>
      <Text
        style={{
          fontSize: Fonts.size.tiny,
          color: Colors.lightgrey,
          position: 'absolute',
          marginTop: 50,
          bottom: 0,
          right: 50,
        }}>
        {I18n.t('beachSpotStartingFrom')}
      </Text>
      <Text
        style={{
          color: Colors.bookOrange,
          fontSize: Fonts.size.regular,
          fontFamily: Fonts.type.bold,
        }}>
        {beachSpot.min_price}€
      </Text>
    </View>
  );

  const renderInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.infoTitle}>{I18n.t('beachSpot_info_title')}</Text>
      <View style={styles.infoRow}>
        <Image source={Images.beach.openings} style={styles.infoRowImage} />
        <View style={{flex: 1}}>
          <Text style={styles.infoRowTitle}>
            {I18n.t('beachSpot_info_opening_time')}
          </Text>
          <Text style={styles.infoRowMessage}>
            {I18n.t('beachSpot_info_opening_message', {
              opening: moment(beachSpot.timings_detail.opening_time).format(
                'HH:mm',
              ),
              closing: moment(beachSpot.timings_detail.closing_time).format(
                'HH:mm',
              ),
            })}
          </Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Image source={Images.beach.book} style={styles.infoRowImage} />
        <View style={{flex: 1}}>
          <Text style={styles.infoRowTitle}>
            {I18n.t('beachSpot_info_book')}
          </Text>
          <Text style={styles.infoRowMessage}>
            {I18n.t('beachSpot_info_book_message')}
          </Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Image source={Images.beach.book} style={styles.infoRowImage} />
        <View style={{flex: 1}}>
          <Text style={styles.infoRowTitle}>Bambini compresi nel prezzo</Text>
          <Text style={styles.infoRowMessage}>
            Non è previsto nessun costo aggiuntivo per i bambini al di sotto
            degli 8 anni.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderServices = () => {
    if (
      !beachSpot.beach_spot_services ||
      beachSpot.beach_spot_services.length === 0
    ) {
      return;
    }
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>
          {I18n.t('beachSpot_info_services')}
        </Text>
        {beachSpot.beach_spot_services.map(s => (
          <Text key={s.id} style={styles.serviceText}>
            {s.description}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <AnimatedScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            progressViewOffset={100000}
            progressBackgroundColor={'transparent'}
            tintColor="transparent"
            colors={['transparent']}
            style={{backgroundColor: 'transparent'}}
            // refreshing={latestReports.isFetching}
            onRefresh={() => {
              navigation.goBack()
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([
          {nativeEvent: {contentOffset: {y: animatedValue}}}
        ], {useNativeDriver: true})}
        scrollEventThrottle={1}
      >
        <View style={{height: Metrics.navBarHeightAdjusted}} />
        <MediaCarousel
          ref={imageCarouselRef}
          beachSpot={beachSpot}
          isNavbarVisible={isNavbarVisible}
          setIsNavbarVisible={setIsNavbarVisible}
        />
        <View style={styles.innerContainer}>
          <Handlebar />
          <Title beachSpot={beachSpot} rightComponent={renderStartingPrice()} />
          <Locality beachSpot={beachSpot} rightComponent={null} />
          <Description beachSpot={beachSpot} isPrivate={true} />
          <Weather beachSpot={beachSpot} />
        </View>
        {/*{renderInfo()}*/}
        <Map beachSpot={beachSpot} />

        <View style={{marginHorizontal: 20, paddingBottom: 100}}>
          {/*<BeachspotPrivateServices />*/}
          {/*<TermsCancellation />*/}
          {/*<PrivateRegulations />*/}
          {/*<NearBeachspots*/}
          {/*  beaches={nearBeaches}*/}
          {/*  showDetails={showBeachSpotDetails}*/}
          {/*/>*/}

          {/* <Modal visible={modelOpen} animationType="slide">
            <View style={{backgroundColor: '#E5E5E5', height: '100%'}}>
              <View
                style={{
                  backgroundColor: '#E5E5E5',
                  margin: 20,
                }}>
                <FilterHeading />
              </View>
              <TouchableOpacity
                onPress={() => setModelOpen(false)}
                style={{
                  backgroundColor: 'purple',
                  justifyContent: 'flex-end',
                  position: 'absolute',
                  marginTop: 50,
                  bottom: 0,
                  right: 50,
                }}>
                <View>
                  <Text style={{textAlign: 'center'}}>Click Me</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          <TouchableOpacity onPress={() => setModelOpen(true)}>
            <View
              style={{
                flexDirection: 'row',
                // position: 'absolute',
                // top: 0,
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
          <Tags beachSpot={beachSpot} only_private={true} title={'Servizi ed attività offerti'} />
          <Tags beachSpot={beachSpot} only_public={true} title={'Altre caratteristiche'}  />
        </View>

        {/* <BottomButton isPrivate={true}/> */}

        {/* {renderServices()} */}

        {/* {showHtmlInfo && beachSpot.public_owner.info && (
          <View
            style={{
              borderRadius: 20,
              backgroundColor: Colors.sukinoGrey,
              marginTop: 10,
              paddingTop: 40,
              marginBottom: 20,
            }}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.text,
                  fontFamily: Fonts.type.bold,
                  textAlign: 'center',
                  marginBottom: 5,
                }}>
                {I18n.t('beachSpot_municipalityBanner')}
              </Text>
            </View>
            <View
              style={{
                paddingVertical: Metrics.doubleBaseMargin,
                paddingHorizontal: Metrics.doubleBaseMargin,
              }}>
              <HtmlViewer content={beachSpot.public_owner.info} />
            </View>
          </View>
        )} */}
      </AnimatedScrollView>
      {renderBottomBar()}
      <ReservationModal
        navigation={navigation}
        ref={reservationModalRef}
        beachSpot={beachSpot}
      />
      {!login.isLogged && <AuthModal ref={authModalRef} />}
    </View>
  );
};

BeachPrivateSpotDetailsScreen.navigationOptions = ({navigation, props}) => {
  return {
    headerLeft: <BackButton color={Colors.text} navigation={navigation}/>,
    headerTitle: null,
    headerRight: <BeachSpotNavbar beachSpot={navigation.state.params.beachSpot}/>,
    headerTransparent: true,
    headerBackground:
      (
        <View
          style={
            {
              flex: 1,
              backgroundColor: 'transparent'
            }
          }
        >
          <BlurView
            style={{flex: 1}}
            blurType="ultraThinMaterialLight"
            overlayColor=""
            blurAmount={isIOS ? 1 : 100}
            reducedTransparencyFallbackColor="white"
          />
        </View>
      )
  }
}
