import React from 'react';
import ApplicationComponent from '../../Containers/ApplicationComponent';
import {View} from 'react-native';
import {BottomTabBar} from 'react-navigation';
import {connect} from 'react-redux';
import {Colors} from '../../Themes/Colors';

class TabBar extends ApplicationComponent {
  render() {
    return this.state.reRender ? null : (
      <BottomTabBar
        {...this.props}
        style={this.props.style}
        activeTintColor={Colors.activeButton}
        // getButtonComponent={this.getButtonComponent}
      />
    );
  }

  getButtonComponent({route}) {
    return () => <View />; // a view that doesn't render its children
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabBar);
