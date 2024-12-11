import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TouchableNativeFeedback,
  TouchableHighlight,
} from "react-native";
import React, { useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";

const Profile = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <View style={styles.back}>
            <TouchableOpacity
              style={styles.iconheader}
              onPress={() => navigation.navigate("Setting")}
            >
              <Ionicons name="chevron-back" size={20} color="#70CEF9" />
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/images/icon_settings.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.viewHeaderCenter}>
          <Text style={styles.txtHeader}>Profile</Text>
        </View>
        <View style={[styles.viewHeader, { alignItems: "flex-end" }]}>
          <TouchableOpacity
            style={styles.iconheader}
            onPress={() => navigation.navigate("Home")}
          >
            <Image
              style={{ width: 21, height: 20 }}
              source={require("../../assets/images/icon_home.png")}
            />
            <Ionicons name="chevron-forward" size={20} color="#70CEF9" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.info}>
            <View style={styles.avatar}>
              <Image source={require("../../assets/images/avatar.png")} />
            </View>
            <Text style={styles.fullname}>Piyush Gupta</Text>
            <Text style={styles.name}>piyushgupta092</Text>
            <View></View>
            <ImageBackground
              source={require("../../assets/images/bg_profile.png")}
              resizeMode="cover"
              style={styles.bgstory}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.story}>
                <Text style={styles.txtstory}>Engineer by profession</Text>
                <Text style={styles.txtstory}>Talk about Bussiness, Tech</Text>
                <Text style={styles.txtstory}>I’m a nightowl 🦉</Text>
              </View>
            </ImageBackground>
            <View style={styles.ortherApp}>
              <TouchableOpacity style={styles.iconApp}>
                <Image source={require("../../assets/images/Facebook.png")} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconApp}>
                <Image source={require("../../assets/images/Telegram.png")} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconApp}>
                <Image source={require("../../assets/images/Twitter.png")} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconApp}>
                <Image source={require("../../assets/images/Instagram.png")} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.btnEdit}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={styles.txtEdit}>Edit Profile</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
              <TouchableOpacity>
                <Text style={styles.txtfooter}>Inbox cleaner</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.txtfooter}>Manage Blocking</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.txtfooter}>Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.txtfooter}>Share profile</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.txtfooter}>Invite friends</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAdd}>
                <View style={styles.iconAdd}>
                  <Ionicons name="add" size={22} color="#29B6F6" />
                </View>
                <Text style={[styles.txtfooter, { marginBottom: 0 }]}>
                  Add Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.btnLogout}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.txtLogout}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;

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
    backgroundColor: "#171717",
  },
  viewHeader: {
    width: "15%",
    justifyContent: "center",
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
    fontSize: 22,
    fontWeight: "regular",
    fontFamily: "VarelaRound",
  },
  back: {
    // alignItems: "center",
    // justifyContent: "center",
  },
  iconheader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  txt: {
    color: "white",
    fontSize: 16,
    fontWeight: "medium",
    fontFamily: "Poppins",
  },
  content: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  info: {
    width: "100%",
    maxWidth: 325,
    alignItems: "center",
    marginHorizontal: "auto",
  },
  avatar: {
    width: "100%",
    height: "100%",
    maxWidth: 125,
    maxHeight: 125,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  fullname: {
    color: "white",
    fontSize: 20,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
  },
  name: {
    color: "#E2E2E2",
    fontSize: 12,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
  },
  bgstory: {
    width: "100%",
    maxWidth: 325,
    height: 115,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  story: {
    width: "100%",
    maxWidth: 300,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
  },
  txtstory: {
    color: "white",
    fontSize: 14,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
    marginBottom: 4,
  },
  ortherApp: {
    display: "flex",
    flexDirection: "row",
    columnGap: 4,
  },
  iconApp: {
    width: 35,
    height: 35,
  },
  btnEdit: {
    width: "100%",
    maxWidth: 280,
    height: 48,
    backgroundColor: "#29B6F6",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  txtEdit: {
    color: "white",
    fontSize: 20,
    fontWeight: "medium",
    fontFamily: "Poppins",
  },
  footer: {
    width: "100%",
    height: "auto",
    maxWidth: 325,
    marginTop: 20,
    marginHorizontal: "auto",
    padding: 10,
  },
  txtfooter: {
    color: "#E2E2E2",
    fontSize: 18,
    fontWeight: "medium",
    fontFamily: "Poppins",
    marginBottom: 5,
  },
  iconAdd: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "#70CEF9",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "boxSizing",
  },
  btnAdd: {
    display: "flex",
    flexDirection: "row",
    columnGap: 8,
    alignItems: "center",
  },
  btnLogout: {
    width: "100%",
    height: "100%",
    maxHeight: 43,
    backgroundColor: "#EA4335",
    borderTopLeftRadius: 50, // Bo góc bên trái
    borderTopRightRadius: 50, // Bo góc bên phải
    borderBottomLeftRadius: 0, // Không bo góc ở đáy
    borderBottomRightRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
    marginHorizontal: "auto",
  },
  txtLogout: {
    color: "#E2E2E2",
    fontSize: 18,
    fontWeight: "medium",
    fontFamily: "Poppins",
  },
});
