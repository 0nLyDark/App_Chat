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

const EditProfile = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <View style={styles.back}>
            <TouchableOpacity
              style={styles.iconheader}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="chevron-back" size={20} color="#70CEF9" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.viewHeaderCenter}>
          <Text style={styles.txtHeader}>Edit Profile</Text>
        </View>
        <View style={[styles.viewHeader, { alignItems: "flex-end" }]}></View>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.info}>
            <View style={{ marginBottom: 40 }}>
              <View style={styles.avatar}>
                <Image
                  resizeMode="cover"
                  source={require("../../assets/images/avatar.png")}
                />
              </View>
              <View style={[styles.iconAdd, styles.avatarAdd]}>
                <Ionicons name="add" size={20} color="#29B6F6" />
              </View>
            </View>
            <View style={styles.contentInfo}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.txtInfo}>Piyush Gupta</Text>
              <Text style={styles.label}>Username</Text>
              <Text style={styles.txtInfo}>Piyushgupta092</Text>
              <Text style={styles.label}>Bio</Text>
              <Text style={styles.txtInfo}>
                Engineer by profession. Talk about...
              </Text>
              <Text style={styles.label}>Tags</Text>
              <Text style={styles.txtInfo}>#bussiness #startup #tech</Text>
              <Text style={styles.label}>Links</Text>
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
                  <Image
                    source={require("../../assets/images/Instagram.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconApp}>
                  <View style={[styles.iconAdd, styles.avatarAdd]}>
                    <Ionicons name="add" size={20} color="#29B6F6" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.btnDone}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.txtDone}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;

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
    // width: "100%",
    // height: "100%",
    width: 125,
    height: 125,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarAdd: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  ortherApp: {
    display: "flex",
    flexDirection: "row",
    columnGap: 4,
    marginTop: 10,
  },
  iconApp: {
    width: 35,
    height: 35,
  },
  iconAdd: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#70CEF9",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "boxSizing",
  },
  contentInfo: {
    width: "100%",
  },
  label: {
    color: "#E2E2E2",
    fontSize: 14,
    fontWeight: "medium",
    fontFamily: "Poppins",
    marginBottom: 4,
  },
  txtInfo: {
    color: "#FEFCFC",
    fontSize: 17,
    fontWeight: "medium",
    fontFamily: "Poppins",
    marginBottom: 4,
  },
  btnDone: {
    width: "100%",
    height: "100%",
    maxWidth: 280,
    maxHeight: 43,
    borderRadius: 25,
    backgroundColor: "#29B6F6",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
    marginTop: 100,
    marginBottom: 50,
  },
  txtDone: {
    color: "#E2E2E2",
    fontSize: 20,
    fontWeight: "medium",
    fontFamily: "Poppins",
  },
});
