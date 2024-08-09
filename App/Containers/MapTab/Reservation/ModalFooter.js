// @flow

import React, {useState, useRef, useEffect, forwardRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import I18n from 'i18n-js';
import R from 'ramda';

import stylesfactory from '../../Styles/ReservationModalStyle';
import {Metrics, Colors, Fonts} from '../../../Themes';

export const ReservationModalFooter = forwardRef(
  (
    {
      navigation,
      selectedDates,
      setSelectedDates,
      showConfirm,
      setShowConfirm,
      beachSpot,
    },
    modalRef,
  ) => {
    const [selectedTime, setSelectedTime] = useState(1);

    const styles = stylesfactory.getSheet();

    const showTimePicker = false; //R.keys(selectedDates).length <= 1;

    return (
      <>
        {showConfirm && (
          <View style={styles.footerOuterContainer}>
            {showTimePicker && (
              <>
                <View style={styles.footerTimeContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingRight: 40,
                    }}
                    style={{
                      flexDirection: 'row',
                      paddingLeft: Metrics.doubleBaseMargin - 5,
                      paddingVertical: Metrics.doubleBaseMargin,
                    }}>
                    {[1, 2, 3, 4].map(choice => (
                      <TouchableOpacity
                        key={choice}
                        onPress={() => setSelectedTime(choice)}
                        style={{
                          height: 50,
                          borderRadius: 100,
                          paddingHorizontal: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft: 8,
                          borderColor: Colors.text,
                          backgroundColor:
                            selectedTime === choice
                              ? 'rgba(9, 44, 76, 0.3)'
                              : 'white',
                          borderWidth: selectedTime === choice ? 2 : 1,
                        }}>
                        <Text
                          style={{
                            color: Colors.text,
                            fontSize: Fonts.size.medium,
                            fontFamily: Fonts.type.base,
                            textTransform: 'capitalize',
                          }}>
                          {I18n.t(`beachSpotBookingTimeZone${choice}`)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.separatorLine} />
              </>
            )}
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={[styles.button, {width: 170, backgroundColor: 'white'}]}
                onPress={() => {
                  setSelectedDates({});
                  setShowConfirm(false);
                  LayoutAnimation.easeInEaseOut();
                }}>
                <Text style={[styles.buttonText, {color: 'black'}]}>
                  {I18n.t('reportAlert_cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {width: 170}]}
                onPress={() => {
                  modalRef.current?.close();
                  navigation.navigate({
                    routeName: 'BeachSpotMapSelection',
                    params: {
                      data: beachSpot,
                      selectedDates,
                    },
                  });
                }}>
                <Text style={styles.buttonText}>
                  {I18n.t('beachSpotSummarySpot')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
    );
  },
);
