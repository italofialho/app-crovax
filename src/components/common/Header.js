import React, { Component } from "react";

import {
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { Header, Left, Body, Title, Icon, Right, Button, Subtitle } from 'native-base';

import { Metrics, Colors } from "../../Themes/";

import { Actions } from "../../../node_modules/react-native-router-flux";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      visible: false,
      textFilter: "",
      oldTextFilter: ""
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ ...props });
  }

  renderLeftButtons = () => {
    const { backButton } = this.state;

    if (backButton) {
      return (
        <Left>
          <TouchableOpacity onPress={() => Actions.pop()}>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name='arrow-back' />
            </Button>
          </TouchableOpacity>
        </Left>
      );
    }
  };

  render() {
    const { subtitleText, backButton } = this.state;

    return (
      <Header
        style={styles.container}
        androidStatusBarColor={Colors.mainColor}
      >
        {this.renderLeftButtons()}
        <Body>
          <Title>{this.state.title}</Title>
          {subtitleText && <Subtitle>{subtitleText}</Subtitle>}
        </Body>
        <Right />
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Metrics.deviceWidth,
    height: Metrics.deviceHeight * 0.08,
    marginTop: Metrics.statusBarHeight,
    backgroundColor: Colors.mainColor,
    padding: Metrics.deviceWidth * 0.05,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  logo: {
    width: Metrics.deviceWidth * 0.13,
    height: Metrics.deviceHeight * 0.06
  },
  titleStyle: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "bold"
  },
  leftItems: {
    alignItems: "center",
    flexDirection: "row"
  },
  containerModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center"
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 100,
    elevation: Metrics.elevation,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: -20,
    elevation: 5,
    marginRight: Metrics.deviceWidth * 0.1
  },
  modalFilter: {
    borderRadius: 10,
    backgroundColor: "white",
    width: Metrics.deviceWidth * 0.9,
    alignItems: "center",
    justifyContent: "center"
  },
  descriptionFilter: {
    fontSize: 14,
    color: "#000",
    marginHorizontal: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
    marginTop: Metrics.doubleBaseMargin + Metrics.baseMargin,
    textAlign: "center"
  },
  inputContainer: {
    width: Metrics.deviceWidth,
    alignItems: "center",
    justifyContent: "center"
  },
  formInputModal: {
    width: Metrics.deviceWidth * 0.8,
    color: "black"
  },
  buttonFilter: {
    height: 40,
    width: Metrics.deviceWidth * 0.4,
    borderRadius: 3,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    elevation: Metrics.elevation,
    marginVertical: Metrics.doubleBaseMargin
  },
  textButtonFilter: {
    fontSize: 14,
    color: "#fff"
  },
  buttonClearFilter: {
    height: 40,
    width: Metrics.deviceWidth * 0.4,
    borderRadius: 3,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: Metrics.elevation,
    marginVertical: Metrics.doubleBaseMargin,
    marginRight: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: "red"
  },
  textButtonClearFilter: {
    fontSize: 14,
    color: "red"
  }
});


export default HeaderComponent;
