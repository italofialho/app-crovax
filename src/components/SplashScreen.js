import React, { Component } from "react";
import firebase from "firebase";
import {
  View,
  LayoutAnimation,
  ImageBackground,
  ActivityIndicator,
  Image,
  StatusBar
} from "react-native";

import { Actions } from "react-native-router-flux";

import { Metrics, Images, Colors } from "../Themes/";

import { verifyUserRef } from "../actions/AuthAction";

class SplashScreen extends Component {
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentWillMount() {
    this.processAuth();
  }

  processAuth() {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        verifyUserRef(user.uid);
      } else {
        Actions.login();
      }
    });
  }

  render() {
    return (
      <View>
        <ImageBackground source={Images.logoBackground} style={{ width: '100%', height: '100%' }}>
          <View style={styles.container}>
            <View style={{ backgroundColor: 'transparent' }}>
              <Image source={Images.logoWhite} style={styles.logoImg} />
              <ActivityIndicator
                size="large"
                color={Colors.white}
                style={styles.loadingMargin} />
              <StatusBar barStyle="default" translucent backgroundColor="transparent" />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0,0, 0.7)'
  },
  logoImg: {
    alignSelf: 'center',
    height: 150,
    width: Metrics.deviceWidth * 0.8,
  },
  loadingMargin: {
    marginTop: Metrics.deviceWidth * 0.05
  }
};

export default SplashScreen;
