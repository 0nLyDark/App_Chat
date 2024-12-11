import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";

const CommunityChatItem = ({ navigation }: { navigation: any }) => {
  const [loaded, error] = useFonts({
    Sacramento: require("../assets/fonts/Sacramento.otf"),
    OpenSans: require("../assets/fonts/OpenSans-Regular.ttf"),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("CommunityChat")}
    >
      <View style={styles.img}>
        <Image source={require("../assets/images/img_chat2.png")} />
      </View>
      <View style={styles.contentChat}>
        <View style={styles.headerChat}>
          <Text style={styles.title}>Space House</Text>
          <View style={styles.countPerson}>
            <Ionicons name="person" size={12} color="white" />
            <Text style={styles.timeMessage}>71/100</Text>
          </View>
        </View>
        <Text style={styles.message}>Let’s meet on 7am today and...</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CommunityChatItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    maxHeight: 80,
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
  },
  img: {
    width: "100%",
    height: "100%",
    maxWidth: 60,
    maxHeight: 60,
    borderWidth: 1,
    borderRadius: "50%",
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  contentChat: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 6,
  },
  headerChat: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countPerson: {
    display: "flex",
    flexDirection: "row",
    columnGap: 2,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 17,
    fontFamily: "OpenSans",
    fontWeight: "semibold",
  },
  message: {
    color: "#ACB3BF",
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "semibold",
  },
  timeMessage: {
    color: "#ACB3BF",
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "semibold",
  },
});
