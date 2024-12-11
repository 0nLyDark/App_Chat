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

  return (
    <View style={styles.container}>
      <Image
        style={styles.bgTop}
        source={require("../../assets/images/img_login.png")}
      />
      <View>
        <Text style={[styles.txt, styles.txt1]}>Forgot Password</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Enter your email</Text>
          <TextInput
            style={styles.txin}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.methodOrHelp}>
            <View>
              <Text style={styles.method}>Choose Another Method</Text>
            </View>
            <View>
              <Text style={styles.help}>Need Help?</Text>
            </View>
          </View>
        </View>
        <View style={styles.formbtn}>
          <TouchableOpacity
            style={styles.btnlogin}
            onPress={() => navigation.navigate("OTPVerify")}
          >
            <Text style={styles.txtlogin}>Send OTP</Text>
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
