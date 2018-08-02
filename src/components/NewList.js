import React, { Component } from "react";

import { TouchableOpacity, Text } from "react-native";

import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Picker,
  Icon,
  DatePicker,
  Button,
  Footer
} from "native-base";
import HeaderComponent from "./common/Header";

import { Actions } from 'react-native-router-flux';

import DateTimePicker from "react-native-modal-datetime-picker";

import moment from "moment";
import { Colors, Metrics } from "../Themes";

import firebase from 'firebase';

export default class NewList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: {
        title: "",
        description: "",
        maxPlayers: "",
        price: "",
        type: "mix",
        startDate: new Date(),
        startDateEpoch: "",
        endData: new Date(),
        endDateEpoch: ""
      },
      startDateTimePickerVisible: false,
      endDateTimePickerVisible: false
    };
  }

  handleUserInput(e) {
    const { target } = e;
    const { name, value } = target;

    this.setState(prevState => ({
      list: {
        ...prevState.list,
        [name]: value
      }
    }));
  }

  handleDataChange(name, value) {
    this.setState(prevState => ({
      list: {
        ...prevState.list,
        [name]: value
      }
    }));
  }

  showStartDateTimePicker = () =>
    this.setState({ startDateTimePickerVisible: true });

  showEndDateTimePicker = () =>
    this.setState({ endDateTimePickerVisible: true });

  hideStartDateTimePicker = () =>
    this.setState({ startDateTimePickerVisible: false });

  hideEndDateTimePicker = () =>
    this.setState({ endDateTimePickerVisible: false });

  handleStartDatePicked = date => {
    console.log("A date has been picked: ", date);
    this.handleDataChange("startDate", date);
    this.handleDataChange("startDateEpoch", moment(date).valueOf());
    this.hideStartDateTimePicker();
  };

  handleEndDatePicked = date => {
    console.log("A date has been picked: ", date);
    this.handleDataChange("endDate", date);
    this.handleDataChange("endDateEpoch", moment(date).valueOf());
    this.hideEndDateTimePicker();
  };

  saveList() {
    const listData = this.state.list;
    const authUser = firebase.auth().currentUser;
    listData.addedBy = authUser.displayName;
    listData.userProfileImage = authUser.photoURL;
    listData.maxPlayers = listData.maxPlayers ? parseInt(listData.maxPlayers) : 0;
    listData.insertedDate = moment().valueOf();

    firebase
      .database()
      .ref("Lists/")
      .push(listData)
      .then((snapShot) => {
        let listId = snapShot.key;
        firebase
          .database()
          .ref(`Lists/${listId}/id`)
          .set(listId)
          .then(() => {
            Actions.pop();
            Toast.show({
              text: 'Lista criada com sucesso!',
              buttonText: 'OK',
              type: "success"
            });
          }).catch((error) => {
            Toast.show({
              text: 'Erro ao criar lista!',
              buttonText: 'OK',
              type: "error"
            });
            console.log("saveList error:", error);
          });

      })
      .catch((error) => {
        Toast.show({
          text: 'Erro ao criar lista',
          buttonText: 'OK',
          type: "danger"
        });
        console.log("saveList error:", error);
      });

    console.log("saveList list:", listData);
  }

  render() {
    return (
      <Container>
        <HeaderComponent title="Nova Lista" backButton={true} />
        <Content padder>
          <Form>
            <Item last>
              <Input
                placeholder="Titulo"
                name="title"
                onChangeText={e => this.handleDataChange("title", e)}
              />
            </Item>
            <Item last>
              <Input
                placeholder="Descrição"
                name="description"
                onChangeText={e => this.handleDataChange("description", e)}
              />
            </Item>
            <Item last>
              <Input
                placeholder="Quantidade de players"
                keyboardType="numeric"
                name="maxPlayers"
                onChangeText={e => this.handleDataChange("maxPlayers", e)}
              />
            </Item>
            <Item last>
              <Input
                placeholder="Valor: 55,00"
                keyboardType="numeric"
                name="price"
                onChangeText={e => this.handleDataChange("price", e)}
              />
            </Item>
            <Item picker last>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                style={{ width: undefined }}
                placeholder="Tipo da lista"
                name="type"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.list.type}
                onValueChange={e => this.handleDataChange("type", e)}
              >
                <Picker.Item label="Mix" value="mix" />
                <Picker.Item label="Corujão" value="corujao" />
              </Picker>
            </Item>

            <Button block info onPress={() => this.showStartDateTimePicker()}>
              <Text style={{ color: Colors.white }}> Selecionar data de inicio</Text>
            </Button>
            <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 20 }}>
              {moment(this.state.list.startDate)
                .format("DD/MM/YYYY HH:mm")
                .toString()}
            </Text>
            <Button block info onPress={() => this.showEndDateTimePicker()}>
              <Text style={{ color: Colors.white }}> Selecionar data de fim</Text>
            </Button>
            <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 20 }}>
              {moment(this.state.list.endDate)
                .format("DD/MM/YYYY HH:mm")
                .toString()}
            </Text>

            <DateTimePicker
              isVisible={this.state.startDateTimePickerVisible}
              onConfirm={this.handleStartDatePicked}
              onCancel={this.hideStartDateTimePicker}
              minimumDate={new Date()}
              mode="datetime"
              date={this.state.list.startDate}
            />
            <DateTimePicker
              isVisible={this.state.endDateTimePickerVisible}
              onConfirm={this.handleEndDatePicked}
              onCancel={this.hideEndDateTimePicker}
              minimumDate={new Date()}
              mode="datetime"
              date={this.state.list.endData}
            />
          </Form>
        </Content>
        <Button full success onPress={() => this.saveList()}>
          <Text style={{ color: Colors.white, fontWeight: "bold" }}> LIBERAR LISTA</Text>
        </Button>
      </Container>
    );
  }
}
