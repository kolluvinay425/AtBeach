// @flow

import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import I18n from 'i18n-js';
import FastImage from 'react-native-fast-image';
import {Colors, Fonts, Metrics} from '../../Themes';
import {HtmlViewer} from './HtmlViewer';
import {StyleSheet} from 'react-native';
import images from '../../Themes/Images';
import {OIcon} from '../../Containers/MapTab/BeachSpotSearch/Macros';
import Collapsible from 'react-native-collapsible';
const descStyle = StyleSheet.create({
  descMargin: {
    marginBottom: 20,
  },
  textStyle: {
    // flexShrink: 1,
    textAlign: 'left',
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.bold,
    fontWeight: '600',
    color: Colors.text,
    // marginBottom: 7,
    // letterSpacing: 0.5,
    marginTop: 0,
    lineHeight: 33,
    marginRight: 10,
    height: 37,
    textAlignVertical: 'bottom'
  },
  color: {
    color: Colors.pinRed,
  },
});

export const Description = ({beachSpot, isPrivate}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpandable, setIsExpandable] = useState(true);
  const [collapsedHeight, setCollapsedHeight] = useState(120);
  // const [fullDescription, setFullDescription] = useState(false);
  const [isDescriptionCollapsed, setDescriptionCollapsed] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={descStyle.descMargin}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginBottom: 5}}>

        <Text style={descStyle.textStyle}>{I18n.t('description')}</Text>

        <FlatList
          data={beachSpot.beach_tags}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            height: 37,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          keyExtractor={(item) => item.id}
          renderItem={item => {
            const isKey = item.item.key !== '';
            const isIconName = item.item.icon_name !== '';

            if (isKey & isIconName) {
              return (
                <View
                  key={item.item.id}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    backgroundColor: 'white',
                    height: 30,
                    width: 30,
                    shadowColor: '#000000',
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    shadowOffset: {
                      height: 0,
                      width: 0,
                    },
                    elevation: 3,
                    marginHorizontal: 2,
                  }}>
                  <Text
                    style={{
                      padding: 0,
                    }}>
                    <OIcon
                      name={item.item.icon_name}
                      color={Colors.blueText}
                      size={18}
                    />
                  </Text>
                </View>
              );
            } else {
              return;
            }
          }}
        />
      </View>

      <Collapsible
        collapsedHeight={collapsedHeight}
        collapsed={isDescriptionCollapsed}
        enablePointerEvents={true}
      >
        <TouchableOpacity
          onPress={() => {isExpandable && setDescriptionCollapsed(!isDescriptionCollapsed)}}
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height

            if (isDescriptionCollapsed){
              if (height > 0 && height + 20 < collapsedHeight){
                setCollapsedHeight(height)
                setIsExpandable(false)
              }
            } else {
              if (height > 0 && height < collapsedHeight){
                setCollapsedHeight(event.nativeEvent.layout.height)
                setIsExpandable(true)
              }
            }
            // if (height > 0 && height < collapsedHeight - 50 || // the 50 height compensates different perceived height due to lineheight in html
            //   (height == collapsedHeight && !isDescriptionCollapsed)){
            //   setIsExpandable(false)
            //   setCollapsedHeight(event.nativeEvent.layout.height)
            // } else {
            //   setIsExpandable(true)
            // }
          }}
        >
          <HtmlViewer
            content={beachSpot.description}
          />
        </TouchableOpacity>
      </Collapsible>
      {
        isExpandable &&
        <TouchableOpacity
          onPress={() => setDescriptionCollapsed(!isDescriptionCollapsed)}>
          <Text style={descStyle.color}>{isDescriptionCollapsed ? 'Leggi di più...' : 'Nascondi' }</Text>
        </TouchableOpacity>
      }
    </View>
  );
};
