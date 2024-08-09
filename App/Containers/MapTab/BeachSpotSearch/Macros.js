import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Image} from 'react-native-animatable';
import {
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native-gesture-handler';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import {SafeAreaView} from 'react-navigation';
import {useDispatch, useSelector} from 'react-redux';
import {Fonts, Metrics, Colors} from '../../../Themes';
import metrics from '../../../Themes/Metrics';

import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../../../../assets/fonts/selection.json';
import {isIos} from 'react-native-modalize/lib/utils/devices';
import BeachSpotActions from '../../../Redux/BeachSpotRedux';
export const OIcon = createIconSetFromIcoMoon(icoMoonConfig);

const tagStyle = StyleSheet.create({
  container: {
    width: metrics.windowWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    position: 'absolute',
    top: 30,
  },
  Iconcontainer: {
    flexDirection: 'row',
    height: 32,
    marginRight: 5,
    borderColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  scrollViewStyle: {
    width: metrics.windowWidth,// - (Metrics.doubleBaseMargin + 2),
    // marginHorizontal: metrics.doubleBaseMargin + 2,
    paddingVertical: Metrics.doubleBaseMargin + 2,
    // paddingRight: 100,
    paddingLeft: Metrics.doubleBaseMargin,
    position: 'absolute',
    top: isIos ? Metrics.statusBarHeight + 60 : 60,
  },
  textContainer: {
    height: 38,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
  },
  text: {
    marginLeft: 10,
    fontSize: Fonts.size.normal,
    textTransform: 'capitalize',
    fontFamily: Fonts.type.base,
    color: Colors.tagInactive,
  },
});

function Macros() {
  const dispatch = useDispatch();
  const macros = useSelector(
    state => state.startup.initVariables?.search_params?.categories[0],
  );
  const searchFiltersActive =
    useSelector(state => state.beachSpots?.filtered?.searchFiltersActive) || [];

  const updateActiveSearchFilters = id => {
    let selectedTags = [];
    if (searchFiltersActive.includes(id)) {
      selectedTags = searchFiltersActive.filter(tag => tag !== id);
    } else {
      selectedTags = [...searchFiltersActive, id];
    }
    dispatch(BeachSpotActions.setSearchFiltersActive(selectedTags, true));
  };

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tagStyle.scrollViewStyle}>
        {macros &&
          Object.entries(macros.tags).map(([k, tag]) => {
            const isActive = searchFiltersActive.includes(tag.id);
            return (
              <>
                <TouchableOpacity
                  key={k}
                  style={[
                    tagStyle.textContainer,
                    {borderColor: isActive ? Colors.pinBlue : 'white'},
                  ]}
                  onPress={() => {
                    updateActiveSearchFilters(tag.id);
                  }}>
                  <OIcon
                    name={tag.icon_name}
                    color={isActive ? Colors.pinBlue : Colors.grey}
                    style={Colors.tagInactive}
                    size={16}
                  />
                  <Text
                    style={[
                      tagStyle.text,
                      {
                        color: isActive ? Colors.pinBlue : Colors.text,
                      },
                    ]}>
                    {tag.name_short}
                  </Text>
                </TouchableOpacity>
              </>
            );
          })}
        <View style={{width: Metrics.doubleBaseMargin * 2}}></View>
      </ScrollView>
    </>
  );
}

export default Macros;
