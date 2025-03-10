import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState } from "react";
import { POST_ADD } from "@/app/api/APIService";

const ResetPassword = ({ navigation }: { navigation: any }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = () => {
    if (password != confirmPassword) {
      alert("Mật khẩu không trùng khớp");
      return;
    }
    const data = {
      userId: 0,
      password: password,
    };
    POST_ADD("public/users/resetPassword", data)
      .then((response) => {
        console.log(response);
        alert("Đổi mật khẩu mới thành công.");
        navigation.navigate("SignIn");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.bgTop}
        source={require("../../../assets/images/img_login.png")}
      />
      <View>
        <Text style={[styles.txt, styles.txt1]}>Đặt mật khẩu mới</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Nhập mật khẩu mới:</Text>
          <TextInput
            style={styles.txin}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Xác nhận mật khẩu:</Text>
          <TextInput
            style={styles.txin}
            placeholder="Xác nhận Mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.formbtn}>
          <TouchableOpacity
            style={styles.btnlogin}
            onPress={handleResetPassword}
          >
            <Text style={styles.txtlogin}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    overflowY: "scroll",
    paddingBottom: 50,
  },
  bgTop: {
    height: 150,
    width: "100%",
  },
  txt: {
    color: "white",
    textAlign: "center",
  },
  txt1: {
    fontSize: 28,
    marginTop: 5,
    marginBottom: 15,
  },
  txt2: {
    fontSize: 20,
    color: "rgb(196,196,196)",
  },
  form: {
    width: "100%",
    maxWidth: 350,
    paddingBottom: 15,
    paddingHorizontal: 30,
    margin: "auto",
  },
  formbtn: {
    width: "100%",
    maxWidth: 350,
    paddingHorizontal: 30,
    margin: "auto",
  },
  label: {
    fontSize: 18,
    color: "white",
    marginBottom: 6,
  },
  txin: {
    width: "100%",
    maxWidth: 315,
    height: 48,
    borderRadius: 6,
    backgroundColor: "#FEFCFC",
    marginBottom: 6,
    paddingLeft: 15,
  },
  fgPass: {
    textAlign: "right",
    color: "#EA4335",
  },
  btnlogin: {
    width: "100%",
    maxWidth: 295,
    height: 48,
    backgroundColor: "#29B6F6",
    borderRadius: 22,
    margin: "auto",
  },
  txtlogin: {
    fontSize: 18,
    color: "white",
    margin: "auto",
    textAlign: "center",
  },
  method: {
    color: "#616161",
  },
  help: {
    color: "white",
  },
  methodOrHelp: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});
