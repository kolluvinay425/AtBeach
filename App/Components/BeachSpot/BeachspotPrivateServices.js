import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Fonts, Colors} from '../../Themes';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import {useSelector} from 'react-redux';

const services = StyleSheet.create({
  descMargin: {
    marginTop: 20,
    marginBottom: 10,
  },
  textStyle: {
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.type.bold,
    color: Colors.text,
    marginBottom: 7,
    letterSpacing: 0.5,
    marginTop: 0,
  },
  color: {
    color: Colors.pinRed,
  },

  localtyContainer: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    margin: 8,
  },
  text: {
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.bold,
    color: Colors.red,
    marginVertical: 10,
  },
});
function BeachspotPrivateServices() {
  const [showMore, setShowMore] = useState(false);
  const privateServices = useSelector(
    s => s.beachSpots.current.data.beach_spot_services,
  );
  const showAll = () => {
    setShowMore(!showMore);
  };
  const less = privateServices.length > 4 ? 3 : privateServices.length;
  const show = showMore ? privateServices.length : less;
  return (
    <>
      {privateServices.length > 0 ? (
        <View style={services.descMargin}>
          <Text style={services.textStyle}>Servizi e attività offerte</Text>
        </View>
      ) : null}

      <View>
        {privateServices &&
          privateServices?.slice(0, show).map(s => (
            <View
              key={s.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}>
              <Text>{s.description}</Text>
              <IconFeather
                name={'coffee'}
                color={'#092C4C'}
                size={25}
                style={{
                  marginLeft: 15,
                }}
              />
            </View>
          ))}

        {privateServices.length > 4 ? (
          <TouchableOpacity onPress={showAll}>
            {!showMore ? (
              <Text style={services.text}>
                Mostra tutti e {privateServices.length - less} i servizi
              </Text>
            ) : (
              <Text style={services.text}>Show Less</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </>
  );
}

export default BeachspotPrivateServices;
