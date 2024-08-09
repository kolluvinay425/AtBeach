import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Fonts, Colors, Metrics} from '../../Themes';
import {capacityStyle} from '../../Containers/Styles/beachSpotDetailsStyles';
import I18n from 'i18n-js';
import {HtmlViewer} from './HtmlViewer';
const comuneStyles = StyleSheet.create({
  mainContainer: {
    padding: Metrics.doubleBaseMargin,
    height: 'auto',
    borderRadius: 30,
    marginTop: 20,
    backgroundColor: 'white',
  },
});

const extractContent = (s) => {
  const regex = /(<([^>]+)>)/ig;
  return s.replace(regex, '');
};

function MunicipalityInfo({info}) {
  if (info && extractContent(info).length > 10) {
    return (
      <View style={comuneStyles.mainContainer}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: Fonts.size.title,
            fontFamily: Fonts.type.bold,
            color: Colors.text,
          }}>
          Il comune informa
        </Text>
        <View style={{paddingHorizontal: Metrics.baseMargin, paddingVertical: Metrics.doubleBaseMargin}}>
          <HtmlViewer content={info}/>
        </View>
      </View>
    )
  } else {
    return null
  }
}

export default MunicipalityInfo;
