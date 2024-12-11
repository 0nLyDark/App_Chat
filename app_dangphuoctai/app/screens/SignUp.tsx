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
const SignUp = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Image
          style={styles.bgTop}
          source={require("../../assets/images/img_login.png")}
        />
        <View>
          <Text style={[styles.txt, styles.txt1]}>Register</Text>
          <Text style={[styles.txt, styles.txt2]}>Create a new account</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.txin}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.txin}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.label}>Mobie Number</Text>
            <TextInput
              style={styles.txin}
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.txin}
              placeholder="Password"
              value={password}
              secureTextEntry={true}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.formbtn}>
            <TouchableOpacity
              style={styles.btnlogin}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.txtlogin}>Login</Text>
            </TouchableOpacity>
            <Text
              style={styles.txtcreate}
              onPress={() => navigation.navigate("SignIn")}
            >
              Already have account?{"  "}
              <Text style={styles.btncreate}>Login</Text>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    // overflowY: "scroll",
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
  txtcreate: {
    color: "#616161",
    textAlign: "center",
    marginTop: 10,
  },
  btncreate: {
    color: "white",
    paddingLeft: 5,
  },
  scrollView: {},
});
