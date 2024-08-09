import React, {useRef, useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Alert,
} from 'react-native';
import IconIonicon from 'react-native-vector-icons/dist/Ionicons';
import I18n from 'i18n-js';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import R from 'ramda';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {PhoneContact} from './PhoneContact';
import {Notes} from './Notes';
import stylesfactory from '../../Styles/ReservationModalStyle';
import {Images, Colors, Fonts, Metrics} from '../../../Themes';
import BeachSpotActions from '../../../Redux/BeachSpotRedux';
import {Locality, Title} from '../../../Components/BeachSpot';
import {TextInput} from 'react-native-gesture-handler';
import UserAuthActions from '../../../Redux/UserAuthRedux';
import Spinner from 'react-native-loading-spinner-overlay';
import {useStripe} from '@stripe/stripe-react-native';
import {getOrderPaymentConfirmRequest} from '../../../Sagas/BeachSpotsSagas';

export const ReservationSummary = ({navigation}) => {
  const modalRef = useRef(null);

  const dispatch = useDispatch();

  const [notes, setNotes] = useState('');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const styles = stylesfactory.getSheet();
  const {beachSpot} = navigation.state.params;

  const userData = useSelector(state => state.userAuth);
  const lockState = useSelector(state => state.beachSpots?.order?.lock);
  const paymentIntentState = useSelector(
    state => state.beachSpots?.order?.paymentIntent,
  );

  const {details} = userData;
  const {data} = lockState;
  const {order_details} = data;
  const orderData = order_details.placements_orders[0];
  const paymentIntentData = paymentIntentState.data;

  const isInitialMount = useRef(true);
  const [timerCount, setTimer] = useState(300);
  const [paymentType, setPaymentType] = useState(0);

  // PAYMENT SYSTEM
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  // const [loading, setLoading] = useState(false);

  const openPaymentSheet = async () => {
    const result1 = await initPaymentSheet({
      customerId: paymentIntentData?.stripe.customer,
      customerEphemeralKeySecret: paymentIntentData?.stripe.ephemeralKey,
      paymentIntentClientSecret: paymentIntentData?.stripe.paymentIntent,
    });

    if (!result1.error) {
      await new Promise(() =>
        setTimeout(async () => {
          const result2 = await presentPaymentSheet({
            clientSecret: paymentIntentData?.stripe.paymentIntent,
          });
          if (result2.error) {
            Alert.alert(
              `Error code: ${result2.error.code}`,
              result2.error.message,
            );
            setPaymentType(0);
          } else {
            dispatch(
              BeachSpotActions.getOrderPaymentConfirmRequest({
                beachSpotId: beachSpot.id,
                orderId: order_details.id,
                paymentType: paymentType,
              }),
            );
            Alert.alert(
              'Fatto',
              "Il tuo ordine è confermato!\n\nPuoi rivedere i tuoi ordini nella sezione Ordini e riceverai un'email di conferma",
            );
            setPaymentType(0);
            navigation.navigate({
              routeName: beachSpot.is_private
                ? 'BeachSpotPrivateDetails'
                : 'BeachSpotDetails',
              params: {
                id: beachSpot.id,
              },
            });
          }
        }, 1000),
      );
    } else {
      Alert.alert(`Error code: ${result1.error.code}`, result1.error.message);
      setPaymentType(0);
    }
  };

  useEffect(() => {
    if (
      !isInitialMount.current &&
      paymentIntentData &&
      !paymentIntentState.error
    ) {
      if (paymentIntentData) {
        openPaymentSheet();
      }
    }

    isInitialMount.current = false;
  }, [paymentIntentData]);

  // END PAYMENT SYSTEM
  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        if (lastTimerCount <= 1) {
          clearInterval(interval);
          Alert.alert(
            'Tempo esaurito, riprova!',
            "\nIl tempo per completare l'ordine è esaurito.\n\nPuoi riprovare effettuando una nuova prenotazione!\n",
          );
          navigation.goBack();
        }
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (paymentType > 0) {
      handleConfirmBuy();
    }
  }, [paymentType]);

  const renderInfoBlock = (label, text, icon) => {
    return (
      <View style={styles.infoBlockContainer}>
        <View style={styles.infoBlockTop}>
          <Image source={icon} style={styles.infoBlockIcon} />
          <Text style={styles.infoBlockLabel}>{label}</Text>
        </View>
        <Text style={styles.infoBlockText}>{text}</Text>
      </View>
    );
  };

  const renderEquipments = () => {
    const equipments = R.countBy(x => x)(orderData.package.equipments);
    return (
      <View style={{width: '100%'}}>
        {Object.keys(equipments).map(eq => (
          <Text style={styles.packageTitle}>{`${eq} x ${equipments[eq]}`}</Text>
        ))}
      </View>
    );
  };

  const handleConfirmBuy = force => {
    if (details.telephone_number || force) {
      dispatch(
        BeachSpotActions.getOrderPaymentIntentRequest({
          beachSpotId: beachSpot.id,
          orderId: order_details.id,
          paymentType: paymentType,
        }),
      );
    } else {
      modalRef?.current?.open();
    }
  };

  const renderNotes = () => (
    <View style={styles.notesContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.notesTouchable}
        onPress={() => {
          setIsNotesExpanded(!isNotesExpanded);
          LayoutAnimation.easeInEaseOut();
        }}>
        <Text style={styles.notesText}>Aggiungi note</Text>
        <MaterialIcon
          size={25}
          name="chevron-down"
          style={{
            transform: [{rotate: isNotesExpanded ? '180deg' : '0deg'}],
            color: Colors.text,
          }}
        />
      </TouchableOpacity>
      {isNotesExpanded && (
        <TextInput
          testID="note"
          multiline={true}
          numberOfLines={4}
          style={[
            styles.textInput,
            {height: 150, width: '100%', marginTop: 15, paddingTop: 15},
          ]}
          autoCapitalize="none"
          onChangeText={text => setNotes(text)}
          underlineColorAndroid="transparent"
          selectionColor={Colors.activeButton}
          returnKeyType="done"
          value={notes}
          placeholder="Inserisci una nota"
          placeholderTextColor={Colors.grey}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[{paddingVertical: Metrics.baseMargin, paddingBottom: 0}]}>
        <View style={[styles.titleContainer]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconIonicon
              size={30}
              name={'ios-arrow-back'}
              style={{
                color: 'black',
                textAlign: 'center',
                height: 30,
                width: 30,
              }}
            />
          </TouchableOpacity>
          <Text style={[styles.title, {color: Colors.text}]}>
            {I18n.t('beachSpotSummary')}
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: Colors.activeOrange,
              paddingVertical: Metrics.baseMargin,
              paddingHorizontal: Metrics.doubleBaseMargin,
            }}>
            Tempo rimanente per l'ordine:{' '}
            <Text style={{fontWeight: 'bold'}}>
              {Math.ceil(timerCount / 60)} minuti
            </Text>
          </Text>
        </View>
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <Image
          source={Images.ticketCover}
          style={styles.ticketImage}
          resizeMode={'cover'}
        />
        <View style={styles.ticketInfo}>
          <Title beachSpot={beachSpot} rightComponent={() => {}} />
          <Locality beachSpot={beachSpot} rightComponent={null} />
          <View style={[styles.datesContainer, {marginTop: 15}]}>
            {renderInfoBlock(
              'Check in',
              moment(order_details.day_start).format('D MMM'),
              Images.calendar,
            )}
            <View style={styles.verticalSeparator} />
            {renderInfoBlock(
              'Check out',
              moment(order_details.day_end).format('D MMM'),
              Images.calendar,
            )}
            <View style={styles.verticalSeparator} />
            {renderInfoBlock(
              'Persone',
              `max ${orderData.package.persons_max}`,
              Images.tag,
            )}
          </View>
          <View style={styles.horizontalSeparator} />
          {renderEquipments()}
          <View style={styles.horizontalSeparator} />

          <View style={styles.datesContainer}>
            <Text style={styles.priceLabel}>Prezzo da pagare</Text>
            <Text style={styles.priceValue}>{order_details.total_price}</Text>
          </View>
        </View>
        {renderNotes()}
      </KeyboardAwareScrollView>
      <View style={[styles.absoluteContainer, {height: 100}]}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              width: '40%',
              backgroundColor: 'white',
              borderWidth: 2,
              borderColor: Colors.activeButton,
            },
          ]}
          onPress={() => {
            setPaymentType(1);
          }}>
          <Text
            style={[
              styles.buttonText,
              {color: Colors.activeButton, textAlign: 'center'},
            ]}>
            {I18n.t('beachSpotBookingHold')}
            {'\n'}
            {order_details.computed_fee}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {width: '55%'}]}
          onPress={() => {
            setPaymentType(2);
          }}>
          <Text style={styles.buttonText}>
            {I18n.t('beachSpotBookingPurchase')}
          </Text>
        </TouchableOpacity>
      </View>
      <Portal>
        <Modalize
          ref={modalRef}
          scrollViewProps={{keyboardShouldPersistTaps: 'always'}}
          handlePosition="inside"
          adjustToContentHeight
          modalStyle={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}>
          <PhoneContact
            callback={() => {
              modalRef?.current?.close();
              handleConfirmBuy(true);
            }}
          />
        </Modalize>
      </Portal>

      {paymentIntentState?.isFetching && (
        <Spinner
          cancelable={false}
          visible
          textContent=""
          textStyle={{color: 'white'}}
        />
      )}
    </SafeAreaView>
  );
};
