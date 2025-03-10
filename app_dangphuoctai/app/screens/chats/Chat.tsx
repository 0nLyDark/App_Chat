import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { SplashScreen } from "expo-router";
import Inbox from "./Inbox";
SplashScreen.preventAutoHideAsync();

const Chat = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <View style={styles.borderSearch}>
        <View style={styles.searchBar}>
          <Image
            style={styles.iconSearch}
            source={require("../../../assets/images/icon_search.png")}
          />
          <TextInput
            style={styles.inputSearch}
            placeholder="Tìm kiếm"
            placeholderTextColor="white"
            onFocus={() => navigation.navigate("Search" as never)}
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
      <Inbox navigation={navigation} />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    // width: "100%",
    // height: "100%",
    flex: 1,
    backgroundColor: "black",
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
