import React, {useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableOpacityBase,
  SafeAreaView,
} from 'react-native';
import {Fonts, Colors, Metrics} from '../../Themes';
import metrics from '../../Themes/Metrics';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import Header from '../../Components/Header';
import {isIphoneX} from 'react-native-iphone-x-helper';

const isIOS = Platform.OS === 'ios';
const isIPhoneX = isIphoneX();
function BeachSpotEvents() {
  const events = [
    {name: 'randomNameOne'},
    {name: 'randomNameTwo'},
    {name: 'randomNameThree'},
    {name: 'randomNameThree'},
  ];

  const modalizeRef = useRef(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const renderBottomBar = () => {
    // const {userAuth, beachSpot} = this.props;
    // console.log('current beachSpot', beachSpot);
    // const {beachSpotDistance, beachSpotMaxDistance} = this.state;
    return (
      <View
        style={{
          backgroundColor: 'white',
          width: Metrics.windowWidth,
          padding: Metrics.doubleBaseMargin,
          paddingBottom: isIOS
            ? isIPhoneX
              ? Metrics.doubleBaseMargin + 20
              : Metrics.doubleBaseMargin
            : Metrics.doubleBaseMargin,
          elevation: 24,
          borderTopColor: 'rgba(51,51,51,0.10)',
          borderTopWidth: 1,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() => {}}
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
            onPress={() => {}}
            style={{
              height: 60,
              backgroundColor: '#0070CA',
              width: '75%',
              borderRadius: 26,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: Fonts.size.medium,
                fontFamily: Fonts.type.base,
                color: 'white',
                marginLeft: 10,
                fontWeight: '800',
              }}>
              {'Mostra altri dettagli'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header heading={'Eventi'} />
      <ScrollView>
        <TouchableOpacity
          // onPress={onOpen}
          style={{
            flex: 1,
            height: Metrics.windowHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Qui troverai la lista degli eventi dei lidi</Text>
        </TouchableOpacity>
        {/*<View style={styles.eventsContainerWrapper}>*/}
        {/*  <ScrollView nestedScrollEnabled={true}>*/}
        {/*    <View style={styles.eventsContainer}>*/}
        {/*      <View style={{marginBottom: 5}}>*/}
        {/*        <Text style={styles.eventsHeading}>Di questo mese</Text>*/}
        {/*      </View>*/}
        {/*      {events.map(e => (*/}
        {/*        <>*/}
        {/*          <TouchableOpacity onPress={onOpen}>*/}
        {/*            <View style={styles.eventsCard}>*/}
        {/*              <View style={{justifyContent: 'center'}}>*/}
        {/*                <Text*/}
        {/*                  style={{*/}
        {/*                    fontFamily: Fonts.type.bold,*/}
        {/*                    letterSpacing: 0.5,*/}
        {/*                    padding: 3,*/}
        {/*                  }}>*/}
        {/*                  Sagra dell’anguria*/}
        {/*                </Text>*/}
        {/*                <View*/}
        {/*                  style={{*/}
        {/*                    flexDirection: 'row',*/}
        {/*                  }}>*/}
        {/*                  <IconFeather*/}
        {/*                    name={'map-pin'}*/}
        {/*                    color={'#ABB3BB'}*/}
        {/*                    size={14}*/}
        {/*                    style={{*/}
        {/*                      padding: 3,*/}
        {/*                    }}*/}
        {/*                  />*/}
        {/*                  <Text style={{color: '#ABB3BB', letterSpacing: 0.5}}>*/}
        {/*                    Marina di Vieste, Vieste*/}
        {/*                  </Text>*/}
        {/*                </View>*/}
        {/*              </View>*/}
        {/*              <View style={{justifyContent: 'center'}}>*/}
        {/*                <Text>Icon</Text>*/}
        {/*              </View>*/}
        {/*            </View>*/}
        {/*          </TouchableOpacity>*/}
        {/*        </>*/}
        {/*      ))}*/}
        {/*    </View>*/}
        {/*  </ScrollView>*/}
        {/*</View>*/}
        {/*<View style={{backgroundColor: '#e4f4f7'}}>*/}
        {/*  <View style={styles.eventsContainerWrapperTwo}>*/}
        {/*    <View style={styles.eventsContainer}>*/}
        {/*      <View style={{marginBottom: 5}}>*/}
        {/*        <Text style={styles.eventsHeading}>Nel mese di Luglio</Text>*/}
        {/*      </View>*/}
        {/*      {events.map(e => (*/}
        {/*        <>*/}
        {/*          <TouchableOpacity>*/}
        {/*            <View style={styles.eventsCardTwo}>*/}
        {/*              <View style={{justifyContent: 'center'}}>*/}
        {/*                <Text*/}
        {/*                  style={{*/}
        {/*                    fontFamily: Fonts.type.bold,*/}
        {/*                    letterSpacing: 0.5,*/}
        {/*                    padding: 3,*/}
        {/*                  }}>*/}
        {/*                  Sagra dell’anguria*/}
        {/*                </Text>*/}
        {/*                <View*/}
        {/*                  style={{*/}
        {/*                    flexDirection: 'row',*/}
        {/*                  }}>*/}
        {/*                  <IconFeather*/}
        {/*                    name={'map-pin'}*/}
        {/*                    color={'#ABB3BB'}*/}
        {/*                    size={14}*/}
        {/*                    style={{*/}
        {/*                      padding: 3,*/}
        {/*                    }}*/}
        {/*                  />*/}
        {/*                  <Text style={{color: '#ABB3BB', letterSpacing: 0.5}}>*/}
        {/*                    Marina di Vieste, Vieste*/}
        {/*                  </Text>*/}
        {/*                </View>*/}
        {/*              </View>*/}
        {/*              <View style={{justifyContent: 'center'}}>*/}
        {/*                <Text>Icon</Text>*/}
        {/*              </View>*/}
        {/*            </View>*/}
        {/*          </TouchableOpacity>*/}
        {/*        </>*/}
        {/*      ))}*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</View>*/}
      </ScrollView>
      <Portal>
        <Modalize
          ref={modalizeRef}
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
          }}
          FooterComponent={renderBottomBar()}>
          <View style={{flex: 1}}>
            <ScrollView style={[styles.modalContainer]}>
              <View style={styles.modalHeader}>
                <View style={{justifyContent: 'center', paddingBottom: 10}}>
                  <Text
                    style={{
                      fontFamily: Fonts.type.bold,
                      letterSpacing: 0.5,
                      padding: 3,
                      fontSize: 20,
                    }}>
                    Sagra dell’anguria
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <IconFeather
                      name={'map-pin'}
                      color={'#606060'}
                      size={14}
                      style={{
                        padding: 3,
                      }}
                    />
                    <Text style={{color: '#606060', letterSpacing: 0.5}}>
                      Marina di Vieste, Vieste
                    </Text>
                  </View>
                </View>
                <View style={{justifyContent: 'center'}}>
                  <Text>Icon</Text>
                </View>
              </View>
              <View style={styles.modalDesc}>
                <Text style={styles.modelDescText}>
                  You bet. Now Biff, don't con me. Oh, you make it sound so
                  easy. I just, I wish I wasn't so scared. Well, Marty, I want
                  to thank you for all your good advice, I'll never forget it.
                  Okay, alright, Saturday is good, Saturday's good, I could
                  spend a week in 1955. I could hang out, you could show me
                  around. You got a real attitude problem, McFly. You're a
                  slacker. You remind me of you father when he went her, he was
                  a slacker too. Hot, Jesus Christ, Doc. Jesus Christ, Doc, you
                  disintegrated Einstein. Mayor Goldie Wilson, I like the sound
                  of that. Who's are these? Hey wait, wait a minute, who are
                  you? Stella, another one of these damn kids jumped in front of
                  my car. Come on out here, help me take him in the house.
                </Text>
                <Text style={styles.modelDescText}>
                  You bet. Now Biff, don't con me. Oh, you make it sound so
                  easy. I just, I wish I wasn't so scared. Well, Marty, I want
                  to thank you for all your good advice, I'll never forget it.
                  Okay, alright, Saturday is good, Saturday's good, I could
                  spend a week in 1955. I could hang out, you could show me
                  around. You got a real attitude problem, McFly. You're a
                  slacker. You remind me of you father when he went her, he was
                  a slacker too. Hot, Jesus Christ, Doc. Jesus Christ, Doc, you
                  disintegrated Einstein. Mayor Goldie Wilson, I like the sound
                  of that. Who's are these? Hey wait, wait a minute, who are
                  you? Stella, another one of these damn kids jumped in front of
                  my car. Come on out here, help me take him in the house.
                </Text>
              </View>
              <View style={[styles.modalButton, {marginHorizontal: 20}]}>
                <View style={{justifyContent: 'center'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <IconFeather
                      name={'phone'}
                      color={'#0070CA'}
                      size={20}
                      style={
                        {
                          // padding: 3,
                        }
                      }
                    />
                    <Text
                      style={{
                        color: '#0070CA',
                        letterSpacing: 0.5,
                        paddingLeft: 10,
                        fontSize: 16,
                      }}>
                      Contatta l’evento
                    </Text>
                  </View>
                </View>
                <View style={{justifyContent: 'center'}}>
                  <IconFeather
                    name={'arrow-right'}
                    color={'#0070CA'}
                    size={20}
                    style={
                      {
                        // padding: 3,
                      }
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  marginVertical: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#0070CA',
                    letterSpacing: 0.5,
                    fontSize: Fonts.size.normal,
                  }}>
                  Questo evento si trova a 13km da te
                </Text>
              </View>
            </ScrollView>
            {/* {renderBottomBar()} */}
          </View>
        </Modalize>
      </Portal>
    </SafeAreaView>
  );
}

export default BeachSpotEvents;

const styles = StyleSheet.create({
  container: {
    width: metrics.windowWidth,
    height: metrics.windowHeight,
    // paddingBottom: metrics.windowWidth / 5,
  },
  modalContainer: {
    // width: metrics.windowWidth,
    // height: metrics.windowHeight,
    // paddingBottom: metrics.windowWidth / 3.5,
  },
  heading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  headingText: {
    color: '#0070CA',
    fontSize: 25,
    fontFamily: Fonts.type.bold,
  },
  eventsContainerWrapper: {
    backgroundColor: '#e4f4f7',
    borderTopStartRadius: 15,
    borderTopRightRadius: 15,
  },
  eventsContainerWrapperTwo: {
    backgroundColor: 'white',
    borderTopStartRadius: 15,
    borderTopRightRadius: 15,
  },
  eventsContainer: {
    margin: 20,
  },
  eventsHeading: {
    color: '#0070CA',
    fontSize: 18,
    fontFamily: Fonts.type.bold,
    lineHeight: 30,
  },
  eventsCard: {
    height: 80,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  eventsCardTwo: {
    height: 80,
    backgroundColor: '#edf7f7',
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  modalButton: {
    height: 60,
    backgroundColor: 'white',
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderWidth: 0.8,
    borderColor: '#DFDFDF',
  },
  modalHeader: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  modalDesc: {
    justifyContent: 'center',
    flexShrink: 1,
    marginHorizontal: 20,
  },
  modelDescText: {
    color: '#606060',
    fontSize: Fonts.size.small,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 25,
  },
});
