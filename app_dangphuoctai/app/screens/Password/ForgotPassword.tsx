import { GET_ID } from "@/app/api/APIService";
import { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
} from "react-native";
const ForgotPassword = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const handleVerifyEmail = async () => {
    GET_ID(`otp/forgotPassword/email`, email)
      .then((response) => {
        navigation.navigate("OTPVerify", {
          type: "forgotPassword",
          email: email,
        });
      })
      .catch((error) => {
        if (error.status == 404) {
          alert("Không tìm thấy tài khoản phù hợp với email");
        } else {
          console.log(error.statusText);
        }
      });
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.bgTop}
        source={require("../../../assets/images/img_login.png")}
      />
      <View>
        <Text style={[styles.txt, styles.txt1]}>Quên mật khẩu</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Nhập email của bạn</Text>
          <TextInput
            style={styles.txin}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.methodOrHelp}>
            <View>
              <Text style={styles.method}>Chọn phương pháp khác</Text>
            </View>
            <View>
              <Text style={styles.help}>Cần trợ giúp?</Text>
            </View>
          </View>
        </View>
        <View style={styles.formbtn}>
          <TouchableOpacity style={styles.btnlogin} onPress={handleVerifyEmail}>
            <Text style={styles.txtlogin}>Gửi OTP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;

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
  },
  txt2: {
    fontSize: 20,
    color: "rgb(196,196,196)",
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
