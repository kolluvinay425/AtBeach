import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Fonts, Metrics} from '../../../Themes';
import BeachTagsAccordion from './BeachTagsAccordion';
import React from 'react';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Modalize} from 'react-native-modalize';
import stylesfactory from '../../Styles/MapScreenStyle';
import buttonStylesFactory from '../../../Components/Styles/ButtonStyle';
import {ModalComponent} from '../../../Components/ModalComponent';
import {connect} from 'react-redux';

import BeachSpotActions from '../../../Redux/BeachSpotRedux';

const isIOS = Platform.OS === 'ios';
const iPhoneBottomSpace = isIphoneX();

class BeachSpotSearchByFilters extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.buttonStyles = buttonStylesFactory.getSheet();

    this.state = {
      ...this.state,
      modalizeDraggable: true,
    };
  }

  setModalizeDraggable = (value = false) => {
    this.setState({modalizeDraggable: value});
  };

  render() {
    return (
      <ModalComponent
        setRef={(ref) => (this._modalRef = ref)}
        onClose={this.props.onClose}
        isVisible={this.props.isVisible}
        modalHeight={Metrics.windowHeight - Metrics.navBarHeightAdjusted}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
          showsVerticalScrollIndicator: false,
          bounces: true,
        }}
        panGestureEnabled={this.state.modalizeDraggable}
        disableScrollIfPossible={false}
        dragToss={0.001}
        velocity={undefined}
        HeaderComponent={
          <View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Applica i filtri</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>
        }
        FooterComponent={
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[styles.bottomButtonActiveReset]}
              onPress={() => { this.props.setSearchFiltersActive([]) }}>
              <Text style={[styles.bottomButtonTitleReset]}>Azzera filtri</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomButtonActiveBig]}
              onPress={() => {
                this.props.searchBeachSpots()
                this._modalRef.current.close()
              }}
            >
              <Text
                style={[styles.bottomButtonTitleActive]}>
                Mostra risultati
              </Text>
            </TouchableOpacity>
          </View>
        }>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.accordionContainer}>
            <BeachTagsAccordion
              setModalizeDraggable={this.setModalizeDraggable}
            />
          </View>
        </SafeAreaView>
      </ModalComponent>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  searchBeachSpots: params => dispatch(BeachSpotActions.searchBeachSpotsRequest(params)),
  setSearchFiltersActive: filters =>dispatch(BeachSpotActions.setSearchFiltersActive(filters)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BeachSpotSearchByFilters);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: 25,
    paddingBottom: 18,
  },
  headerText: {
    fontSize: Fonts.size.h5,
    fontFamily: Fonts.type.bold,
    color: Colors.activeButton,
    letterSpacing: 0.5,
  },
  headerSpacer: {
    borderBottomColor: Colors.spacerGrey,
    borderBottomWidth: 1,
  },
  accordionContainer: {
    // height: Metrics.windowHeight - Metrics.navBarOverStatusHeight - 165 - (iPhoneBottomSpace ? 15 : 0),
    overflow: 'hidden',
    marginHorizontal: 25,
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    backgroundColor: 'white',
    width: Metrics.windowWidth,
    padding: Metrics.doubleBaseMargin,
    paddingBottom: iPhoneBottomSpace
      ? Metrics.doubleBaseMargin + 20
      : Metrics.doubleBaseMargin,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    elevation: 24,
    borderTopColor: 'rgba(51,51,51,0.10)',
    borderTopWidth: isIOS ? 0 : 1,
  },
  bottomButtonActiveBig: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blue,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.blue,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  bottomButtonActiveReset: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.05)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  bottomButtonTitleActive: {
    fontSize: Fonts.size.normal,
    color: Colors.white,
    fontFamily: Fonts.type.bold,
  },
  bottomButtonTitleReset: {
    fontSize: Fonts.size.normal,
    color: '#FF0000',
    fontFamily: Fonts.type.bold,
  },
});
