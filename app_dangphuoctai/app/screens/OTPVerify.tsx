import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useRef } from "react";

const OTPVerify = ({ navigation }: { navigation: any }) => {
  const emailOtpRefs = useRef([]);
  const mobileOtpRefs = useRef([]);

  const handleInputChange = (
    text: string | any[],
    index: number,
    refs: any[]
  ) => {
    if (text.length === 0 && refs.length > index && index > 0) {
      // Focus vào ô tiếp theo
      refs[index - 1].focus();
    }
    if (text.length === 1 && index < refs.length - 1) {
      // Focus vào ô tiếp theo
      refs[index + 1].focus();
    }
  };

  const renderOTPInput = (refs: any[]) => {
    return (
      <View style={styles.otpContainer}>
        {[...Array(5)].map((_, index) => (
          <TextInput
            key={index}
            style={styles.input}
            maxLength={1}
            keyboardType="number-pad"
            onChangeText={(text) => handleInputChange(text, index, refs)}
            ref={(el) => (refs[index] = el)} // Gắn ref cho từng ô
          />
        ))}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.bgTop}
        source={require("../../assets/images/img_login.png")}
      />
      <View>
        <Text style={[styles.txt, styles.txt1]}>Verification</Text>
        <Text style={[styles.txt, styles.txt2]}>
          Messenger has send a code to verify your account
        </Text>
        <View style={styles.form}>
          <Text style={styles.label}>Email OTP</Text>
          {renderOTPInput(emailOtpRefs.current)}

          <Text style={styles.label}>Mobile OTP</Text>
          {renderOTPInput(mobileOtpRefs.current)}
        </View>
        <View style={styles.formbtn}>
          <TouchableOpacity
            style={styles.btnlogin}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.txtlogin}>Verify</Text>
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
});
