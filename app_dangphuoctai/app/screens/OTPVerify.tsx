import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useRef, useState } from "react";
import { CodeField, Cursor } from "react-native-confirmation-code-field";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_ID, POST_ADD } from "../api/APIService";

const OTPVerify = ({ route, navigation }: { route: any; navigation: any }) => {
  const [otpEmail, setOtpEmail] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const { type, email } = route.params;

  const getOTPEmail = () => {
    GET_ID("/register/email", email)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // if (type == "register") {
  //   getOTPEmail();
  // }
  const sendOTPEmail = () => {
    const data = {
      email: email,
      codeOTP: otpEmail,
    };
    // navigation.navigate("ResetPassword", {});

    POST_ADD(`otp/verity/${type}`, data)
      .then(async (response) => {
        console.log(response);
        if (response.data["jwt-token"]) {
          await AsyncStorage.setItem("jwt-token", response.data["jwt-token"]);
          if (type == "register") {
            GET_ID("public/users/email", "token")
              .then((data: any) => {
                console.log(data);
                AsyncStorage.setItem("userId", data.userId);
                AsyncStorage.setItem("email", data.email);
                alert("Đăng ký thành công");
                navigation.navigate("Home");
              })
              .catch((error) => {
                alert("Xảy ra lỗi đăng nhập");
                console.log(error);
              });
          } else if (type == "forgotPassword") {
            navigation.navigate("ResetPassword", {});
          }
        }
      })
      .catch((error) => {
        alert("Mã xác thực không hợp lệ!");
        console.log(error);
      });
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.bgTop}
        source={require("../../assets/images/img_login.png")}
      />
      <View>
        <Text style={[styles.txt, styles.txt1]}>Xác minh</Text>
        <Text style={[styles.txt, styles.txt2]}>
          Messenger đã gửi mã để xác minh tài khoản của bạn
        </Text>
        <View style={styles.form}>
          <Text style={styles.label}>Email OTP</Text>
          <View style={styles.otpContainer}>
            <CodeField
              value={otpEmail}
              onChangeText={setOtpEmail}
              cellCount={5}
              rootStyle={styles.otpInput}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  style={[styles.cell, isFocused && styles.focusedCell]}
                >
                  <Text style={styles.text}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
          </View>
          <Text style={styles.label}>Mobile OTP</Text>
          <View style={styles.otpContainer}>
            <CodeField
              value={otpPhone}
              onChangeText={setOtpPhone}
              cellCount={5}
              rootStyle={styles.otpInput}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  style={[styles.cell, isFocused && styles.focusedCell]}
                >
                  <Text style={styles.text}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
        <View style={styles.formbtn}>
          <TouchableOpacity style={styles.btnlogin} onPress={sendOTPEmail}>
            <Text style={styles.txtlogin}>Xác thực</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OTPVerify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Màu nền đen
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
    fontSize: 24,
    marginTop: 5,
  },
  txt2: {
    fontSize: 18,
    color: "rgb(196,196,196)",
    paddingHorizontal: 30,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  // label: {
  //   color: "#fff",
  //   fontSize: 16,
  //   fontWeight: "600",
  //   marginBottom: 10,
  //   alignSelf: "flex-start",
  // },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    textAlign: "center",
    borderRadius: 5,
    marginHorizontal: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  form: {
    width: "100%",
    maxWidth: 350,
    padding: 30,
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
  otpInput: {
    width: "100%",
    height: 40,
    borderRadius: 10,
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 5,
    textAlign: "center",
    marginHorizontal: "auto",
  },
  focusedCell: {
    borderColor: "#007AFF",
  },
  text: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
});
