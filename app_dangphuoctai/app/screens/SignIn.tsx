import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Button,
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";
import { POST_LOGIN } from "../api/APIService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApp } from "../context/AppContext";
import { toast } from "./EditProfile";
const image = { uri: "assets/images/img_login.png" };

const SignIn = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { listFriendOnline, setUserId } = useApp();
  const handleLogin = async () => {
    const data = {
      username: username,
      password: password,
    };
    const result = await POST_LOGIN(data);
    if (result) {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
      toast("Đăng nhập thành công", "short");
      navigation.navigate("Home");
    }
  };

  return (
    // <ScrollView>
    <View style={styles.container}>
      <Image
        style={styles.bgTop}
        source={require("../../assets/images/img_login.png")}
      />
      <View>
        <Text style={[styles.txt, styles.txt1]}>Chào mừng</Text>
        <Text style={[styles.txt, styles.txt2]}>
          Đăng nhập vào tài khoản của bạn
        </Text>
        <View style={styles.form}>
          <Text style={styles.label}>Tên đăng nhập</Text>
          <TextInput
            style={styles.txin}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.txin}
            placeholder="Password"
            value={password}
            secureTextEntry={true}
            onChangeText={setPassword}
          />
          <Text
            style={styles.fgPass}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            Quên mật khẩu?
          </Text>
        </View>
        <View style={styles.formbtn}>
          <TouchableOpacity style={styles.btnlogin} onPress={handleLogin}>
            <Text style={styles.txtlogin}>Đăng nhập</Text>
          </TouchableOpacity>
          <Text
            style={styles.txtcreate}
            onPress={() => navigation.navigate("SignUp")}
          >
            Bạn chưa có tài khoản?
            <Text style={styles.btncreate}>Tạo ngay bây giờ</Text>
          </Text>
        </View>
        <View style={styles.iconLogin}>
          <TouchableOpacity>
            <Image
              style={styles.iconApp}
              source={require("../../assets/images/icon_google.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.iconApp}
              source={require("../../assets/images/icon_facebook.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.iconApp}
              source={require("../../assets/images/icon_instagram.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    // </ScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingBottom: 30,
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
  iconLogin: {
    width: "100%",
    maxWidth: 200,
    height: "auto",
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  iconApp: {
    width: 30,
    height: 30,
  },
});
