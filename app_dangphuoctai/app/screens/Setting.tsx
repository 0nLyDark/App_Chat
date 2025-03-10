import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";

const Setting = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <View style={styles.close}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Ionicons
                name="close-circle"
                size={25}
                color="white"
                //   style={styles.iconClose}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.viewHeaderCenter}>
          <Text style={styles.txtHeader}>Cài đặt</Text>
        </View>
        <View style={[styles.viewHeader]}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="chevron-forward" size={20} color="#70CEF9" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity>
          <Text style={styles.txt}>Thông tin tài khoản
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.txt}>Thông tin cá nhân
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.txt}>Quản lý tài khoản
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.txt}>Quyền riêng tư & Dữ liệu</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.txt}>Bảo mật và đăng nhập
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.txt}>Hỗ trợ</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.txt}>Nhận trợ giúp
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.txt}>Điều khoản & Chính sách
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <Text style={styles.txt}>About</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Setting;

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
    fontSize: 22,
    fontWeight: "regular",
    fontFamily: "VarelaRound",
  },
  close: {
    width: 25,
    height: 25,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  txt: {
    color: "white",
    fontSize: 16,
    fontWeight: "medium",
    fontFamily: "Poppins",
  },
});
