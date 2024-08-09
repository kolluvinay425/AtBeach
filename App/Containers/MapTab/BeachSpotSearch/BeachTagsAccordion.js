import React, {useState} from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList, ScrollView,
} from 'react-native';

import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../../../../assets/fonts/selection.json';
const OIcon = createIconSetFromIcoMoon(icoMoonConfig);

import BeachSpotActions from '../../../Redux/BeachSpotRedux';

import {connect} from 'react-redux';
import I18n from 'i18n-js';

import {Fonts, Metrics, Colors} from '../../../Themes';
import Collapsible from 'react-native-collapsible';

import { RFValue } from "react-native-responsive-fontsize";

const tagButtonHeightBoxed = (Metrics.windowWidth - Metrics.doubleBaseMargin * 2) * 0.21;
const tagButtonHeightUnboxed = (Metrics.windowWidth - Metrics.doubleBaseMargin * 2) * 0.16;

const styles = StyleSheet.create({
  iconContainerBoxed: {
    height: tagButtonHeightBoxed + 5,
    width: tagButtonHeightBoxed,
    marginBottom:
      (Metrics.windowWidth - Metrics.doubleBaseMargin * 2) / 9.9 / 4.8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.tagBorder,
    borderRadius: 13,
    justifyContent: 'center',
  },
  iconContainerUnboxed: {
    height: tagButtonHeightUnboxed,
    width: tagButtonHeightUnboxed,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.tagBorder,
    borderRadius: 13,
    justifyContent: 'center',
  },
  itemContainerBoxed: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContainerUnboxed: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  text: {
    marginTop: 7,
    fontFamily: Fonts.type.base,
    color: Colors.tagText,
    fontSize: RFValue(12),
    width: '100%',
    lineHeight: 18,
    textAlign: 'center'
  },
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  headerText: {
    fontSize: Fonts.size.h6,
    fontFamily: Fonts.type.bold,
    textTransform: 'capitalize',
    color: 'black',
    marginTop: 15,
  },
  extraSpace: { height: 60 }
});
const isIOS = Platform.OS === 'ios';

class BeachTagsAccordion extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      sections: this.props.beachTags ? this.props.beachTags.map((bt, i) => {return {index: i, title: bt.name, tags: bt.tags};}) : [],
      activeSections: [], //this.props.beachTags.map((_bt,i) => i),
    };
  }

  componentDidMount() {

    const activeSections = []
    this.state.sections.forEach((section) => {
      const tagArray = Object.values(section.tags)
      if (tagArray.slice(8, tagArray.length).some((tag) => this.props.searchFiltersActive.includes(tag.id))) {
        activeSections.push(section.index)
      }
    })

    this.setState({activeSections: activeSections})
  }

  handleSectionShowHide = (section, active) => {
    let activeSections = this.state.activeSections;
    if (active) {
      const index = activeSections.indexOf(section.index);
      if (index > -1) {
        activeSections.splice(index, 1);
      }
    } else {
      activeSections.push(section.index);
    }
    this.setState({activeSections: activeSections});
  }

  _renderHeader = section => {
    const active = this.state.activeSections.includes(section.index);
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{section.title}</Text>
        {Object.values(section.tags).length > 8 && (
          <TouchableOpacity
            style={{paddingLeft: 20, paddingTop: 20, paddingRight: 0}}
            onPress={() => { this.handleSectionShowHide(section, active)}}>
            <Text style={{...Fonts.style.description, color: Colors.tagActive}}>
              {active ? 'Mostra meno' : 'Mostra tutti'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  handlePress = item => {

    const {searchFiltersActive, setSearchFiltersActive, beachTags} = this.props

    let selectedTags = []
    if (searchFiltersActive.includes(item.id)) {
      selectedTags = searchFiltersActive.filter(tag => tag !== item.id)
      // DESELECT ALL CHILD TAGS WHEN DESELECTING ONE MACRO
      if (item.connected_tags_ids?.length > 0){
        item.connected_tags_ids.forEach((connected_tag) => {
          selectedTags = selectedTags.filter(tag => tag !== connected_tag)
        })
      }
      // REMOVE MACRO IF CHILD TAG IS DESELECTED
      for (const category in beachTags) {
        for (const tag in beachTags[category].tags) {
          if (beachTags[category].tags[tag].connected_tags_ids?.includes(item.id)){
            const parentId = beachTags[category].tags[tag].id
            selectedTags = selectedTags.filter(tag => tag !== parentId)
          }
        }
      }
    } else {
      selectedTags = [...searchFiltersActive, item.id]
      // ADD ALL CHILD TAGS WHEN ADDING A MACRO
      if (item.connected_tags_ids?.length > 0){
        selectedTags = [...selectedTags, ...item.connected_tags_ids]
      }
    }


    setSearchFiltersActive(selectedTags)

    // this.setState({selectedTags: selectedTags}, () => {
    //   this.props.setSearchParams( { ...this.props.searchParams, tags: this.state.selectedTags})
    // })
  };

  _renderItemBoxed = ({item}) => (

    <TouchableOpacity
      onPress={() => {this.handlePress(item)}}
      key={item.id}
      style={styles.itemContainerBoxed}>
      <View style={[styles.iconContainerBoxed, { borderColor: this.props.searchFiltersActive.includes(item.id) ? Colors.tagActive : Colors.tagBorder } ]}>
        <OIcon
          name={item.icon_name}
          color={'grey'}
          style={{ color: this.props.searchFiltersActive.includes(item.id) ? Colors.tagActive : Colors.tagInactive }}
          size={Metrics.windowWidth/17}
        />
        <Text numberOfLines={1} style={[styles.text, {color: this.props.searchFiltersActive.includes(item.id) ? Colors.tagActive : Colors.tagInactive}]}>
          {item.name_short}
        </Text>
      </View>
    </TouchableOpacity>
  )
  _renderItemUnboxed = ({item}) => (
    <TouchableOpacity
      onPress={() => {this.handlePress(item)}}
      key={item.id}
      style={styles.itemContainerUnboxed}>
      <View style={[styles.iconContainerUnboxed, { borderColor: this.props.searchFiltersActive.includes(item.id) ? Colors.tagActive : Colors.tagBorder }]}>
        <OIcon
          name={item.icon_name}
          color={'grey'}
          style={{color: this.props.searchFiltersActive.includes(item.id) ? Colors.tagActive : Colors.tagInactive }}
          size={Metrics.windowWidth/17}
        />
      </View>
      <Text numberOfLines={1} style={[styles.text, { color: this.props.searchFiltersActive.includes(item.id) ? Colors.tagActive : Colors.tagInactive}]}>
        {item.name_short}
      </Text>
    </TouchableOpacity>
  )
  _renderContent = section => {
    if (section.index < 4){
      return (
        <FlatList
          bounces={false}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={Object.values(section.tags)}
          renderItem={this._renderItemBoxed}
          numColumns={4}
        />
      )
    } else {
      return (
        <FlatList
          bounces={false}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={Object.values(section.tags)}
          renderItem={this._renderItemUnboxed}
          numColumns={4}
        />
      )
    }
  };
  // _renderFooter = section => {
  //   const active = this.state.activeSections.includes(section.index);
  //
  //   if (Object.values(section.tags).length < 5) return;
  //
  //   return (
  //     <View style={{marginBottom: 20}}>
  //       <TouchableOpacity
  //         onPress={() => {
  //           let activeSections = this.state.activeSections;
  //           if (active) {
  //             const index = activeSections.indexOf(section.index);
  //             if (index > -1) {
  //               activeSections.splice(index, 1);
  //             }
  //           } else {
  //             activeSections.push(section.index);
  //           }
  //           this.setState({activeSections: activeSections});
  //         }}>
  //         <Text style={{...Fonts.style.description, color: Colors.text}}>
  //           {active ? 'SHOW LESS' : 'SHOW MORE'}
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  // _updateSections = activeSections => {
  //   this.setState({activeSections});
  // };

  render() {
    return (
      <ScrollView
        nestedScrollEnabled={true}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}

        onScroll={({nativeEvent}) => {
          console.log(nativeEvent.contentOffset)
          if (nativeEvent.contentOffset.y < 50) {
            this.props.setModalizeDraggable(true)
          } else {
            this.props.setModalizeDraggable(false)
          }
        }}
        scrollEventThrottle={400}

        // style={{minHeight: Metrics.windowHeight}}
      >
        { this.state.sections.length < 1 && (<Text>Caricamento in corso</Text>) }
        {
          this.state.sections.map((section) => {

            // DIFFERENT HEIGHT BASED ON PHONE AND BOX NUMBER
            let height = tagButtonHeightBoxed + 10
            if (isIOS){
              if(section.index > 3){
                if (Object.values(section.tags).length > 4) {
                  height = tagButtonHeightUnboxed * 3.1
                } else {
                  height = tagButtonHeightUnboxed + 25
                }
              }
            } else {
              if(section.index > 3){
                if (Object.values(section.tags).length > 4) {
                  height = tagButtonHeightUnboxed * 3.3
                } else {
                  height = tagButtonHeightUnboxed + 27
                }
              }
            }

            const isCollapsed = !this.state.activeSections.includes(section.index)

            return (
              <View>
                {this._renderHeader(section)}
                <Collapsible
                  enablePointerEvents={true}
                  collapsedHeight={height}
                  collapsed={isCollapsed}
                >
                  {this._renderContent(section)}
                </Collapsible>
              </View>
            )
          })
        }
        <View style={styles.extraSpace} />
      </ScrollView>
    );
  }
}
const mapStateToProps = state => ({
  beachTags: state.startup.initVariables?.search_params?.categories,
  searchFiltersActive: state.beachSpots.filtered.searchFiltersActive,
});

const mapDispatchToProps = dispatch => ({
  setSearchFiltersActive: filters =>dispatch(BeachSpotActions.setSearchFiltersActive(filters)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BeachTagsAccordion);
