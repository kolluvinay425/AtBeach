// Import the necessary modules and functions
import { Component } from "react"; // Base React component class
import { getCurrentTheme } from "../Themes"; // Function to retrieve the current theme
import { withNavigation } from "react-navigation"; // HOC for React Navigation access
import NetInfo from "@react-native-community/netinfo"; // Module to handle network information
import StartupActions from "../Redux/StartupRedux"; // Redux actions related to startup processes

// Define a class that extends React.Component, enriched with navigation capabilities
class ApplicationComponent extends withNavigation(Component) {
  constructor(props) {
    super(props);

    // Initialize the current theme by calling the getCurrentTheme function
    const current_theme = getCurrentTheme();

    // Set the initial state of the component
    this.state = {
      reRender: false, // Flag to control re-rendering
      currentTheme: current_theme, // Store the current theme
    };
  }

  _componentDidMount() {
    // Setup listeners on navigation focus changes if navigation prop exists
    if (this.props.navigation) {
      // Listener for when the component is about to be focused
      this.focusListener = this.props.navigation.addListener(
        "willFocus",
        () => {
          const actualTheme = getCurrentTheme();
          // Check if the theme has changed when the component is focused
          if (actualTheme !== this.state.currentTheme) {
            this.setState(
              {
                currentTheme: actualTheme,
                reRender: true,
              },
              // Reset reRender flag after state update
              () => this.setState({ reRender: false })
            );
          }
        }
      );

      // Listener for when the component has been fully focused
      this.focusListenerDid = this.props.navigation.addListener(
        "didFocus",
        () => {
          // Allow rendering of the component
          this.setState({ canRenderNow: true });
        }
      );
    }
  }

  _UNSAFE_componentWillReceiveProps(newProps) {
    // React to changes in connection status between props updates
    if (
      (!this.props.connectionStatus.isConnected ||
        !this.props.connectionStatus.isInternetReachable) &&
      newProps.connectionStatus.isConnected &&
      newProps.connectionStatus.isInternetReachable
    ) {
      if (this.doAllRequests) {
        this.doAllRequests(true); // Potentially initiate network requests
        // Fetch the latest network state and update redux store
        NetInfo.fetch().then((state) => {
          this.props.setConnectionStatus(state);
        });
      }
    }
  }

  componentWillUnmount() {
    // Clean up listeners when the component is unmounted
    if (this.focusListener) {
      this.focusListener.remove();
    }

    if (this.focusListenerDid) {
      this.focusListenerDid.remove();
    }
  }
}

// Define mapStateToProps to inject part of the Redux store into the component as props
export function mapStateToPropsDefault(state, props) {
  return {
    connectionStatus: state.startup.connectionStatus, // Map connection status from Redux store
  };
}

// Define mapDispatchToProps to create functions that dispatch actions to the Redux store
export function mapDispatchToPropsDefault(dispatch) {
  return {
    setConnectionStatus: (status) =>
      dispatch(StartupActions.setConnectionStatus(status)), // Dispatch action to update connection status
  };
}

// Export the component as a default export
export default ApplicationComponent;
