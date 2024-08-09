import {Image, SafeAreaView, Text, TouchableOpacity, View, Animated} from 'react-native';
import {Colors, Fonts, Images, Metrics} from '../../Themes';
import I18n from 'i18n-js';
import moment from 'moment';
import {computeStateColor, getBeachSpotImageUrl} from '../../Lib/Utilities';
import React from 'react';
import ApplicationComponent, {
  mapDispatchToPropsDefault,
  mapStateToPropsDefault,
} from '../ApplicationComponent';
import PropTypes from 'prop-types';
import stylesfactory from '../Styles/BeachSpotCard';
import buttonStylesFactory from '../../Components/Styles/ButtonStyle';
import BeachSpotActions from '../../Redux/BeachSpotRedux';
import {connect} from 'react-redux';
import renderWhenFocused from 'render-when-focused';
import SimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons';
import FastImage from 'react-native-fast-image';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../../../assets/fonts/selection.json';
const OIcon = createIconSetFromIcoMoon(icoMoonConfig);

class BeachSpotCard extends ApplicationComponent {
  static propTypes = {
    closeHandler: PropTypes.func,
  };

  static defaultProps = {
    isFetchingCode: false,
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.buttonStyles = buttonStylesFactory.getSheet();

    this.animatedValue = new Animated.Value(80);

    this.state = {
      ...this.state,
    };
  }
  getNearB = item => {
    this.props.getNearbyBeachSpots({
      latitude: item.latitude,
      longitude: item.longitude,
      limit: 10,
      sea_id: item.sea_id,
      around_beach_spot: true,
    });
  };
  getHoursDifferences(item) {
    const duration = moment.duration(
      moment().diff(moment(item.last_spot_state.created_at)),
    );
    return duration.asHours();
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any) {

    if (nextProps.isActive != this.props.isActive && nextProps.isActive) {
      Animated.timing(this.animatedValue, {
        toValue: 85,
        duration: 250,
        delay: 0,
        isInteraction: false,
        useNativeDriver: true
      }).start();

    }
    if (nextProps.isActive != this.props.isActive && !nextProps.isActive){
      Animated.timing(this.animatedValue, {
        toValue: 80,
        duration: 0,
        delay: 0,
        isInteraction: false,
        useNativeDriver: true
      }).start();
    }
  }

  render() {
    const {item, beachStates, style, shadow, isActive} = this.props;
    const beachTags = item.beach_tags.filter(bt => bt.key && bt.icon_name);
    const displayLength = beachTags.length > 5 ? 5 : beachTags.length;
    const totalLength = beachTags.length;
    const tagLength = totalLength > 5;

    const locality =
      item.city.name === item.locality
        ? item.locality
        : `${item.city.name}, ${item.locality}`;

    return (
      <Animated.View
        key={item.id}
        style={[
          this.styles.container,
          style,
          shadow ? this.styles.containerShadow : {},
          // {
          //   transform: [
          //     {
          //       scaleX: this.animatedValue.interpolate({
          //         inputRange: [80, 85],
          //         outputRange: [1, 1.05]
          //       })
          //     },
          //     {
          //       scaleY: this.animatedValue.interpolate({
          //         inputRange: [80, 85],
          //         outputRange: [1, 1.05]
          //       })
          //     }
          //   ]
          // }
        ]}>
        {beachStates && (
          <TouchableOpacity
            onPress={() => {
              this.getNearB(item);
              this.props.showCardDetails(item);
            }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <AnimatedFastImage
              style={[this.styles.image,
                {
                  // height: isActive ? 85 : 80,
                  // width: isActive ? 85 : 80,
                  // width: this.animatedValue,
                  // height: this.animatedValue,
                  // IT IS BETTER TO ANIMATE THE SCALE INSTEAD OF THE HEIGHT, WIDTH - FASTER.
                  // NOT THE SAME BUT SIMILAR EFFECT
                  transform: [
                    {
                      scaleX: this.animatedValue.interpolate({
                        inputRange: [80, 85],
                        outputRange: [1, 1.05]
                      })
                    },
                    {
                      scaleY: this.animatedValue.interpolate({
                        inputRange: [80, 85],
                        outputRange: [1, 1.05]
                      })
                    }
                  ]
                }]}
              resizeMode={'cover'}
              source={getBeachSpotImageUrl(item)}
            />
            <View style={this.styles.descriptionContainer}>
              <View style={this.styles.staticDescriptionContainer}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  ellipsizeMode="tail"
                  minimumFontScale={0.85}
                  style={this.styles.name}>
                  {item.name}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit
                  minimumFontScale={0.9}
                  style={this.styles.locality}>
                  {locality} {item.is_private && <Text>- lido privato</Text>}
                </Text>

                <View style={this.styles.tagsContainer}>
                  {/* {beachTags.map((tag, index) => (
                    <Image
                      key={index}
                      style={this.styles.tag}
                      source={Images.beach[tag.icon]}
                    />
                  ))} */}
                  {item &&
                    beachTags?.slice(0, displayLength).map((tag, index) => {
                      return (
                        <View style={this.styles.iconContainer}>
                          <OIcon
                            name={tag.icon_name}
                            color={Colors.titleBlue}
                            size={14}
                          />
                        </View>
                      );
                    })}
                  {tagLength && (
                    <View style={this.styles.iconLengthTextWrap}>
                      <Text style={this.styles.iconLengthText}>
                        +{totalLength - displayLength}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* <View style={this.styles.statusContainer}> */}
              {/*<View>*/}
              {/*<View style={this.styles.statusNameContainer}>*/}
              {/*  {!item.last_spot_state.user_id &&*/}
              {/*  !item.last_spot_state.reports ? (*/}
              {/*    <Text*/}
              {/*      style={{*/}
              {/*        fontFamily: Fonts.type.light,*/}
              {/*        fontSize: 13,*/}
              {/*        textAlign: 'right',*/}
              {/*        lineHeight: 16,*/}
              {/*        marginBottom: 6,*/}
              {/*      }}>*/}
              {/*      {I18n.t('beachSpotState_waitingReports')}*/}
              {/*    </Text>*/}
              {/*  ) : (*/}
              {/*    <Text style={this.styles.statusName}>*/}
              {/*      {*/}
              {/*        beachStates[item.last_spot_state.beach_state_id].name[*/}
              {/*          I18n.locale*/}
              {/*        ]*/}
              {/*      }*/}
              {/*    </Text>*/}
              {/*  )}*/}
              {/*</View>*/}
              {/*<View style={this.styles.statusInfoContainer}>*/}
              {/*  {item.last_spot_state.user_id && (*/}
              {/*    <View style={this.styles.statusInfoContent}>*/}
              {/*      <Text style={this.styles.statusInfoName}>*/}
              {/*        {I18n.t('beachCard_statusTypeCertified')}{' '}*/}
              {/*      </Text>*/}
              {/*      <OIcon*/}
              {/*        name="certified"*/}
              {/*        size={14}*/}
              {/*        style={this.styles.statusInfoIconCertified}*/}
              {/*      />*/}
              {/*      <Text*/}
              {/*        style={[*/}
              {/*          this.styles.statusUpdatedAt,*/}
              {/*          {*/}
              {/*            fontFamily:*/}
              {/*              this.getHoursDifferences(item) >= 1.5*/}
              {/*                ? Fonts.type.bold*/}
              {/*                : Fonts.type.light,*/}
              {/*          },*/}
              {/*        ]}>*/}
              {/*        - {moment(item.last_spot_state.created_at).fromNow()}*/}
              {/*      </Text>*/}
              {/*    </View>*/}
              {/*  )}*/}
              {/*  {item.last_spot_state.reports && (*/}
              {/*    <View style={this.styles.statusInfoContent}>*/}
              {/*      {item.last_spot_state.reports && (*/}
              {/*        <Text style={this.styles.statusInfoName}>*/}
              {/*          {item.last_spot_state.reports}{' '}*/}
              {/*          {I18n.t('beachCard_statusTypeReports')}*/}
              {/*        </Text>*/}
              {/*      )}*/}
              {/*      <OIcon*/}
              {/*        name="user"*/}
              {/*        size={14}*/}
              {/*        style={this.styles.statusInfoIconReports}*/}
              {/*      />*/}
              {/*      <Text*/}
              {/*        style={[*/}
              {/*          this.styles.statusUpdatedAt,*/}
              {/*          {*/}
              {/*            fontFamily:*/}
              {/*              this.getHoursDifferences(item) >= 1.5*/}
              {/*                ? Fonts.type.bold*/}
              {/*                : Fonts.type.light,*/}
              {/*          },*/}
              {/*        ]}>*/}
              {/*        - {moment(item.last_spot_state.created_at).fromNow()}*/}
              {/*      </Text>*/}
              {/*    </View>*/}
              {/*  )}*/}
              {/*</View>*/}
              {/*</View>*/}
              {/* {!item.is_private && (
                  <View
                    style={[
                      this.styles.statusBar,
                      {
                        backgroundColor: computeStateColor(
                          item.last_spot_state,
                        ),
                      },
                    ]}
                  />
                )}
              </View> */}
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }
}

const mapStateToProps = state => ({
  ...mapStateToPropsDefault(state),
  beachStates: state.startup.initVariables.beach_states,
});

const mapDispatchToProps = dispatch => ({
  getNearbyBeachSpots: params =>
    dispatch(BeachSpotActions.getNearbyBeachSpotsRequest(params)),

  ...mapDispatchToPropsDefault(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(renderWhenFocused(BeachSpotCard));
