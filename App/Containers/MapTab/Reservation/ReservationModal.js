// @flow

import React, {useState, forwardRef, useEffect} from 'react';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';

import {Calendar} from './Calendar';
import {ReservationModalFooter} from './ModalFooter';
import {Text, View, TouchableOpacity, Linking, ScrollView, Alert} from 'react-native';
import {Colors, Fonts, Metrics} from '../../../Themes';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {openCallUrl, openSmsUrl, openUrl, openWhatsappUrl} from '../../../Lib/Utilities';
// import FontIcon from '../../../Components/FontIcon';
import FontIcon from '../../../Components/FontIcon';

const isIPhoneX = isIphoneX()

export const ReservationModal = forwardRef(
  ({navigation, beachSpot}, modalRef) => {
    const [selectedDates, setSelectedDates] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);


    const inspiaggia_gest = beachSpot.booking_types_beach_spots?.find((bt) => bt.name == 'inspiaggia_gest' )
    const whatsapp = beachSpot.booking_types_beach_spots?.find((bt) => bt.name == 'whatsapp' )
    const sms = beachSpot.booking_types_beach_spots?.find((bt) => bt.name == 'sms' )
    const external_url = beachSpot.booking_types_beach_spots?.find((bt) => bt.name == 'external_url' )
    const call = beachSpot.booking_types_beach_spots?.find((bt) => bt.name == 'call' )


    return (
      <Portal>
        <Modalize
          ref={modalRef}
          handlePosition="inside"
          modalStyle={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
          adjustToContentHeight
          scrollEnabled={false}
          FooterComponent={() => (
            <ReservationModalFooter
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              showConfirm={showConfirm}
              setShowConfirm={setShowConfirm}
              navigation={navigation}
              ref={modalRef}
              beachSpot={beachSpot}
            />
          )}>
          <View style={{
            flexDirection: 'column',
            paddingTop: Metrics.tripleBaseMargin*2,
            padding: Metrics.tripleBaseMargin,
            paddingBottom: isIPhoneX ? Metrics.tripleBaseMargin + Metrics.doubleBaseMargin : Metrics.tripleBaseMargin
          }}>
            {beachSpot.booking_types_beach_spots?.length < 1 || !beachSpot.booking_types_beach_spots ?
              (<Text>Le prenotazioni per questa struttura non sono al momento disponibili</Text>) : (
                <View style={{flex: 1}}>
                  <Text style={{
                    textAlign: 'left',
                    fontSize: Fonts.size.h6,
                    fontFamily: Fonts.type.bold,
                    color: Colors.text,
                    letterSpacing: 0.5,
                    marginBottom: 30
                  }}>Scegli come prenotare</Text>
                  <ScrollView
                    contentContainerStyle={{
                      minHeight: Metrics.screenHeight * 0.1,
                      paddingHorizontal: Metrics.baseMargin
                    }}
                  >
                    {inspiaggia_gest && (
                      <Calendar
                        setSelectedDates={setSelectedDates}
                        selectedDates={selectedDates}
                        showConfirm={showConfirm}
                        setShowConfirm={setShowConfirm}
                        beachSpot={beachSpot}
                      />
                    )}
                    {whatsapp && (
                      <View style={{flex: 1, marginBottom: 30}}>
                        <TouchableOpacity
                          onPress={() => {
                            const body = "Ciao, ti ho trovato con l'app inSpiaggia, vorrei effettuare una prenotazione!";
                            openWhatsappUrl(whatsapp.details.phone, body).then(r => {}).catch(e => {
                              Alert.alert('Whatsapp non presente')
                            })
                          }}
                        >
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                            <FontIcon iconName={'whatsapp-square'} collectionName={'FontAwesome5'} size={50} color={'#25D366'}/>
                            <Text style={{
                              marginLeft: Metrics.baseMargin,
                              fontSize: Fonts.size.normal,
                              fontFamily: Fonts.type.base,
                              color: Colors.text
                            }}>WhatsApp</Text>
                          </View>
                          { whatsapp.details.description?.length > 0 && (
                            <View style={{
                              flexDirection: 'row',
                            }}>
                              <View style={{width: 50}}></View>
                              <Text style={{
                                marginLeft: Metrics.baseMargin,
                                fontSize: Fonts.size.small,
                                fontFamily: Fonts.type.light,
                                color: Colors.text
                              }}>{whatsapp.details.description}  </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                    {call && (
                      <View style={{flex: 1, marginBottom: 30}}>
                        <TouchableOpacity
                          onPress={() => {
                            openCallUrl(call.details.phone).then(r => {}).catch(e => {
                              Alert.alert("Operazione non supportata dal telefono")
                            })
                          }}
                        >
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                            <FontIcon iconName={'phone-square'} collectionName={'FontAwesome'} size={50} color={Colors.text}/>
                            <Text style={{
                              marginLeft: Metrics.baseMargin,
                              fontSize: Fonts.size.normal,
                              fontFamily: Fonts.type.base,
                              color: Colors.text
                            }}>Chiamata</Text>
                          </View>
                          { call.details.description?.length > 0 && (
                            <View style={{
                              flexDirection: 'row',
                            }}>
                              <View style={{width: 50}}></View>
                              <Text style={{
                                marginLeft: Metrics.baseMargin,
                                fontSize: Fonts.size.small,
                                fontFamily: Fonts.type.light,
                                color: Colors.text
                              }}>{call.details.description}</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                    {sms && (
                      <View style={{flex: 1, marginBottom: 30}}>
                        <TouchableOpacity
                          onPress={() => {
                            const body = "Ciao, ti ho trovato con l'app inSpiaggia, vorrei effettuare una prenotazione!";
                            openSmsUrl(sms.details.phone, body).then(r => {}).catch(e => {
                              Alert.alert("Operazione non supportata dal telefono")
                            })
                          }}
                        >
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                            <FontIcon iconName={'sms'} collectionName={'MaterialIcons'} size={50} color={'#268CDC'}/>
                            <Text style={{
                              marginLeft: Metrics.baseMargin,
                              fontSize: Fonts.size.normal,
                              fontFamily: Fonts.type.base,
                              color: Colors.text,
                              marginBottom: 5
                            }}>SMS</Text>
                          </View>
                          { sms.details.description?.length > 0 && (
                            <View style={{
                              flexDirection: 'row',
                            }}>
                              <View style={{width: 50}}></View>
                              <Text style={{
                                marginLeft: Metrics.baseMargin,
                                fontSize: Fonts.size.small,
                                fontFamily: Fonts.type.light,
                                color: Colors.text
                              }}>{sms.details.description}</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                    {external_url && (
                      <View style={{flex: 1, marginBottom: 30}}>
                        <TouchableOpacity
                          onPress={() => {
                            openUrl(external_url.details.url).then(r => {}).catch(e => {
                              Alert.alert("Impossibile aprire il link")
                            })
                          }}
                        >
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                            <FontIcon iconName={'external-link'} collectionName={'Feather'} size={50} color={Colors.text}/>
                            <Text style={{
                              marginLeft: Metrics.baseMargin,
                              fontSize: Fonts.size.normal,
                              fontFamily: Fonts.type.base,
                              color: Colors.text
                            }}>Sito prenotazione</Text>
                          </View>
                          { external_url.details.description?.length > 0 && (
                            <View style={{
                              flexDirection: 'row',
                            }}>
                              <View style={{width: 50}}></View>
                              <Text style={{
                                marginLeft: Metrics.baseMargin,
                                fontSize: Fonts.size.small,
                                fontFamily: Fonts.type.light,
                                color: Colors.text
                              }}>{external_url.details.description}  </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  </ScrollView>
                  {!inspiaggia_gest && (
                    <View style={{marginTop: 10}}>
                      <Text style={{
                        fontSize: Fonts.size.small,
                        fontFamily: Fonts.type.light,
                        textAlign: 'center'
                      }}>Ricordati di dire che vieni da inSpiaggia ;)</Text>
                    </View>
                  )}
                </View>
              )}
          </View>
        </Modalize>
      </Portal>
    );
  },
);
