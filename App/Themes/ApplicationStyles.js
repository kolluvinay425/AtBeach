// @flow

import Fonts from './Fonts';
import Metrics from './Metrics';
import {Colors} from './Colors';

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
  screen: {
    mainContainer: {
      flex: 1,
      // marginTop: Metrics.navBarHeight,
      backgroundColor: 'white',
    },
    mainTabContainer: {
      backgroundColor: 'white',
      height:
        Metrics.windowHeight - Metrics.navBarHeight - Metrics.tabBarHeight,
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    container: {
      flex: 1,
      paddingTop: Metrics.doubleBaseMargin,
    },
    content: {
      flex: 1,
      padding: Metrics.doubleBaseMargin,
    },
    section: {
      margin: Metrics.section,
      padding: Metrics.baseMargin,
      borderTopColor: Colors.frost,
      borderTopWidth: 0.5,
      borderBottomColor: Colors.frost,
      borderBottomWidth: 1,
    },
    sectionText: {
      color: Colors.snow,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    subtitle: {
      color: Colors.snow,
      padding: Metrics.smallMargin,
      marginBottom: Metrics.smallMargin,
      marginHorizontal: Metrics.smallMargin,
    },
  },
  darkLabelContainer: {
    backgroundColor: Colors.cloud,
    padding: Metrics.smallMargin,
  },
  darkLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.snow,
  },
  groupContainer: {
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Fonts.style.h4,
    color: Colors.coal,
    backgroundColor: Colors.ricePaper,
    padding: Metrics.smallMargin,
    marginTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: Colors.ember,
    alignItems: 'center',
    textAlign: 'center',
  },
  navBar: {
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    navBarTitle: {
      fontFamily: Fonts.type.light,
      fontSize: Fonts.size.medium,
      color: Colors.text,
    },
    navBarRightButtonText: {
      fontFamily: Fonts.type.base,
      fontSize: Fonts.size.normal,
      marginRight: Metrics.doubleBaseMargin,
      resizeMode: 'contain',
      color: Colors.text,
    },
  },
};

export default ApplicationStyles;
