import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import {
  createDrawerNavigator,
  useDrawerProgress,
} from "@react-navigation/drawer";

import Menu from "@/app/views/homes/Menu";

import { createStaticNavigation } from "@react-navigation/native";
import Chat from "../chats/Chat";
import { Ionicons } from "@expo/vector-icons";
import CustomMenuContent from "./CustomMenuContent";
import FriendRequest from "../friends/FriendRequest";
import ListFriend from "../friends/ListFriend";

const Drawer = createDrawerNavigator();
interface User {
  userId: number;
  isOnline: boolean;
  timeOffline: Date;
}
const Home = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomMenuContent {...props} />}
        screenOptions={{
          drawerStyle: {
            maxWidth: 250,
          },
        }}
      >
        <Drawer.Screen
          name="Chat"
          component={Chat}
          options={{
            headerTitle: "Đoạn Chat", // Tiêu đề header
            headerStyle: {
              backgroundColor: "#000", // Màu nền của header
              borderBottomColor: "none",
            },
            headerTintColor: "#fff", // Màu chữ của header
            headerRight: () => (
              <View style={styles.viewPencil}>
                <Pressable
                  style={styles.pencil}
                  android_ripple={{ color: "#444444", borderless: false }}
                  onPress={() => navigation.navigate("NewGroup")}
                >
                  <Ionicons name="pencil" size={20} color={"white"} />
                </Pressable>
              </View>
              // <Text style={{ color: "#fff", marginRight: 10 }}>Right</Text> // Thêm nút bên phải header
            ),
          }}
        />
        <Drawer.Screen
          name="FriendRequest"
          component={FriendRequest}
          options={{
            headerTitle: "Lời mời kết bạn", // Tiêu đề header
            headerStyle: {
              backgroundColor: "#000", // Màu nền của header
            },
            headerTintColor: "#fff", // Màu chữ của header
          }}
        />
        <Drawer.Screen
          name="ListFriend"
          component={ListFriend}
          options={{
            headerTitle: "Bạn bè", // Tiêu đề header
            headerStyle: {
              backgroundColor: "#000", // Màu nền của header
            },
            headerTintColor: "#fff", // Màu chữ của header
          }}
        />
      </Drawer.Navigator>
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

  // Menu
  menuToggle: {
    color: "#fff",
    fontSize: 22,
  },
  sideMenu: {
    maxWidth: 300,
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: "white",
    zIndex: 10,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 5,
  },

  styleMenu: {
    width: "100%",
    maxWidth: 300,
    height: "100%",
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
  viewPencil: {
    width: 32,
    height: 32,
    borderRadius: 50,
    overflow: "hidden",
    marginRight: 15,
  },
  pencil: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#707070",
    borderRadius: 50,
  },
});
