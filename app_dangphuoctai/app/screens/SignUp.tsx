import { useEffect, useState } from "react";
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
import { POST_ADD } from "../api/APIService";
const SignUp = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    const data = {
      username: username,
      password: password,
      email: email,
      fullName: fullName,
    };
    POST_ADD("register", data)
      .then((res) => {
        console.log(res);
        navigation.navigate("OTPVerify", { type: "register", email: email });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Image
          style={styles.bgTop}
          source={require("../../assets/images/img_login.png")}
        />
        <View>
          <Text style={[styles.txt, styles.txt1]}>Đăng ký</Text>
          <Text style={[styles.txt, styles.txt2]}>Tạo một tài khoản mới</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Tên đăng nhập</Text>
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
            <Text style={styles.label}>Fullname</Text>
            <TextInput
              style={styles.txin}
              placeholder="Fullname"
              value={fullName}
              onChangeText={setFullName}
            />
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.txin}
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
            />
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.txin}
              placeholder="Password"
              value={password}
              secureTextEntry={true}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.formbtn}>
            <TouchableOpacity style={styles.btnlogin} onPress={handleRegister}>
              <Text style={styles.txtlogin}>Đăng ký</Text>
            </TouchableOpacity>
            <Text
              style={styles.txtcreate}
              onPress={() => navigation.navigate("SignIn")}
            >
              Đã có tài khoản?{"  "}
              <Text style={styles.btncreate}>Đăng Nhập</Text>
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
