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
  Image,
  ImageBackground,
} from 'react-native';
import IconFeather from 'react-native-vector-icons/dist/Feather';

import R from 'ramda';

import {connect} from 'react-redux';

import stylesfactory from '../Styles/MapScreenStyle';

import {StyleSheet} from 'react-native';
import images from '../../Themes/Images';
import metrics from '../../Themes/Metrics';
import renderWhenFocused from 'render-when-focused';
import {Fonts, Metrics, Colors, Images} from '../../Themes';
import {TabView, SceneMap} from 'react-native-tab-view';
import Header from '../../Components/Header';

const windowHeight = metrics.windowHeight > 750;
class ReservationScreen extends ApplicationComponent {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.state = {
      ...this.state,
      activeSections: [0],
      index: 0,
      routes: [
        {key: 'first', title: 'Prossime'},
        {key: 'second', title: 'Storico'},
      ],
    };
  }
  _handleIndexChange = index => this.setState({index});

  _renderTabBar = props => {
    return (
      <SafeAreaView>
        <View style={[styles.container]}>
          {props.navigationState.routes.map((route, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      this.state.index == i
                        ? styles.bg1.backgroundColor
                        : styles.bg2.backgroundColor,
                    shadowColor: '#000000',
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    shadowOffset: {
                      height: 0,
                      width: 0,
                    },
                    elevation: 3,
                  },
                ]}
                onPress={() => this.setState({index: i})}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color:
                        this.state.index == i
                          ? styles.color1.color
                          : styles.color2.color,
                    },
                  ]}>
                  {route.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    );
  };
  showProfileScreen = () => {
    this.props.navigation.navigate({
      routeName: 'Profile',
    });
  };
  _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  render() {
    // const {userAuthDetails} = this.props;
    // const logged = userAuthDetails && userAuthDetails.id;
    // const owner = userAuthDetails && userAuthDetails.owner && userAuthDetails.owner.id;

    return this.state.reRender ? null : (
      <>
        <View
          style={{
            height: metrics.windowHeight,
            width: metrics.windowWidth,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Header heading={'Le tue prenotazioni'} />
            <TouchableOpacity
              onPress={() => this.showProfileScreen()}
              style={{position: 'absolute', right: 30, top: 20}}>
              <ImageBackground
                style={{
                  height: 20,
                  width: 20,
                }}
                source={images.skip}
              />
            </TouchableOpacity>
          </View>
          <TabView
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            onIndexChange={this._handleIndexChange}
          />
        </View>
      </>
    );
  }
}
const FirstRoute = () => {
  const data = [{one: 1}, {two: 2}, {three: 3}];

  if (data.length < 1) {
    return (
      <View>
        <View
          style={{
            padding: Metrics.doubleBaseMargin,
            justifyContent: 'center',
          }}>
          <Image
            source={Images.emptyRes}
            style={{
              width: '80%',
              height: metrics.windowWidth / 1.5,

              alignSelf: 'center',
            }}
            resizeMode={'contain'}
          />
          <Text style={[Fonts.style.h5, {textAlign: 'center'}]}>
            Non ci sono pass
          </Text>
          <Text
            style={[
              Fonts.style.description,
              {
                textAlign: 'center',
                color: 'rgba(29, 25, 25, 0.5)',
              },
            ]}>
            Nessun viaggio in programma? Fa caldo, cosa aspetti ad andare al
            mare!
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          margin: 30,
        }}>
        {data.map(d => (
          <>
            <View style={{marginVertical: 5}}>
              <View>
                <Image
                  source={Images.booking}
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                  }}
                  resizeMode={'contain'}
                />
                <View
                  style={{
                    bottom: 145,
                    left: 5,
                    paddingHorizontal: 10,
                    // backgroundColor: 'black',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <IconFeather
                        name={'user'}
                        color={'#FFFFFF'}
                        size={18}
                        style={{
                          paddingTop: 1,
                          paddingRight: 3,
                        }}
                      />
                      <Text
                        style={{
                          color: '#FFFFFF',
                          letterSpacing: 0.5,
                          fontSize: Fonts.size.medium,
                        }}>
                        Fai il check-in
                      </Text>
                    </View>

                    <IconFeather
                      name={'user'}
                      color={'#FFFFFF'}
                      size={18}
                      style={{
                        paddingTop: 1,
                        paddingRight: 8,
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={{bottom: 15}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                  }}>
                  <Text
                    style={{
                      color: '#0070CA',
                      letterSpacing: 0.5,
                      fontSize: Fonts.size.normal,
                      fontFamily: Fonts.type.bold,
                    }}>
                    Stabilimento Blue Marlin
                  </Text>
                  <Text
                    style={{
                      // color: '#0070CA',
                      letterSpacing: 0.5,
                      fontSize: Fonts.size.normal,
                    }}>
                    3 Giugno
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <IconFeather
                      name={'map-pin'}
                      color={'#ABB3BB'}
                      size={12}
                      style={{
                        paddingTop: 1,
                        paddingRight: 3,
                      }}
                    />
                    <Text
                      style={{
                        color: '#ABB3BB',
                        letterSpacing: 0.5,
                        fontSize: Fonts.size.tiny,
                      }}>
                      Marina di Vieste, Vieste
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#ABB3BB',
                      letterSpacing: 0.5,
                      fontSize: Fonts.size.tiny,
                    }}>
                    GIORNALIERO
                  </Text>
                </View>
              </View>
            </View>
          </>
        ))}
      </ScrollView>
    );
  }
};
const SecondRoute = () => {
  const data = [{one: 1}, {two: 2}, {three: 3}];

  if (data.length < 1) {
    return (
      <View>
        <View
          style={{
            padding: 30,
            justifyContent: 'center',
          }}>
          <Image
            source={Images.emptyHis}
            style={{
              width: '80%',
              // height: 250,
              height: metrics.windowWidth / 1.5,

              alignSelf: 'center',
            }}
            resizeMode={'contain'}
          />
          <Text style={[Fonts.style.h5, {textAlign: 'center'}]}>
            Nessuna prenotazione passata
          </Text>
          <Text
            style={[
              Fonts.style.description,
              {
                textAlign: 'center',
                color: 'rgba(29, 25, 25, 0.5)',
              },
            ]}>
            Effettua una prenotazione e apri il tuo primo ombrellone con noi
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          margin: 30,
        }}>
        {data.map(d => (
          <>
            <View style={{marginVertical: 5}}>
              <View>
                <Image
                  source={Images.booking}
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                  }}
                  resizeMode={'contain'}
                />
                <View
                  style={{
                    bottom: 145,
                    left: 5,
                    paddingHorizontal: 10,
                    // backgroundColor: 'black',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                    }}>
                    <View>
                      <IconFeather
                        name={'user'}
                        color={'#FFFFFF'}
                        size={18}
                        style={{
                          paddingTop: 1,
                          paddingRight: 3,
                        }}
                      />
                    </View>
                    <View>
                      <IconFeather
                        name={'user'}
                        color={'#FFFFFF'}
                        size={18}
                        style={{
                          paddingTop: 1,
                          paddingRight: 8,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={{bottom: 15}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                  }}>
                  <Text
                    style={{
                      color: '#0070CA',
                      letterSpacing: 0.5,
                      fontSize: Fonts.size.normal,
                      fontFamily: Fonts.type.bold,
                    }}>
                    Stabilimento Blue Marlin
                  </Text>
                  <Text
                    style={{
                      // color: '#0070CA',
                      letterSpacing: 0.5,
                      fontSize: Fonts.size.normal,
                    }}>
                    3 Giugno
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <IconFeather
                      name={'map-pin'}
                      color={'#ABB3BB'}
                      size={12}
                      style={{
                        paddingTop: 1,
                        paddingRight: 3,
                      }}
                    />
                    <Text
                      style={{
                        color: '#ABB3BB',
                        letterSpacing: 0.5,
                        fontSize: Fonts.size.tiny,
                      }}>
                      Marina di Vieste, Vieste
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#ABB3BB',
                      letterSpacing: 0.5,
                      fontSize: Fonts.size.tiny,
                    }}>
                    GIORNALIERO
                  </Text>
                </View>
              </View>
            </View>
          </>
        ))}
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 5,
  },
  title: {
    ...Fonts.style.h5,
    color: Colors.blueText,
    textAlign: 'center',
    marginTop: 0,
  },
  bg1: {
    backgroundColor: 'rgba(0, 112, 202, 1)',
  },
  bg2: {
    backgroundColor: 'white',
  },
  button: {
    height: 45,
    width: metrics.windowHeight > 750 ? 120 : 100,
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },

  color1: {
    color: 'rgba(251, 251, 251, 1)',
  },
  color2: {
    color: '#0070CA',
  },
});
const mapStateToProps = state => ({
  ...mapStateToPropsDefault(state),
  userAuthDetails: state.userAuth.details,
});

const mapDispatchToProps = dispatch => ({
  ...mapDispatchToPropsDefault(dispatch),
  // setLocalizationAndRestart: locale =>
  //   dispatch(UserAuthActions.setLocalization(locale, true)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(renderWhenFocused(ReservationScreen));
