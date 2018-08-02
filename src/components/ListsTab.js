import React, { Component } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl
} from "react-native";

import { Colors, Metrics, Images } from "../Themes";

import firebase from 'firebase';

import moment from 'moment';
import _ from 'lodash';

import { Thumbnail, Card, CardItem, Container, Content } from 'native-base';
import { Actions } from "react-native-router-flux";
import HeaderComponent from "./common/Header";


class ListsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      loading: true,
      refreshing: false,
      lists: []
    };
  }

  componentDidMount() {
    this.loadList();
  }

  loadList() {
    return new Promise((resolve) => {
      firebase
        .database()
        .ref("Lists/")
        .orderByChild("startDateEpoch")
        .startAt(moment().valueOf())
        .on("value", (listsSnapshot) => {
          this.setState({ lists: listsSnapshot.val(), loading: false }, () => {
            resolve(true);
          });
        });
    });
  }



  _renderItem(item) {

    const authPlayer = firebase.auth().currentUser;
    const playerOnList = _.includes(_.keys(item.playerList), authPlayer.uid);
    const listFull = item.maxPlayers === _.size(item.playerList);

    return (
      <TouchableOpacity onPress={() => Actions.listDetails({ list: item, backButton: true })}>
        <Card>
          <CardItem style={{ borderLeftColor: playerOnList ? Colors.green : listFull ? Colors.black : Colors.mainColor, borderLeftWidth: 5 }}>
            <View style={styles.flatlist}>
              <Thumbnail
                source={
                  item.userProfileImage
                    ? { uri: item.userProfileImage }
                    : Images.logoWhite
                }
                style={styles.thumbnail}
              />
              <View style={styles.flatlistInfoWrapper}>
                <Text style={[styles.flatlistTitle, { fontSize: 20 }]}>{item.title}</Text>
                <Text style={[styles.flatlistSubtitle, { fontWeight: 'bold' }]}>{item.type}</Text>
                <Text style={styles.flatlistSubtitle}>
                  <Text style={styles.flatlistTitle}>Data: </Text> {moment(item.startDateEpoch).format("DD/MM HH:mm")} até {moment(item.endDateEpoch).format("DD/MM [às] HH:mm")}
                </Text>
                <Text style={styles.flatlistSubtitle}>
                  <Text style={styles.flatlistTitle}>R$ </Text>
                  {item.price}
                </Text>
                <Text style={styles.flatlistSubtitle}>
                  <Text style={styles.flatlistTitle}>Players: </Text>
                  {_.size(item.playerList)}/{item.maxPlayers}
                </Text>
              </View>
            </View>
          </CardItem>
        </Card>
      </TouchableOpacity>
    );
  }

  renderLoading = () => {
    if (!this.state.loading) return null;

    return (
      <View style={{ marginTop: Metrics.deviceHeight * 0.5 }}>
        <ActivityIndicator size="large" color={Colors.mainColor} />
      </View>
    );
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadList().then(() => {
      this.setState({ refreshing: false });
    });
  }

  renderContainer = () => {
    return (
      <View style={styles.container}>

        <View style={styles.highlightsWrapper}>
          <FlatList
            data={_.values(this.state.lists)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => this._renderItem(item, index)}
            refreshControl={
              <RefreshControl
                tintColor={Colors.mainColor}
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          />
        </View>
      </View>
    );
  };

  render() {
    return (
      <Container>
        <HeaderComponent
          title="Listas"
          subtitleText={`${_.size(this.state.lists)} disponíveis`}
        />
        <Content padder>
          {this.state.loading ? this.renderLoading() : this.renderContainer()}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    flexDirection: "column"
  },
  highlightsImage: {
    width: Metrics.deviceWidth,
    height: Metrics.deviceHeight * 0.37
  },
  highlightsWrapper: {
    backgroundColor: Colors.white,
    alignSelf: "center"
  },
  greenLine: {
    width: Metrics.deviceWidth,
    height: Metrics.deviceHeight * 0.008,
    backgroundColor: Colors.mainColor
  },
  gameName: {
    marginLeft: Metrics.deviceWidth * 0.06,
    marginTop: Metrics.deviceWidth * 0.04,
    fontWeight: "bold",
    color: Colors.mainColor
  },
  gameScoreWrapper: {
    marginLeft: Metrics.deviceWidth * 0.06,
    flexDirection: "row",
    marginBottom: Metrics.deviceWidth * 0.02
  },
  gameScoreText: {
    fontSize: 19,
    fontWeight: "bold",
    color: Colors.black
  },
  gameScoreTextGoal: {
    fontSize: 19,
    color: Colors.black
  },
  gameTime: {
    marginLeft: Metrics.deviceWidth * 0.06,
    color: Colors.black,
    fontWeight: "bold"
  },
  referee: {
    marginLeft: Metrics.deviceWidth * 0.06,
    marginBottom: Metrics.deviceHeight * 0.03
  },
  flatlist: {
    width: Metrics.deviceWidth,
    flexDirection: "row",
    paddingBottom: Metrics.deviceWidth * 0.02,
    marginBottom: Metrics.deviceWidth * 0.03
  },
  flatlistImage: {
    width: Metrics.deviceWidth * 0.3,
    borderRadius: 4,
    height: Metrics.deviceHeight * 0.12
  },
  flatlistInfoWrapper: {
    // height: Metrics.deviceHeight * 0.12,
    padding: Metrics.deviceWidth * 0.02
  },
  flatlistTitle: {
    color: Colors.mainColor,
    fontWeight: "bold"
  },
  flatlistSubtitle: {
    color: Colors.black90
  },
  flatlistGameTime: {
    color: Colors.black,
    fontSize: 11
  },
  loadingMargin: {
    marginTop: Metrics.deviceWidth * 0.05
  },
  thumbnail: {
    borderColor: "red",
    borderWidth: 1,
    alignSelf: 'center'
  }
});

export default ListsTab;
