import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { navigate } from "expo-router/build/global-state/routing";
import { Ionicons } from "@expo/vector-icons";

const Menu = () => {
  const navigation = useNavigation();

  const menuWidth = 250;
  const menuAnimation = useRef(new Animated.Value(-menuWidth)).current;
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: isMenuOpen ? -menuWidth : 0, // Đóng (-menuWidth) hoặc mở (0)
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerMenu}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          onPress={() => navigation.navigate("Setting" as never)}
        >
          <View style={styles.imgProfile}>
            <Image
              source={require("../../../assets/images/img_profile.png")}
              style={styles.img}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.txtName}>Draks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSetting}
          onPress={() => navigation.navigate("Setting" as never)}
        >
          <Ionicons name="settings" size={24} color={"black"} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentMenu}>
        <TouchableOpacity onPress={() => navigation.navigate("Chat" as never)}>
          <Text>Home</Text>
        </TouchableOpacity>
        <Text>Menu</Text>
      </ScrollView>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerMenu: {
    height: 60,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    // Shadow cho iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // Đổ bóng xuống dưới
    shadowOpacity: 0.4,
    shadowRadius: 5,
    // Shadow cho Android
    elevation: 2,
  },
  imgProfile: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    borderWidth: 1,
    borderColor: "white",
    // overflow: "hidden",
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    // borderRadius: "50%",
  },
  txtName: {
    fontSize: 18,
  },
  btnSetting: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  contentMenu: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#97e1f8",
  },
});
