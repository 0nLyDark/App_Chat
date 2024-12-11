import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const PersonalChatItem = ({ navigation }: { navigation: any }) => {
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
      onPress={() => navigation.navigate("PersonalChat")}
    >
      <View style={styles.img}>
        <Image source={require("../assets/images/img_chat.png")} />
      </View>
      <View style={styles.contentChat}>
        <View style={styles.headerChat}>
          <Text style={styles.title}>Nancy Jack</Text>
          <Text style={styles.timeMessage}>01:23 pm</Text>
        </View>
        <Text style={styles.message}>Hey, How are you?</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PersonalChatItem;

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
