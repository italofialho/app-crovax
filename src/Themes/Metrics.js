import { Platform, NativeModules } from "react-native";

const width = require("Dimensions").get("window").width;
const height = require("Dimensions").get("window").height;
const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = StatusBarManager.HEIGHT;

// Used via Metrics.baseMargin
const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  horizontalLineHeight: 1,
  searchBarHeight: 30,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: Platform.OS === "ios" ? 20 : height * 0.045,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 60
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 300
  },
  elevation: 5,
  logoWidth: 158,
  logoHeight: 264,
  horizontalLogoWidth: 494,
  horizontalLogoHeight: 203,
  deviceWidth: width,
  deviceHeight: height,
  tabIndicatorWidth: width / 4.5,
  tabIndicatorHeight: height / 70,
  tabIconWidth: width / 9,
  tabIconHeight: width / 9,
  statusBarHeight: STATUSBAR_HEIGHT
};

export default metrics;
