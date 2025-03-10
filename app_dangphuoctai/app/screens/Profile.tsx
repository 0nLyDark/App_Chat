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
import React, { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_ID, URL_IMAGE } from "../api/APIService";
import { useApp } from "../context/AppContext";

const Profile = ({ navigation }: { navigation: any }) => {
  const { listFriendOnline, disconnect, setUserId, setListFriendOnline } =
    useApp();
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  useEffect(() => {
    const fetchUserIdAndData = async () => {
      const userId = (await AsyncStorage.getItem("userId")) ?? 0;
      GET_ID("public/users", userId)
        .then((response) => {
          setAvatar(response.data.avatar);
          setFullName(response.data.fullName);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchUserIdAndData();
  }, []);
  const Logout = () => {
    disconnect();
    setUserId(null);
    AsyncStorage.removeItem("jwt-token");
    navigation.navigate("SignIn");
  };
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
          <Text style={styles.txtHeader}>Hồ sơ</Text>
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
      <ScrollView style={styles.content}>
        {/* <View style={styles.info}> */}
        <View style={styles.avatar}>
          <Image
            style={styles.imgAvatar}
            source={{ uri: URL_IMAGE + avatar }}
          />
        </View>
        <Text style={styles.fullname}>{fullName}</Text>
        <Text style={styles.name}>piyushgupta092</Text>
        <View></View>
        <ImageBackground
          source={require("../../assets/images/bg_profile.png")}
          resizeMode="cover"
          style={styles.bgstory}
          imageStyle={{ borderRadius: 10 }}
        >
          <View style={styles.story}>
            <Text style={styles.txtstory}>Kỹ sư theo nghề nghiệp</Text>
            <Text style={styles.txtstory}>Nói về Kinh doanh, Công nghệ</Text>
            <Text style={styles.txtstory}>Tôi là cú đêm 🦉</Text>
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
          <Text style={styles.txtEdit}>Sửa hồ sơ</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={styles.txtfooter}>Trình dọn dẹp hộp thư đến</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.txtfooter}>Quản lý chặn</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.txtfooter}>Thông báo</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.txtfooter}>Chia sẻ hồ sơ</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.txtfooter}>Mời bạn bè</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAdd}>
            <View style={styles.iconAdd}>
              <Ionicons name="add" size={22} color="#29B6F6" />
            </View>
            <Text style={[styles.txtfooter, { marginBottom: 0 }]}>
              Thêm tài khoản
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btnLogout} onPress={Logout}>
          <Text style={styles.txtLogout}>Đăng xuất</Text>
        </TouchableOpacity>
        {/* </View> */}
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
  },
  info: {
    maxWidth: 325,
    alignItems: "center",
    marginHorizontal: "auto",
  },
  avatar: {
    width: "100%",
    height: "100%",
    maxWidth: 175,
    maxHeight: 175,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "auto",
  },
  imgAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: "pink",
  },
  fullname: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  name: {
    color: "#E2E2E2",
    fontSize: 12,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
    textAlign: "center",
  },
  bgstory: {
    flex: 1,
    maxWidth: 325,
    borderRadius: 10,
    marginVertical: 15,
    padding: 10,
    marginHorizontal: "auto",
    borderWidth: 1,
    borderColor: "pink",
  },
  story: {
    width: "100%",
    height: "100%",
    maxWidth: 275,
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
    marginHorizontal: "auto",
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
    marginHorizontal: "auto",
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
    maxWidth: 200,
    maxHeight: 43,
    backgroundColor: "#EA4335",
    borderRadius: 50,
    // borderTopLeftRadius: 50, // Bo góc bên trái
    // borderTopRightRadius: 50, // Bo góc bên phải
    // borderBottomLeftRadius: 0, // Không bo góc ở đáy
    // borderBottomRightRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
    marginBottom: 50,
    marginHorizontal: "auto",
  },
  txtLogout: {
    color: "#E2E2E2",
    fontSize: 18,
    fontWeight: "medium",
    fontFamily: "Poppins",
  },
});
