import React, {useState} from 'react';
import {Text, LayoutAnimation, View} from 'react-native';
import {CalendarList} from 'react-native-calendars';
import R from 'ramda';
import moment from 'moment';

import stylesfactory from '../../Styles/ReservationModalStyle';
import {Colors, Metrics} from '../../../Themes';
import {isIphoneX} from 'react-native-iphone-x-helper';

const DATE_FORMAT = 'YYYY-MM-DD';
const isIPhoneX = isIphoneX()

export const Calendar = ({
                           beachSpot,
                           selectedDates,
                           setSelectedDates,
                           showConfirm,
                           setShowConfirm,
                         }) => {
  const styles = stylesfactory.getSheet();

  const constraints = beachSpot?.timings_detail?.booking_calendar_constrains;


  const getMinDate = () => {
    if (
      constraints &&
      moment().isSameOrAfter(moment(constraints.min_date)) &&
      moment().isSameOrBefore(moment(constraints.max_date))
    ) {
      return moment();
    }
    return moment(constraints.min_date);
  };

  return (
    <View style={{paddingTop: 40}}>
      <Text style={styles.title}>{beachSpot.name}</Text>
      <View style={styles.separator}>
        {constraints && (
          <CalendarList
            style={{
              width: Metrics.windowWidth - 20,
            }}
            theme={{
              'stylesheet.calendar.header': {
                header: {
                  justifyContent: 'flex-start',
                },
                monthText: {
                  fontSize: 16,
                  marginLeft: 8,
                  fontWeight: '500',
                  color: Colors.text,
                  paddingVertical: 3,
                },
              },
            }}
            minDate={getMinDate().format(DATE_FORMAT)}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={moment(constraints.max_date).format(DATE_FORMAT)}
            pastScrollRange={0}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={3}
            onDayPress={day => {
              // console.log('selected day', day);

              // if no selected dates -> new base
              // else
              // if new is previous -> new base
              // if new is
              // if another day is already selected
              // if next is later --> period
              // if next is prev -> new base
              // if I already have a period -> new base
              if (
                R.isEmpty(selectedDates) ||
                R.keys(selectedDates).length > 1 ||
                moment(day.dateString).isSameOrBefore(
                  moment(R.keys(selectedDates)[0]),
                )
              ) {
                setSelectedDates({
                  [day.dateString]: {
                    color: Colors.activeOrange,
                    textColor: 'white',
                    startingDay: true,
                    endingDay: true,
                  },
                });
              } else {
                const startingDate = R.keys(selectedDates)[0];

                let tempDates = {
                  [startingDate]: {
                    color: Colors.activeOrange,
                    textColor: 'white',
                    startingDay: true,
                  },
                };

                for (
                  let index = 1;
                  index <
                  moment(day.dateString).diff(moment(startingDate), 'days');
                  index++
                ) {
                  tempDates = R.assoc(
                    [
                      moment(startingDate)
                        .add(index, 'days')
                        .format(DATE_FORMAT),
                    ],
                    {
                      color: Colors.activeOrange,
                      textColor: 'white',
                    },
                    tempDates,
                  );
                }

                setSelectedDates({
                  ...tempDates,
                  [day.dateString]: {
                    color: Colors.activeOrange,
                    textColor: 'white',
                    endingDay: true,
                  },
                });
              }
              setShowConfirm(true);
              LayoutAnimation.easeInEaseOut();
            }}
            // Handler which gets executed on day long press. Default = undefined
            onDayLongPress={day => {
              // console.log('selected day', day);
            }}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={'MMMM yyyy'}
            markedDates={selectedDates}
            // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
            markingType={'period'}
          />
        )}
        {!constraints && (
          <View style={{ padding: Metrics.doubleBaseMargin, paddingBottom: isIPhoneX ? Metrics.tripleBaseMargin + Metrics.doubleBaseMargin : Metrics.tripleBaseMargin }}>
            <Text>Le prenotazioni per questa struttura non sono al momento disponibili</Text>
          </View>
        )}
      </View>
    </View>
  );
};
