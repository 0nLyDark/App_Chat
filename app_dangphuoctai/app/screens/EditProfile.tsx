import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Modal,
  Button,
  TouchableWithoutFeedback,
  Platform,
  ToastAndroid,
  Alert,
  TextInput,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { GET_ID, PUT_EDIT, PUT_IMG, URL_IMAGE } from "../api/APIService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useApp } from "../context/AppContext";

export const toast = (text: string, type: string) => {
  if (Platform.OS === "android") {
    if (type == "long") {
      ToastAndroid.show(text, ToastAndroid.LONG);
    } else {
      ToastAndroid.show(text, ToastAndroid.SHORT);
    }
  } else {
    Alert.alert("Thông báo", text);
  }
};

const EditProfile = ({ navigation }: { navigation: any }) => {
  const { userId } = useApp();
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [typeEdit, setTypeEdit] = useState("");
  const [updateName, setUpdateName] = useState("");
  useEffect(() => {
    if (userId) {
      GET_ID("public/users", userId)
        .then((response) => {
          setAvatar(response.data.avatar);
          setFullName(response.data.fullName);
          setSelectedImage(URL_IMAGE + response.data.avatar);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  useEffect(() => {
    setUpdateName(fullName);
  }, [fullName]);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  const saveImage = async () => {
    if (selectedImage) {
      try {
        const formData = new FormData();
        const res = await fetch(selectedImage);
        const blob = await res.blob();
        const fileType = blob.type || "image/png";
        if (Platform.OS === "android") {
          formData.append("image", {
            uri: selectedImage, // 📌 Đường dẫn ảnh (file:// hoặc content:// trên Android)
            name: "avatar.png", // 📌 Tên file
            type: fileType, // 📌 Kiểu file
          } as any);
        } else {
          formData.append("image", blob, "avatar.png");
        }
        console.log(formData);
        PUT_IMG("public/users/avatar", formData)
          .then((response) => {
            setAvatar(response.data.avatar);
            setSelectedImage(URL_IMAGE + response.data.avatar);
            setIsOn(false);
            toast("Cập nhật hình ảnh thành công", "short");
          })
          .catch((error) => {
            console.log(error);
            toast("Cập nhật hình ảnh thất bại", "long");
          });
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    } else {
      toast("Bạn chưa chọn hình ảnh", "long");
    }
  };
  const saveName = async () => {
    if (updateName.trim().length != 0) {
      const data = {
        userId: userId,
        fullName: updateName,
      };
      PUT_EDIT("public/users/fullName", data)
        .then((response) => {
          setFullName(updateName);
          setIsOn(false);
          toast("Cập nhật tên thành công", "short");
        })
        .catch((error) => {
          toast("Cập nhật tên thất bại", "long");
          console.log(error);
        });
    } else {
      toast("Bạn chưa nhập tên!", "long");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <View style={styles.back}>
            <TouchableOpacity
              style={styles.iconheader}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="chevron-back" size={20} color="#70CEF9" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.viewHeaderCenter}>
          <Text style={styles.txtHeader}>Sửa hồ sơ</Text>
        </View>
        <View style={[styles.viewHeader, { alignItems: "flex-end" }]}></View>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.info}>
            <View style={{ width: 125, height: 125, marginBottom: 40 }}>
              <View style={styles.avatar}>
                <Image
                  style={styles.imgAvatar}
                  source={{ uri: URL_IMAGE + avatar }}
                />
              </View>
              <TouchableOpacity
                style={[styles.iconAdd, styles.avatarAdd]}
                onPress={() => {
                  setIsOn(true);
                  setTypeEdit("image");
                }}
              >
                <Ionicons name="add" size={20} color="#29B6F6" />
              </TouchableOpacity>
            </View>
            <View style={styles.contentInfo}>
              <Text style={styles.label}>Tên</Text>
              <TouchableHighlight
                onPress={() => {
                  setIsOn(true);
                  setTypeEdit("name");
                }}
              >
                <Text style={styles.txtInfo}>{fullName}</Text>
              </TouchableHighlight>
              <Text style={styles.label}>Tên đăng nhập</Text>
              <Text style={styles.txtInfo}>Piyushgupta092</Text>
              <Text style={styles.label}>Tiểu sử</Text>
              <Text style={styles.txtInfo}>
                Kỹ sư theo nghề nghiệp. Nói về Nói về Kinh doanh, Công nghệ .Tôi
                là cú đêm 🦉
              </Text>
              <Text style={styles.label}>Tags</Text>
              <Text style={styles.txtInfo}>#bussiness #startup #tech</Text>
              <Text style={styles.label}>Links</Text>
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
                  <Image
                    source={require("../../assets/images/Instagram.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconApp}>
                  <View style={[styles.iconAdd, styles.avatarAdd]}>
                    <Ionicons name="add" size={20} color="#29B6F6" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.btnDone}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.txtDone}>Xong</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal transparent={true} animationType="none" visible={isOn}>
        <TouchableWithoutFeedback onPress={() => setIsOn(false)}>
          <View style={styles.menuEdit}>
            {typeEdit == "image" && (
              <View>
                {selectedImage && (
                  <Image
                    style={[
                      styles.imgAvatar,
                      { width: 200, height: 200, marginBottom: 25 },
                    ]}
                    source={{ uri: selectedImage }}
                  />
                )}
                <Button title="Chọn ảnh từ thư viện" onPress={pickImage} />
                <View style={styles.btnSave}>
                  <Button title="Lưu ảnh" onPress={saveImage} />
                </View>
              </View>
            )}
            {typeEdit == "name" && (
              <View>
                <Pressable onPress={() => {}}>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={(text) => setUpdateName(text)}
                    value={updateName}
                    placeholder="Tên"
                  />
                </Pressable>
                <View style={styles.btnSave}>
                  <Button title="Lưu Tên" onPress={saveName} />
                </View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default EditProfile;

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
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  info: {
    width: "100%",
    maxWidth: 325,
    alignItems: "center",
    marginHorizontal: "auto",
  },
  avatar: {
    width: "100%",
    height: "100%",
    maxWidth: 125,
    maxHeight: 125,
    alignItems: "center",
    justifyContent: "center",
  },
  imgAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 1000,
    borderWidth: 5,
    borderColor: "pink",
  },
  avatarAdd: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  ortherApp: {
    display: "flex",
    flexDirection: "row",
    columnGap: 4,
    marginTop: 10,
  },
  iconApp: {
    width: 35,
    height: 35,
  },
  iconAdd: {
    width: 24,
    height: 24,
    borderRadius: 50,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#70CEF9",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "boxSizing",
  },
  contentInfo: {
    width: "100%",
  },
  label: {
    color: "#E2E2E2",
    fontSize: 14,
    fontWeight: "medium",
    fontFamily: "Poppins",
    marginBottom: 4,
  },
  txtInfo: {
    color: "#FEFCFC",
    fontSize: 17,
    fontWeight: "medium",
    fontFamily: "Poppins",
    marginBottom: 4,
  },
  btnDone: {
    width: "100%",
    height: "100%",
    maxWidth: 280,
    maxHeight: 43,
    borderRadius: 25,
    backgroundColor: "#29B6F6",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
    marginTop: 100,
    marginBottom: 50,
  },
  txtDone: {
    color: "#E2E2E2",
    fontSize: 20,
    fontWeight: "medium",
    fontFamily: "Poppins",
  },
  menuEdit: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Làm mờ nền
  },
  btnSave: {
    marginTop: 50,
  },
  inputText: {
    width: 250,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
