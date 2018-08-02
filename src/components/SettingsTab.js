import React, { Component } from "react";
import firebase from "firebase";
import { Actions } from "react-native-router-flux";
import { TouchableOpacity, View, Text, Alert } from "react-native";

import { Colors, Metrics, Images } from "../Themes";
import Header from "./common/Header";

class SettingsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: {},
      authUserRule: "player"
    };

    this.getAuthUser();
  }

  componentDidMount() {
    this.getAuthUser();
  }

  getAuthUser() {
    const authUser = firebase.auth().currentUser;
    this.getUserRule(authUser.uid);
    this.setState({ authUser });
  }

  getUserRule(uid) {
    firebase
      .database()
      .ref(`Users/${uid}/rule`)
      .on("value", userSnapshot => {       
          this.setState({ authUserRule: userSnapshot.val() });
      });
  }

  renderLine = (text, action = () => null) => {
    return (
      <TouchableOpacity style={styles.textWrapper} onPress={() => action()}>
        <Text style={{ fontSize: 19, color: Colors.black }}>{text}</Text>
      </TouchableOpacity>
    );
  };

  doLogoff = () => {
    Alert.alert("Fazer logout", "Tem certeza que deseja sair?", [
      { text: "Cancelar", onPress: () => console.log("Cancelou o logoff") },
      {
        text: "Sim",
        onPress: () => {
          firebase
            .auth()
            .signOut()
            .then(
              () => {
                Actions.login();
              },
              error => {
                // An error happened.
              }
            );
        }
      }
    ]);
  };

  render() {
    return (
      <View style={styles.container}>
        <Header title="Configurações" />
        {this.renderLine("Meu Perfil", () =>
          Actions.signup({ isEditing: true })
        )}
        {this.state.authUserRule === "administrator" &&
          this.renderLine("Nova Lista", () =>
            Actions.newList({ rule: this.state.authUserRule })
          )}
        {this.renderLine("Logout", () => this.doLogoff())}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1
  },
  textWrapper: {
    paddingBottom: Metrics.deviceWidth * 0.05,
    marginLeft: Metrics.deviceWidth * 0.05,
    marginRight: Metrics.deviceWidth * 0.05,
    marginTop: Metrics.deviceWidth * 0.05,
    borderBottomColor: Colors.grayGradient2,
    borderBottomWidth: 0.5
  }
};

export default SettingsTab;
