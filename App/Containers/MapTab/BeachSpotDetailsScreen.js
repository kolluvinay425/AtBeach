// @flow

import React from 'react';
import ApplicationComponent from '../ApplicationComponent';
import {connect} from 'react-redux';
import {
  Alert,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Animated, Image, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import R, {props} from 'ramda';
import moment from 'moment';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import ActionSheet from 'react-native-actionsheet';
import {ProfileForm} from '../Login/AuthForms/ProfileForm';
import {ReportModal} from '../Login/AuthForms/ReportModal';
import stylesfactory from '../Styles/BeachSpotDetailsModal';
import buttonStylesFactory from '../../Components/Styles/ButtonStyle';
import {HtmlViewer} from '../../Components/BeachSpot/HtmlViewer';
import {BeachSpotNavbar} from './BeachSpotNavbar';
import {Fonts, Metrics, Colors, Images} from '../../Themes';
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

import urlParser from 'url';

import {
  check as checkPermission,
  request as requestPermission,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import OModal from '../../Components/OModal';
import Geolocation from 'react-native-geolocation-service';
import {
  calculateReportMaxDistance,
  getGpsPointsDistance,
} from '../../Lib/MapService';
import {FORCE_GPS_AT} from '../../Services/Api';

import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../../../assets/fonts/selection.json';
import {capacityStyle} from '../Styles/beachSpotDetailsStyles';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import NearBeachspots from './NearBeachspots';
// import MunicipalityInfo from '../../Components/BeachSpot/MunicipalityInfo';
import BottomButton from '../../Components/BeachSpot/BottomButton';
import BeachspotPrivateServices from '../../Components/BeachSpot/BeachspotPrivateServices';
import {navigateTo} from '../../Lib/Utilities';
import {isIphoneX} from 'react-native-iphone-x-helper';
import MunicipalityInfo from '../../Components/BeachSpot/MunicipalityInfo';
import BackButton from '../../Components/Navigation/BackButton';
import {BlurView} from '@react-native-community/blur';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const OIcon = createIconSetFromIcoMoon(icoMoonConfig);

const isIOS = Platform.OS === 'ios';
const isIPhoneX = isIphoneX();

const PERMISSION_TO_CHECK = isIOS
  ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
const TIMEOUTS = [];

const TOP_IMAGE_HEIGHT = (Metrics.windowHeight / 6) * 2.3;

class BeachSpotDetailsScreen extends ApplicationComponent {
  static propTypes = {
    closeHandler: PropTypes.func,
  };

  static defaultProps = {
    isFetchingCode: false,
    showHtmlInfo: false,
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.buttonStyles = buttonStylesFactory.getSheet();

    this.animatedValue = new Animated.Value(0);

    this.state = {
      ...this.state,
      showPermissionModal: false,
      isLoadingGps: false,
      gpsLoop: 0,
      isWebviewModalVisible: false,
    };
  }
  UNSAFE_componentWillMount() {
    // FIRST TIME MODAL LOADS DEFER HTML INFO RENDERING
    TIMEOUTS.push(
      setTimeout(() => {
        this.setState({showHtmlInfo: true});
      }, 1500),
    );
  }

  componentDidMount() {
    super._componentDidMount();
    this.props.getBeachSpotDetails(this.props.navigation.state.params.id);

    const startAnchor =
      Metrics.parallaxHeaderHeight - 150 - Metrics.bigNavBarHeight;
    const endAnchor = Metrics.parallaxHeaderHeight - Metrics.bigNavBarHeight;
    this.props.navigation.setParams({
      titleOpacity: this.animatedValue.interpolate({
        inputRange: [startAnchor, endAnchor],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    });
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    // console.log('newProps---------->',newProps)

    const {reportChange, beachSpot} = this.props;

    // NEW BEACHSPOT
    if (beachSpot != newProps.beachSpot && newProps.beachSpot) {
      // GETTING BEACH SPOT DISTANCE
      let beachSpotDistance = null;
      if (newProps.userAuth.geolocation.coords.latitude) {
        beachSpotDistance = getGpsPointsDistance(
          newProps.userAuth.geolocation.coords.latitude,
          newProps.userAuth.geolocation.coords.longitude,
          newProps.beachSpot.latitude,
          newProps.beachSpot.longitude,
        );
      }

      const beachSpotMaxDistance = calculateReportMaxDistance(
        newProps.beachSpot.length,
      );

      this.setState({
        beachSpotDistance: beachSpotDistance,
        beachSpotMaxDistance: beachSpotMaxDistance,
      });

      this.props.navigation.setParams({beachSpot: newProps.beachSpot});
    }

    if (
      reportChange.isFetching === true &&
      newProps.reportChange.isFetching === false
    ) {
      if (newProps.reportChange.error === false) {
        showMessage({
          message: I18n.t('reportThankYou'),
          description: I18n.t('reportSuccess', {beachSpotName: beachSpot.name}),
          type: 'success',
          backgroundColor: Colors.pinGreen,
          duration: 2000,
        });
      } else {
        showMessage({
          message: I18n.t('reportError'),
          description: I18n.t('reportFailed'),
          type: 'danger',
          backgroundColor: Colors.pinRed,
          duration: 4500,
        });
      }
    }
  }

  componentWillUnmount() {
    TIMEOUTS.forEach(timeout => {
      clearTimeout(timeout);
    });
  }

  static navigationOptions = ({navigation, props}) => {
    return {
      headerLeft: <BackButton color={Colors.text} navigation={navigation} />,
      headerTitle: null,
      headerRight: (
        <BeachSpotNavbar beachSpot={navigation.state.params.beachSpot} />
      ),
      headerTransparent: true,
      headerBackground: (
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}>
          <BlurView
            style={{flex: 1}}
            blurType="ultraThinMaterialLight"
            overlayColor=""
            blurAmount={isIOS ? 1 : 100}
            reducedTransparencyFallbackColor="white"
          />
        </View>
      ),
    };
  };

  showActionSheetOwner = () => {
    setTimeout(() => {
      this.ActionSheetOwner.show();
    }, 500);
  };
  showBeachSpotDetails = beachSpot => {
    this.props.navigation.navigate({
      routeName: beachSpot.is_private
        ? 'BeachSpotPrivateDetails'
        : 'BeachSpotDetails',
      key: `Always-push-${Math.random() * 10000}`,
      params: {
        id: beachSpot.id,
      },
    });
  };
  showActionSheetUser = () => {
    checkPermission(PERMISSION_TO_CHECK)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            // console.log('This feature is not available (on this device / in this context)');
            setTimeout(() => {
              Alert.alert(
                I18n.t('gpsDisabled_errorTitle'),
                I18n.t('gpsDisabled_errorDescription'),
              );
            }, 500);
            this.setState({permissionStatus: 'unavailable'});
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
            this.checkGpsClosenessAndContinueReport();
            break;
          case RESULTS.BLOCKED:
            // console.log('The permission is denied and not requestable anymore');
            this.setState({
              permissionStatus: 'blocked',
              showPermissionModal: true,
            });
            break;
        }
      })
      .catch(error => {
        // …
      });
  };

  beachSpotStateChange = (beach_spot_id, index) => {
    if (index === 0) {
      return;
    }

    // console.log(index)
    let beach_spot_state_id = 0;
    // CONVERT INDEX TO STATE_ID
    // 'Chiusa', 'Piena', 'Quasi piena', 'Libera'
    switch (index) {
      case 1:
        beach_spot_state_id = 4;
        break;
      case 2:
        beach_spot_state_id = 3;
        break;
      case 3:
        beach_spot_state_id = 2;
        break;
      case 4:
        beach_spot_state_id = 1;
        break;
    }

    this.props.changeBeachSpotState({
      beach_spot_id: beach_spot_id,
      beach_state_id: beach_spot_state_id,
    });
  };

  handlePermissionConfirm = () => {
    const {permissionStatus} = this.state;

    if (permissionStatus === 'denied') {
      requestPermission(PERMISSION_TO_CHECK).then(status => {
        if (status === 'granted') {
          this.setState({permissionStatus: 'granted'});
          this.checkGpsClosenessAndContinueReport();
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

  checkGpsClosenessAndContinueReport = (enableHighAccuracy = true) => {
    let canTryAgain = false;
    if (this.state.gpsLoop < 6) {
      canTryAgain = true;
    }

    if (!this.state.isLoadingGps) {
      this.setState({isLoadingGps: true});
    }

    Geolocation.getCurrentPosition(
      info => {
        // console.log(info)
        // console.log(this.props.beachSpot)

        const coordinates =
          __DEV__ && FORCE_GPS_AT.force ? FORCE_GPS_AT : info.coords;

        if (coordinates.accuracy > 50 && canTryAgain) {
          // 50 METERS ACCURACY MIN
          this.setState({gpsLoop: this.state.gpsLoop + 1}, () => {
            setTimeout(() => {
              this.checkGpsClosenessAndContinueReport();
            }, 1000);
          });
        } else {
          setTimeout(() => {
            this.setState({isLoadingGps: false, gpsLoop: 0});

            const distance = getGpsPointsDistance(
              // '41.072267',
              // '17.065400',
              coordinates.latitude,
              coordinates.longitude,
              this.props.beachSpot.latitude,
              this.props.beachSpot.longitude,
            );

            // console.log(distance)

            const maxDistance = calculateReportMaxDistance(
              this.props.beachSpot.length,
            );
            // console.log(maxDistance)
            if (this.props.userAuth.details?.owner?.id == this.props.beachSpot?.owner?.id) {
              setTimeout(() => {
                this.ActionSheetOwner?.show()
              }, 500);
            } else {
              if (distance < maxDistance) {
                setTimeout(() => {
                  this.ActionSheetUser?.show()
                  // this._modalRef?.open();
                }, 500);
              } else {
                setTimeout(() => {
                  Alert.alert(
                    I18n.t('reportFail_tooFarTitle'),
                    I18n.t('reportFail_tooFarDescription'),
                  );
                }, 500);
              }
            }
          }, 500);
        }
      },
      () => {
        if (enableHighAccuracy) {
          this.checkGpsClosenessAndContinueReport(false);
        } else {
          this.setState({isLoadingGps: false, gpsLoop: 0});
          setTimeout(() => {
            Alert.alert(
              I18n.t('gpsDisabled_errorTitle'),
              I18n.t('gpsDisabled_errorDescription'),
            );
          }, 500);
        }
      },
      {
        enableHighAccuracy: enableHighAccuracy,
        timeout: 10000, // MAX 10 SECONDS
        maximumAge: 60000, // MAX 60 SECONDS
      },
    );
  };

  beachSpotStateReport = (beachSpot, index) => {
    if (index === 0) {
      return;
    }

    // console.log(index)
    let beach_spot_state_id = 0;
    let report_text = '';
    // CONVERT INDEX TO STATE_ID
    // 'Chiusa', 'Piena', 'Quasi piena', 'Libera'
    switch (index) {
      case 1:
        beach_spot_state_id = 3;
        report_text = I18n.t('beachSpotState_full');
        break;
      case 2:
        beach_spot_state_id = 2;
        report_text = I18n.t('beachSpotState_almostFull');
        break;
      case 3:
        beach_spot_state_id = 1;
        report_text = I18n.t('beachSpotState_free');
        break;
    }

    const deviceId = DeviceInfo.getUniqueId();

    setTimeout(() => {
      Alert.alert(
        I18n.t('reportAlert_title'),
        I18n.t('reportAlert_message', {reportText: report_text}),
        [
          {
            text: I18n.t('reportAlert_confirm'),
            onPress: () => {
              // console.log(deviceId)
              // console.log(beach_spot_state_id)
              // console.log(beachSpot.id)

              this.props.reportBeachSpotState({
                beach_spot_id: beachSpot.id,
                beach_state_id: beach_spot_state_id,
                device_id: deviceId,
              });
            },
          },
          {
            text: I18n.t('reportAlert_cancel'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }, 500);
    // this.props.changeBeachSpotState({beach_spot_id: beach_spot_id, beach_state_id: beach_spot_state_id})
  };

  renderBottomBar = beachSpot => {
    const { userAuth } = this.props;
    // console.log('current beachSpot', beachSpot);
    // const {beachSpotDistance, beachSpotMaxDistance} = this.state;
    return (
      <View style={[this.styles.bottomContainer]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() =>
              navigateTo(beachSpot?.latitude, beachSpot?.longitude)
            }
            style={{
              shadowColor: '#000000',
              shadowOpacity: 0.2,
              shadowRadius: 3,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              elevation: 4,
              backgroundColor: 'white',
              width: 60,
              height: 60,
              borderRadius: 99999,
              justifyContent: 'center',
            }}>
            <IconFeather
              name={'navigation'}
              color={'blue'}
              size={25}
              style={{
                marginLeft: 15,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (userAuth.details?.owner?.id && beachSpot.owner?.id == userAuth.details?.owner?.id){
                this.showActionSheetOwner()
              } else {
                this.showActionSheetUser()
              }
            }}
            style={{
              height: 60,
              backgroundColor: 'rgba(48, 140, 137, 1)',
              width: '75%',
              borderRadius: 26,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }} >
            <Text
              style={{
                fontSize: Fonts.size.medium,
                fontFamily: Fonts.type.base,
                color: 'white',
                marginLeft: 10,
                fontWeight: '800',
              }}>
              {'Stato della spiaggia'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  // renderBottomBar = beachSpot => {
  //   const {userAuth} = this.props;
  //   const {beachSpotDistance, beachSpotMaxDistance} = this.state;
  // return (
  //   <View style={this.styles.bottomContainer}>
  //     <View style={this.styles.buttomContainerOne}>
  //       <View style={this.styles.bottomContainerTwo}>
  //         <View
  //           style={{
  //             marginRight: Metrics.baseMargin,
  //             width: 9,
  //             backgroundColor: computeStateColor(beachSpot.last_spot_state),
  //             height: 70,
  //             borderRadius: 999,
  //           }}
  //         />
  //         <View>
  //           <View style={this.styles.textContainer}>
  //             <Text style={this.styles.bottomText}>
  //               {I18n.t('beachCard_status')}
  //             </Text>
  //             {beachSpot.last_spot_state.user_id && (
  //               <View style={this.styles.bottomContainerOne}>
  //                 <Text style={this.styles.bottomTextOne}>
  //                   {' '}
  //                   {I18n.t('beachCard_statusTypeCertified')}{' '}
  //                 </Text>
  //                 <OIcon
  //                   name="certified"
  //                   size={16}
  //                   style={this.styles.OIcon}
  //                 />
  //               </View>
  //             )}
  //             {beachSpot.last_spot_state.reports && (
  //               <View style={this.styles.bottomContainerOne}>
  //                 <OIcon name="user" size={14} style={this.styles.OIconTwo} />
  //                 {beachSpot.last_spot_state.reports && (
  //                   <Text
  //                     style={{
  //                       fontSize: Fonts.size.small,
  //                       fontFamily: Fonts.type.light,
  //                       color: Colors.lightTextReadable,
  //                     }}>
  //                     {' '}
  //                     - {beachSpot.last_spot_state.reports}{' '}
  //                     {I18n.t('beachCard_statusTypeReports')}
  //                   </Text>
  //                 )}
  //               </View>
  //             )}
  //           </View>
  //           {beachSpot.last_spot_state.user_id ||
  //           beachSpot.last_spot_state.reports ? (
  //             <View>
  //               <Text style={this.styles.bottomTextTwo}>
  //                 {
  //                   this.props.beachStates[
  //                     beachSpot.last_spot_state.beach_state_id
  //                   ].name[I18n.locale]
  //                 }
  //               </Text>
  //               <Text
  //                 style={{
  //                   fontSize: Fonts.size.small,
  //                   fontFamily: Fonts.type.regular,
  //                   textAlign: 'left',
  //                 }}>
  //                 {moment(beachSpot.last_spot_state.created_at).fromNow()}
  //               </Text>
  //             </View>
  //           ) : (
  //             <View>
  //               <Text
  //                 style={{
  //                   fontSize: Fonts.size.medium,
  //                   fontFamily: Fonts.type.regular,
  //                   textAlign: 'left',
  //                 }}>
  //                 {beachSpotDistance &&
  //                 beachSpotDistance < beachSpotMaxDistance
  //                   ? I18n.t('beachSpotMegaphone_nearReportCTAnew')
  //                   : I18n.t('beachSpotState_waitingReports')}
  //               </Text>
  //             </View>
  //           )}
  //         </View>
  //       </View>
  //       {userAuth.login.isLogged &&
  //         userAuth.details.is_owner &&
  //         userAuth.details.owner.id === beachSpot.owner.id && (
  //           <TouchableOpacity
  //             style={[this.buttonStyles.buttonActiveBig, {height: 45}]}
  //             onPress={this.showActionSheetOwner}>
  //             <Text
  //               style={[
  //                 this.buttonStyles.titleActive,
  //                 {fontFamily: Fonts.type.bold},
  //               ]}>
  //               {I18n.t('beachSpotButton_changeState')}
  //             </Text>
  //           </TouchableOpacity>
  //         )}
  //       {(!userAuth.login.isLogged ||
  //         !userAuth.details.is_owner ||
  //         (userAuth.details.is_owner &&
  //           userAuth.details.owner.id !== beachSpot.owner.id)) && (
  //         <TouchableOpacity
  //           style={[
  //             this.buttonStyles.buttonActiveBig,
  //             {
  //               height: 45,
  //             },
  //           ]}
  //           onPress={this.showActionSheetUser}>
  //           <Text
  //             style={[
  //               this.buttonStyles.titleActive,
  //               {fontFamily: Fonts.type.bold},
  //             ]}>
  //             {I18n.t('beachSpotButton_report')}
  //           </Text>
  //         </TouchableOpacity>
  //       )}
  //     </View>
  //   </View>
  // );
  // };

  renderStatus = beachSpot => {
    if (!beachSpot.last_spot_state?.beach_state_id){
      return
    }
    return (
      <View
        style={{
          // marginLeft: 20,
          alignItems: 'center',
          width: 80,
          // marginBottom: 10,
          // marginTop: 5,
        }}>
        {Images.beach.state[beachSpot.last_spot_state.beach_state_id] && (
          <FastImage
            style={{
              width: 80,
              height: 40
            }}
            source={Images.beach.state[beachSpot.last_spot_state.beach_state_id]}
            // resizeMode={FastImage.resizeMode.center}
          />
        )}
        <Text
          style={{
            color: Colors.text,
            fontSize: Fonts.size.normal,
            fontFamily: Fonts.type.bold,
            textTransform: 'capitalize',
            textAlign: 'center'
          }}>
          {
            this.props.beachStates[beachSpot.last_spot_state.beach_state_id].name[I18n.locale]
          }
        </Text>
      </View>
    );
  };

  renderCapacity = beachSpot => (
    <View style={capacityStyle.capacityContainer}>
      <Text style={capacityStyle.capacityText1}>
        {I18n.t('beachSpot_capacity')}:
      </Text>
      <Text style={capacityStyle.capacityText2}>{beachSpot.capacity}</Text>
    </View>
  );

  onLinkPress = (event, url) => {
    const url_parsed = urlParser.parse(url, true, true);

    if (url_parsed.query.webview) {
      this.onLinkWebview(null, url);
    } else {
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            setTimeout(() => {
              Alert.alert('Operazione non supportata');
            }, 500);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch(err => console.error('An error occurred', err));
    }
  };

  getStopStateColor = id => {
    switch (id) {
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 1:
        return 'green';
      default:
        return 'orange';
    }
  };

  renderMunicipalityInfo = currentBeachSpot => {
    if (
      this.state.showHtmlInfo &&
      currentBeachSpot.public_owner &&
      currentBeachSpot.public_owner.info
    ) {
      return (
        <View style={capacityStyle.municipalityInfoContainer}>
          <View>
            <Text style={capacityStyle.municipalityInfoText}>
              {I18n.t('beachSpot_municipalityBanner')}
            </Text>
          </View>
          <View style={capacityStyle.view}>
            <HtmlViewer content={currentBeachSpot.public_owner.info} />
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    const {beachSpot, cachedBeachSpot, stateChange, nearBeaches} = this.props;

    const imageCarouselRef = null;

    const currentBeachSpot = beachSpot || cachedBeachSpot;

    const {showPermissionModal, permissionStatus, isLoadingGps} = this.state;

    return this.state.reRender ? null : (
      <View style={this.styles.outerContainer}>
        <Spinner
          cancelable={true}
          visible={isLoadingGps}
          textContent={I18n.t('GPS_positionLoading')}
          textStyle={{color: 'white'}}
        />
        <Spinner visible={stateChange.isFetching || !currentBeachSpot} />
        {currentBeachSpot && !R.isEmpty(currentBeachSpot) && (
          <View style={{flex: 1}}>
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
                    this.props.navigation.goBack();
                  }}
                />
              }
              showsVerticalScrollIndicator={false}
              bounces={true}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: this.animatedValue}}}],
                {useNativeDriver: true},
              )}
              ref={component => (this.scrollRef = component)}
              scrollEventThrottle={1}>
              <View style={{height: Metrics.navBarHeightAdjusted}} />
              <MediaCarousel
                ref={imageCarouselRef}
                beachSpot={currentBeachSpot}
              />
              <View style={this.styles.innerContainer}>
                <Handlebar />
                <Title
                  beachSpot={currentBeachSpot}
                  rightComponent={this.renderStatus(currentBeachSpot)}
                />
                <Locality
                  beachSpot={currentBeachSpot}
                  rightComponent={this.renderCapacity(currentBeachSpot)}
                />
                <Description beachSpot={currentBeachSpot} />
                <Weather beachSpot={currentBeachSpot} />
                <Map beachSpot={currentBeachSpot} />
                {/*<NearBeachspots*/}
                {/*  beaches={this.props.nearBeaches.data}*/}
                {/*  showDetails={this.showBeachSpotDetails}*/}
                {/*  updateNearSpots={this.getNearB}*/}
                {/*/>*/}
              </View>
              {this.state.showHtmlInfo && (
                <MunicipalityInfo info={currentBeachSpot.owner?.info} />
              )}
              <View style={this.styles.innerContainer}>
                <Tags beachSpot={currentBeachSpot} title={'Caratteristiche'} />
              </View>

              <View
                style={{
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                  paddingTop: 0,
                }}>
                <View
                  style={{
                    // marginTop: 20,
                    borderBottomColor: 'rgba(232, 232, 232, 1)',
                    borderBottomWidth: 1,
                  }}
                />
              </View>

              {/* {this.renderMunicipalityInfo(currentBeachSpot)} */}
              <View style={{height: 150}} />
            </AnimatedScrollView>
            {this.renderBottomBar(currentBeachSpot)}
            {/*<BeachSpotNavbar*/}
            {/*  beachSpot={currentBeachSpot}*/}
            {/*  onBack={this.props.navigation.goBack}*/}
            {/*/>*/}
            <ActionSheet
              ref={o => (this.ActionSheetOwner = o)}
              title={I18n.t('beachSpot_actionSheet_changeState_title')}
              options={[
                I18n.t('beachSpot_actionSheet_changeState_cancel'),
                I18n.t('beachSpotState_closed'),
                I18n.t('beachSpotState_full'),
                I18n.t('beachSpotState_almostFull'),
                I18n.t('beachSpotState_free'),
              ]}
              cancelButtonIndex={0}
              destructiveButtonIndex={1}
              onPress={index => {
                this.beachSpotStateChange(currentBeachSpot.id, index);
              }}
            />
            <ActionSheet
              ref={o => (this.ActionSheetUser = o)}
              title={I18n.t('beachSpot_actionSheet_report_title')}
              options={[
                I18n.t('beachSpot_actionSheet_changeState_cancel'),
                I18n.t('beachSpotState_full'),
                I18n.t('beachSpotState_almostFull'),
                I18n.t('beachSpotState_free'),
              ]}
              cancelButtonIndex={0}
              destructiveButtonIndex={1}
              onPress={index => {
                this.beachSpotStateReport(currentBeachSpot, index);
              }}
            />
            <Portal>
              <Modalize
                ref={o => (this._modalRef = o)}
                handlePosition="inside"
                adjustToContentHeight
                scrollViewProps={{
                  keyboardShouldPersistTaps: 'always',
                  showsVerticalScrollIndicator: false,
                  bounces: true,
                }}
                disableScrollIfPossible={false}
                modalStyle={{
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                }}>
                <ReportModal ref={this._modalRef} />
              </Modalize>
            </Portal>
          </View>
        )}
        {showPermissionModal && (
          <OModal
            isVisible={showPermissionModal}
            closeHandler={() => this.setState({showPermissionModal: false})}
            confirmHandler={this.handlePermissionConfirm}
            cancelHandler={this.handlePermissionCancel}
            title={I18n.t('permissionModalGPS_title')}
            message={I18n.t('permissionModalGPS_messageReport')}
            confirmMessage={
              permissionStatus === 'blocked'
                ? I18n.t('permissionModalGPS_blocked')
                : I18n.t('permissionModalGPS_ok')
            }
            cancelMessage={I18n.t('permissionModalGPS_cancel')}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    userAuth: state.userAuth,
    beachStates: state.startup.initVariables.beach_states,
    stateChange: state.beachSpots.stateChange,
    reportChange: state.beachSpots.reportChange,
    beachSpotIsFetching: state.beachSpots?.current?.isFetching,
    beachSpot: state.beachSpots?.current?.data,
    beachSpots: state.beachSpots.all,
    nearBeaches: state.beachSpots.nearby,

    cachedBeachSpot:
      state.beachSpots &&
      state.beachSpots.all &&
      state.beachSpots.all.data.length > 0
        ? state.beachSpots.all.data.find(beachSpot => {
          return beachSpot.id === props.navigation.state.params.id;
        })
        : {},
  };
};

const mapDispatchToProps = dispatch => ({
  // getNearbyBeachSpots: params =>dispatch(BeachSpotActions.getNearbyBeachSpotsRequest(params)),
  changeBeachSpotState: (id, beach_state_id) =>
    dispatch(BeachSpotActions.changeBeachSpotStateRequest(id, beach_state_id)),
  reportBeachSpotState: (id, beach_state_id, device_id) =>
    dispatch(
      BeachSpotActions.reportBeachSpotStateRequest(
        id,
        beach_state_id,
        device_id,
      ),
    ),
  getBeachSpotDetails: id => dispatch(BeachSpotActions.getBeachSpotRequest(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BeachSpotDetailsScreen);
