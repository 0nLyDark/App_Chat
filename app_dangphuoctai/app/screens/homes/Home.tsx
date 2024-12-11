import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import Inbox from "./tabs/Inbox";
import Community from "./tabs/Community";

SplashScreen.preventAutoHideAsync();

const renderScene = SceneMap({
  first: Inbox,
  second: Community,
});

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "#29B6F6" }}
    style={{ backgroundColor: "black" }}
    activeColor="white"
    inactiveColor="white"
  />
);
const Home = ({ navigation }: { navigation: any }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Inbox" },
    { key: "second", title: "Community" },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <TouchableOpacity
            style={styles.imgProfile}
            onPress={() => navigation.navigate("Setting")}
          >
            <Image source={require("../../../assets/images/img_profile.png")} />
          </TouchableOpacity>
        </View>
        <View style={styles.viewHeaderCenter}>
          <Text style={styles.txtHeader}>Messanger</Text>
        </View>
        <View style={[styles.viewHeader, { alignItems: "flex-end" }]}>
          <Image
            style={styles.iconBell}
            source={require("../../../assets/images/icon_bell.png")}
          />
          <View style={styles.iconBellSub}></View>
        </View>
      </View>
      <View style={styles.borderSearch}>
        <View style={styles.searchBar}>
          <Image
            style={styles.iconSearch}
            source={require("../../../assets/images/icon_search.png")}
          />
          <TextInput
            style={styles.inputSearch}
            placeholder="Search"
            placeholderTextColor="white"
          />
          <TouchableOpacity>
            <Ionicons
              name="mic"
              size={20}
              color="white"
              style={styles.iconMicro}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        commonOptions={{
          label: ({ route, labelText, focused, color }) => (
            <Text
              style={{
                color,
                fontSize: 18,
                fontFamily: "OpenSans",
                fontWeight: "bold",
              }}
            >
              {labelText ?? route.title}
            </Text>
          ),
        }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    width: "100%",
    height: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: "#171717",
  },
  viewHeader: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  viewHeaderCenter: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  txtHeader: {
    width: "100%",
    maxWidth: 120,
    color: "white",
    textAlign: "center",
    fontSize: 32,
    fontFamily: "Sacramento",
  },
  imgProfile: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    borderWidth: 1,
    borderColor: "white",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBell: {
    width: 25,
    height: 27.78,
  },
  iconBellSub: {
    borderColor: "red",
    borderWidth: 4,
    borderRadius: "50%",
    width: 1,
    height: 1,
    position: "absolute",
    top: 18,
    right: 1,
  },
  borderSearch: {
    width: "100%",
    paddingHorizontal: 10,
  },
  searchBar: {
    flexDirection: "row",
    flexWrap: "nowrap",
    width: "100%",
    // maxWidth: 345,
    color: "white",
    height: 45,
    backgroundColor: "#50555C",
    borderRadius: 6,
    marginVertical: 7,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  inputSearch: {
    flex: 1,
    height: "100%",
    paddingLeft: 5,
    color: "white",
    borderColor: "transparent",
    outlineColor: "transparent",
  },

  iconSearch: {
    width: 24,
    height: 24,
  },
  iconMicro: {
    width: 24,
    height: 24,
  },
});
