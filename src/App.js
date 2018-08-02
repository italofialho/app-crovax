import React, { Component } from "react";
import * as firebase from "firebase";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  BackHandler,
  NetInfo,
  Alert
} from "react-native";

import { Root } from 'native-base';

import pt_BR from "moment/locale/pt-br";
import moment from "moment";

import Router from "./Router";

import SplashScreen from "react-native-smart-splash-screen";
class App extends Component {
  componentWillMount() {
    moment.locale("pt-BR");

    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        apiKey: "AIzaSyC1aamoyFGtgovVI8V-8SixdGwmM7bbQkI",
        authDomain: "appcvx-cd961.firebaseapp.com",
        databaseURL: "https://appcvx-cd961.firebaseio.com",
        projectId: "appcvx-cd961",
        storageBucket: "appcvx-cd961.appspot.com",
        messagingSenderId: "284956608831"
      });
    }
  }

  componentDidMount() {
    SplashScreen.close({
      animationType: SplashScreen.animationType.scale,
      duration: 1050,
      delay: 700
    });
  }
  render() {
    return (
      <Root>
          <Router />
      </Root>
    );
  }
}

export default App;
