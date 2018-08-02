import React, { Component } from "react";
import firebase from "firebase";
import { Actions } from "react-native-router-flux";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Image,
  TouchableOpacity
} from "react-native";

import { Colors, Metrics, Images } from "../Themes";
import Header from "./common/Header";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ChampionshipTab from "./ChampionshipTab";

class MainTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      championshipsModalVisible: false,
      championship: "Brasileirão Série A",
      championshipIcon: Images.logoBrasileirao,
      championshipId: 0,
      searchText: ""
    };
  }

  componentDidMount() {
    const { currentUser } = firebase.auth();
  }

  renderModalItem = (championshipName, id, icon) => {
    const { championshipId } = this.state;
    return (
      <TouchableOpacity
        style={styles.championshipItem}
        onPress={() =>
          this.setState({
            championshipsModalVisible: false,
            championship: championshipName,
            championshipId: id,
            championshipIcon: icon
          })
        }
      >
        <View style={styles.itemLeft}>
          <Image source={icon} style={styles.championshipImage} />
          <Text style={styles.itemText}>{championshipName}</Text>
        </View>
        {championshipId == id && (
          <FontAwesome name="check" size={20} color={Colors.grayGradient0} />
        )}
      </TouchableOpacity>
    );
  };

  renderChampionshipsModal = () => {
    return (
      <Modal
        transparent
        visible={this.state.championshipsModalVisible}
        animationType={"fade"}
      >
        <View style={styles.championshipsModalWrapper}>
          <View style={styles.championshipsList}>
            {this.renderModalItem(
              "Campeonato Mineiro",
              0,
              Images.logoCampeonatoMineiro
            )}
            {this.renderModalItem(
              "Brasileirão Série A",
              1,
              Images.logoBrasileirao
            )}
            {this.renderModalItem("Copa do Brasil", 2, Images.logoCopaDoBrasil)}
            {this.renderModalItem(
              "Copa Libertadores",
              3,
              Images.logoCopaLibertadores
            )}
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header text="Campeonatos" onFilter={text => {
          this.setState({searchText: text});
        }}/>
        <TouchableOpacity
          onPress={() => {
            this.setState({ championshipsModalVisible: true });
          }}
        >
          <View style={styles.championshipChooserWrapper}>
            <Text style={styles.chooseText}>Selecione um campeonato</Text>

            <View style={styles.championshipChooserBottom}>
              <View style={styles.championshipChooserLeft}>
                <Image
                  source={this.state.championshipIcon}
                  style={styles.championshipImage}
                />
                <Text style={styles.championshipText}>
                  {this.state.championship}
                </Text>
              </View>

              <SimpleLineIcons
                name="arrow-down"
                size={20}
                color={Colors.grayGradient0}
              />
            </View>
          </View>
        </TouchableOpacity>
        <ChampionshipTab searchText={this.state.searchText}/>
        {this.renderChampionshipsModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    flexDirection: "column"
  },
  championshipChooserWrapper: {
    width: Metrics.deviceWidth,
    height: Metrics.deviceHeight * 0.13,
    borderBottomColor: Colors.grayGradient2,
    borderBottomWidth: 0.5,
    padding: Metrics.deviceWidth * 0.04
  },
  championshipChooserBottom: {
    flexDirection: "row",
    paddingTop: Metrics.deviceHeight * 0.01,
    alignItems: "center",
    justifyContent: "space-between"
  },
  chooseText: {
    color: Colors.grayGradient2
  },
  championshipImage: {
    width: Metrics.deviceWidth * 0.05,
    height: Metrics.deviceHeight * 0.05,
    marginRight: Metrics.deviceWidth * 0.03
  },
  championshipText: {
    fontWeight: "bold",
    color: Colors.black,
    fontSize: 16
  },
  championshipChooserLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  championshipsModalWrapper: {
    flex: 1,
    width: Metrics.deviceWidth,
    backgroundColor: Colors.black80,
    alignItems: "center",
    justifyContent: "center"
  },
  championshipsList: {
    width: Metrics.deviceWidth * 0.8,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: Colors.white
  },
  championshipItem: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Metrics.deviceWidth * 0.03
  },
  itemText: {
    fontSize: 18,
    color: Colors.gray
  },
  itemLeft: {
    alignItems: "center",
    flexDirection: "row"
  }
});

export default MainTab;
