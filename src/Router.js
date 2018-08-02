import React, { Component } from "react";
import {
  View,
  StatusBar,
} from "react-native";

import { Scene, Router } from "react-native-router-flux";

import { Colors } from "./Themes/";

import SplashScreen from "./components/SplashScreen";
import Login from "./containers/AuthContainer/Login";
import Tabs from './containers/MainContainer/Tabs';
import Signup from './containers/AuthContainer/Signup';
import ListDetails from "./components/ListDetails";
import NewList from "./components/NewList";

class RouterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      container,
      sceneStyle,
      navigationBarStyle,
      titleStyle
    } = styles;
    
    return (
      <View style={[container]}>
        <StatusBar
          backgroundColor={Colors.mainColorDarker}
          translucent
          barStyle="light-content"
        />
        <Router
          sceneStyle={sceneStyle}
          navigationBarStyle={navigationBarStyle}
          titleStyle={titleStyle}
        >
          <Scene key="app">
            <Scene key="auth" initial hideNavBar>
              <Scene key="splash" component={SplashScreen} initial />
              <Scene key="login" component={Login} />
              <Scene key="tabs" component={Tabs} />
              <Scene key="signup" component={Signup} />
              <Scene key="listDetails" component={ListDetails} />
              <Scene key="newList" component={NewList} />
            </Scene>
          </Scene>
        </Router>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1
  },
  tabBarStyle: {
    backgroundColor: Colors.mainColor
  },
  sceneStyle: {
    backgroundColor: Colors.white
  },
  navigationBarStyle: {
    elevation: 10,
    backgroundColor: Colors.mainColor,
    borderBottomWidth: 0,
    shadowColor: "#000000",
    shadowOpacity: 0.7,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  titleStyle: {
    color: "#FFFFFF",
    letterSpacing: 1,
    fontWeight: "500",
    textAlign: "left",
    marginLeft: -30
  }
};

export default RouterComponent;
