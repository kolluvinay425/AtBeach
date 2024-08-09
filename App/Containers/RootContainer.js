// @flow

import React from 'react';
import ApplicationComponent from './ApplicationComponent';
import PropTypes from 'prop-types';
import {Platform, SafeAreaView, StatusBar, View} from 'react-native';
import {connect} from 'react-redux';
import '../I18n/I18n'; // keep before root container
import StartupActions from '../Redux/StartupRedux';
import stylesfactory from './Styles/RootContainerStyle';
import MainSwitchNavigator from '../Navigation/MainSwitchNavigator';
import ErrorBoundaryScreen from './ErrorBoundaryScreen';
import * as NavigationService from '../Lib/NavigationService';
import NetworkStatusBar from '../Components/NetworkStatusBar';

const isIOS = Platform.OS === 'ios';

class RootContainer extends ApplicationComponent {
  static propTypes = {
    startup: PropTypes.func,
  };

  static defaultProps = {
    startup: () => {},
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.state = {
      ...this.state,
    };
  }

  componentDidMount() {
    super._componentDidMount();
    NavigationService.setNavigator(this.navigator);
    this.props.startup();
  }

  render() {
    return this.state.reRender ? null : (
      <View style={this.styles.applicationView}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={isIOS ? '#F7F7F7' : '#b1b1b1'}
        />
        <ErrorBoundaryScreen>
          <MainSwitchNavigator
            ref={nav => {
              this.navigator = nav;
            }}
          />
          <NetworkStatusBar />
        </ErrorBoundaryScreen>
      </View>
    );
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({
  startup: () => dispatch(StartupActions.startup()),
});

export default connect(
  null,
  mapDispatchToProps,
)(RootContainer);
