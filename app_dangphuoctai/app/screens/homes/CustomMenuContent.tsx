import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { GET_ID, URL_IMAGE } from "@/app/api/APIService";

const CustomMenuContent = (props: any) => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  useEffect(() => {
    GET_ID("public/users/email", "token")
      .then((response) => {
        setAvatar(response.data.avatar);
        setFullName(response.data.fullName);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.headerMenu}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          onPress={() => props.navigation.navigate("Profile")}
        >
          <View style={styles.imgProfile}>
            <Image
              source={{ uri: URL_IMAGE + avatar }}
              style={styles.img}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.txtName}>{fullName}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSetting}
          onPress={() => props.navigation.navigate("Setting")}
        >
          <Ionicons name="settings" size={24} color={"black"} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentMenu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate("Chat")}
        >
          <View style={styles.iconMenuItem}>
            <Ionicons name="chatbubble" size={20} color={"black"} />
          </View>
          <Text style={styles.txtMenuItem}>Đoạn chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate("FriendRequest")}
        >
          <View style={styles.iconMenuItem}>
            <Ionicons name="person-add" size={20} color={"black"} />
          </View>
          <Text style={styles.txtMenuItem}>Lời mời kết bạn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate("ListFriend")}
        >
          <View style={styles.iconMenuItem}>
            <Ionicons name="person-add" size={20} color={"black"} />
          </View>
          <Text style={styles.txtMenuItem}>Bạn bè</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CustomMenuContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderWidth: 1,
    borderColor: "white",
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "pink",
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
    paddingHorizontal: 5,
    backgroundColor: "#ffffff",
  },
  menuItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginVertical: 2,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
  },
  txtMenuItem: {
    fontSize: 16,
    color: "black",
  },
  iconMenuItem: {
    width: 30,
    height: 30,
    borderRadius: "30%",
    backgroundColor: "#d0d0d0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
