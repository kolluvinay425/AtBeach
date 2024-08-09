// Import necessary React and React Native components and functionalities
import React from "react";
import ApplicationComponent from "../Containers/ApplicationComponent";
import { Platform, View } from "react-native"; // Import Platform for OS checks and View for layout components
import PropTypes from "prop-types"; // Import PropTypes for prop type validation

// Import various icon libraries from react-native-vector-icons
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons";
import Feather from "react-native-vector-icons/dist/Feather";

// Import color settings from a centralized theme configuration
import { Colors } from "../Themes/Colors";
import { connect } from "react-redux"; // Import connect from React Redux for connecting the component to the Redux store

// Import custom icon configuration and a function to create a custom icon set
import icoMoonConfig from "../../assets/fonts/selection.json";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
const OIcon = createIconSetFromIcoMoon(icoMoonConfig); // Create a custom icon set named OIcon

const isIOS = Platform.OS === "ios"; // Determine if the platform is iOS

class FontIcon extends ApplicationComponent {
  // Define expected prop types for the component
  static propTypes = {
    size: PropTypes.number, // Expected to be a number
    iconName: PropTypes.string, // Expected to be a string
    color: PropTypes.string, // Expected to be a string
  };

  // Define default props in case they aren't passed to the component
  static defaultProps = {
    color: Colors.text, // Default text color from Colors theme
    size: 26, // Default icon size
    iconName: "ios-home", // Default icon name
  };

  render() {
    const { color, iconName, size, collectionName } = this.props; // Destructure props for easier access

    // Conditional rendering based on reRender state from inherited ApplicationComponent
    return this.state.reRender ? null : (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: size,
          height: size,
        }}
      >
        {/* Conditionally render icons from different libraries based on the collectionName prop */}
        {collectionName === "FontAwesome5" && (
          <FontAwesome5 name={iconName} size={size} style={{ color: color }} />
        )}
        {collectionName === "FontAwesome" && (
          <FontAwesome name={iconName} size={size} style={{ color: color }} />
        )}
        {collectionName === "Ionicons" && (
          <Ionicons name={iconName} size={size} style={{ color: color }} />
        )}
        {collectionName === "MaterialIcons" && (
          <MaterialIcons name={iconName} size={size} style={{ color: color }} />
        )}
        {collectionName === "inspiaggia" && (
          <OIcon name={iconName} size={size} style={{ color: color }} />
        )}
        {collectionName === "Feather" && (
          <Feather name={iconName} size={size} style={{ color: color }} />
        )}
      </View>
    );
  }
}

// Define empty mapStateToProps and mapDispatchToProps as placeholders
const maprStateToProps = () => ({});
const mapDispatchToProps = () => ({});

// Connect the FontIcon component to Redux and export it
export default connect(maprStateToProps, mapDispatchToProps)(FontIcon);
