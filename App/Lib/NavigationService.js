import {NavigationActions} from 'react-navigation';

const config = {};

export function setNavigator(nav) {
  if (nav) {
    // console.log("NAV", nav)
    // console.log("NAV", )
    config.navigator_container = nav;
    config.navigator = nav._navigation.getChildNavigation('MainTabNavigator');
  }
}

export function navigate(routeName, params, actions) {
  if (config.navigator && routeName) {
    let action = NavigationActions.navigate({routeName, params, actions});
    config.navigator.dispatch(action);
  }
}

export function dispatch(payload) {
  if (config.navigator && payload) {
    config.navigator.dispatch(payload);
  }
}

export function goBack() {
  if (config.navigator) {
    let action = NavigationActions.back({});
    config.navigator.dispatch(action);
  }
}

export function getCurrentStackRootRouteName() {
  if (config.navigator) {
    const containerNav =
      config.navigator_container.state.nav.routes[
        config.navigator_container.state.nav.index
      ];
    const contextNav = containerNav.routes[containerNav.index].routes[0];
    return contextNav.routeName;
  }
}

export function getTabBarVisibility() {
  if (config.navigator_container) {
    const containerNav =
      config.navigator_container.state.nav.routes[
        config.navigator_container.state.nav.index
      ];
    const contextNav = containerNav.routes[containerNav.index];
    const nav = contextNav.routes[contextNav.index];
    if (nav.params && typeof nav.params.isTabBarVisible !== 'undefined') {
      return nav.params.isTabBarVisible;
    } else {
      return null;
    }
  }
}
