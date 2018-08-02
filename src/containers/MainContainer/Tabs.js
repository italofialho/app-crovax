import * as React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { Colors } from "../../Themes";
import SettingsTab from "../../components/SettingsTab";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import ListsTab from "../../components/ListsTab";

class Tabs extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: "listsTab", title: "LISTAS", icon: "list-alt" },
      { key: "settingsTab", title: "CONFIG", icon: "settings" }
    ]
  };

  _renderIcon = ({ route }) => {
    if (route.icon === "trophy" || route.icon === "settings" || route.icon === "picture") {
      return <SimpleLineIcons name={route.icon} size={15} color={Colors.gray} />;
    }
    return <FontAwesome name={route.icon} size={15} color={Colors.gray} />;
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.mainDarkColor} />
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            listsTab: () => <ListsTab />,
            settingsTab: () => <SettingsTab />
          })}
          onIndexChange={index => this.setState({ index })}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={styles.tabStyle}
              renderIcon={this._renderIcon}
              labelStyle={styles.labelText}
              indicatorStyle={{
                backgroundColor: Colors.mainColor,
                top: 0
              }}
            />
          )}
          tabBarPosition="bottom"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  labelText: {
    color: Colors.gray,
    fontSize: 10,
    textAlign: "center"
  },
  tabStyle: {
    backgroundColor: Colors.white
  },
  tabBar: {
    flexDirection: "row"
  },
  tabItem: {
    flex: 1,
    alignItems: "center"
  }
});

export default Tabs;
