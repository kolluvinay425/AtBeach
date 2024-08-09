// @flow

import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


import {Metrics, Fonts, Colors} from '../../Themes';
import {sortFirstArrayBySecondArray} from '../../Lib/Utilities';
import {StyleSheet} from 'react-native';
import {OIcon} from '../../Containers/MapTab/BeachSpotSearch/Macros';
import {ifElse} from 'ramda';

const DEFAULT_TAGS_TO_SHOW = 7
export const Tags = ({beachSpot, only_private, only_public, title}) => {
  // const [tags, setTags] = useState([]);
  // const isPrivate = beachSpot.is_private;
  const [showMore, setShowMore] = useState(false);
  // const [isData, setIsData] = useState(false);
  // useEffect(() => {
  //   setTags(sortFirstArrayBySecondArray(beachSpot.beach_tags, TAGS_ORDER));
  // }, [beachSpot.beach_tags]);
  const showAll = () => {
    setShowMore(!showMore);
  };

  let beach_tags = beachSpot.beach_tags.filter((bt) => (bt.key && bt.icon_name))
  if (only_private) {
    beach_tags = beach_tags.filter((bt) => bt.is_private )
  } else if (only_public) {
    beach_tags = beach_tags.filter((bt) => !bt.is_private )
  }

  const numberOfTagsToShow = beach_tags.length > DEFAULT_TAGS_TO_SHOW-1 ? DEFAULT_TAGS_TO_SHOW : beach_tags.length;
  const numberToShow = showMore ? beach_tags.length : numberOfTagsToShow;

  return (
    <>
      {(beach_tags.length > 0) ? (
        <View>
          <View style={tagStyle.descMargin}>
            <Text style={tagStyle.textStyle}>{title || 'Tags'}</Text>
          </View>
          <View>
            <TouchableWithoutFeedback onPress={showAll}>
              {beach_tags.slice(0, numberToShow).map((tag, index) => (
                <View key={tag.id}>
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingRight: 15,
                      verticalAlign: 'center',
                      height: 30,
                      marginBottom: 10,
                      paddingHorizontal: 4,
                      // backgroundColor: 'white'
                    }}>
                    <Text style={{color: Colors.text, fontSize: Fonts.size.medium, lineHeight: 25, textAlignVertical: 'bottom'}}>{tag.name_short}</Text>
                    <OIcon
                      name={tag.icon_name}
                      color={Colors.text}
                      // style={{backgroundColor: 'green'}}
                      size={25}
                    />
                  </View>
                </View>
              ))}
            </TouchableWithoutFeedback>
            {(beach_tags.length > DEFAULT_TAGS_TO_SHOW) ? (
              <TouchableOpacity onPress={showAll}>
                {!showMore ? (
                  <Text style={tagStyle.textTwo}>
                    Mostra tutti i Tag
                  </Text>
                ) : (
                  <Text style={tagStyle.textTwo}>Mostra meno</Text>
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}
    </>

    // <View>
    //   <>
    //     <ScrollView
    //       horizontal
    //       showsHorizontalScrollIndicator={false}
    //       style={tagStyle.scrollViewStyle}>
    //       {beachSpot.beach_tags.slice(0, 4).map((tag, index) => {
    //         const isKey = tag.key !== '';
    //         const isIconName = tag.icon_name !== '';
    //         if (isKey & isIconName) {
    //           console.log(tag.name_short);
    //           return (
    //             <View style={tagStyle.scrollViewStyle}>
    //               <View key={index} style={tagStyle.textContainer}>
    //                 <OIcon
    //                   name={tag.icon_name}
    //                   color={'white'}
    //                   style={Colors.tagInactive}
    //                   size={16}
    //                 />
    //                 <Text style={tagStyle.text}>{tag.name_short}</Text>
    //               </View>
    //             </View>
    //           );
    //         }
    //       })}
    //     </ScrollView>
    //     {beachSpot.beach_tags.length > 4 && (
    //       <ScrollView
    //         horizontal
    //         showsHorizontalScrollIndicator={false}
    //         style={tagStyle.scrollViewStyle}>
    //         {beachSpot.beach_tags
    //           .slice(4, beachSpot.beach_tags.length)
    //           .map((tag, index) => {
    //             const isKey = tag.key !== '';
    //             const isIconName = tag.icon_name !== '';
    //             if (isKey & isIconName) {
    //               return (
    //                 <View style={tagStyle.scrollViewStyle}>
    //                   <View key={index} style={tagStyle.textContainer}>
    //                     <OIcon
    //                       name={tag.icon_name}
    //                       color={'white'}
    //                       style={Colors.tagInactive}
    //                       size={16}
    //                     />
    //                     <Text style={tagStyle.text}>{tag.name_short}</Text>
    //                   </View>
    //                 </View>
    //               );
    //             }
    //           })}
    //       </ScrollView>
    //     )}
    //   </>
    // </View>
  );
};

const tagStyle = StyleSheet.create({
  scrollViewStyle: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingVertical: 5,
  },
  textContainer: {
    flexDirection: 'row',
    height: 32,
    borderRadius: 100,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: 5,
    backgroundColor: Colors.text,
  },
  text: {
    color: 'white',
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.type.base,
    textTransform: 'capitalize',
    marginLeft: 10,
  },
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
  textContainerTwo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    margin: 8,
  },
  textTwo: {
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.bold,
    color: Colors.red,
    marginVertical: 10,
  },
});
