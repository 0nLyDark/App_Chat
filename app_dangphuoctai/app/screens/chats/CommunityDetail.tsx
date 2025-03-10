import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  Button,
  TextInput,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { GET_ID, PUT_EDIT, PUT_IMG, URL_IMAGE } from "@/app/api/APIService";
import { ConversationMember, limitString } from "@/components/PersonalChatItem";
import { toast } from "../EditProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useApp } from "@/app/context/AppContext";

const CommunityDetail = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { conversationId } = route.params; // Lấy id được truyền vào
  const { userId } = useApp();
  const [conversationName, setConversationName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [listMember, setListMember] = useState<ConversationMember[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [typeEdit, setTypeEdit] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    GET_ID(`public/conversations`, conversationId)
      .then((res) => {
        setAvatar(res.data.avatar ? res.data.avatar : "default.png");
        setListMember(res.data.conversationMembers);
        if (res.data.conversationName == null) {
          let result = res.data.conversationMembers
            .filter((member: any) => !member.isOut)
            .map((member: { user: { fullName: string } }) => {
              return member.user.fullName;
            });
          result = result.join(",");
          setConversationName(result);
        } else {
          setConversationName(res.data.conversationName);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [conversationId, userId]);
  const getChat = (friendId: number) => {
    GET_ID(`public/conversations/user/${userId}/friend`, friendId)
      .then((res) => {
        navigation.navigate("PersonalChat", {
          conversationId: res.data.conversationId,
        });
      })
      .catch((error) => {
        toast("Không thể nhắn tin với người này", "long");
        console.log(error);
      });
  };
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
        PUT_IMG(`public/conversations/${conversationId}/avatar`, formData)
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
        conversationId: conversationId,
        conversationName: updateName,
      };
      PUT_EDIT(`public/conversations/${conversationId}/conversationName`, data)
        .then((response) => {
          console.log(response);
          setConversationName(updateName);
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
  const handleOutGroup = () => {
    PUT_EDIT(`public/conversations/${conversationId}/conversationMembers`, {})
      .then((res) => {
        toast("Rời nhóm thành công", "short");
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
        toast("Đã xảy ra lỗi!", "long");
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" color={"white"} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.viewHeaderCenter}></View>
        <View style={styles.viewHeader}>
          <TouchableOpacity
          // onPress={() => navigation.navigate("Setting")}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View style={styles.viewInfo}>
          <TouchableOpacity
            onPress={() => {
              setIsOn(true);
              setTypeEdit("image");
            }}
          >
            <Image
              style={styles.imgProfile}
              source={{ uri: URL_IMAGE + avatar }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsOn(true);
              setTypeEdit("name");
            }}
          >
            <Text style={styles.txtName}>
              {limitString(conversationName, 22)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.borderBtn}>
          <View style={styles.viewBtn}>
            <TouchableOpacity style={styles.btnMain}>
              <Ionicons
                name="call"
                size={16}
                style={styles.iconMain}
                color={"white"}
              />
            </TouchableOpacity>
            <Text style={styles.txtBtn}>Gọi thoại</Text>
          </View>
          <View style={styles.viewBtn}>
            <TouchableOpacity style={styles.btnMain}>
              <Ionicons
                name="videocam"
                size={16}
                style={styles.iconMain}
                color={"white"}
              />
            </TouchableOpacity>
            <Text style={styles.txtBtn}>Gọi video</Text>
          </View>
          <View style={styles.viewBtn}>
            <TouchableOpacity
              style={styles.btnMain}
              onPress={() =>
                navigation.navigate("AddMemberGroup", {
                  conversationId: conversationId,
                })
              }
            >
              <Ionicons
                name="person-add"
                size={16}
                style={styles.iconMain}
                color={"white"}
              />
            </TouchableOpacity>
            <Text style={styles.txtBtn}>Thêm</Text>
          </View>
          <View style={styles.viewBtn}>
            <TouchableOpacity style={styles.btnMain}>
              <Ionicons
                name="notifications"
                size={16}
                style={styles.iconMain}
                color={"white"}
              />
            </TouchableOpacity>
            <Text style={styles.txtBtn}>Tắt Thông báo</Text>
          </View>
        </View>
        <View style={{ paddingTop: 10 }}>
          <Pressable
            android_ripple={{ color: "#444444", borderless: false }}
            style={styles.btnFeature}
            onPress={() =>
              navigation.navigate("GroupMembers", {
                conversationId: conversationId,
              })
            }
          >
            <View style={styles.iconFeature}>
              <Ionicons name="people" size={24} color={"white"} />
            </View>
            <View style={styles.viewTextFeature}>
              <Text style={styles.textFeature}>Xem thành viên</Text>
            </View>
          </Pressable>
          <Pressable
            android_ripple={{ color: "#444444", borderless: false }}
            style={styles.btnFeature}
          >
            <View style={styles.iconFeature}>
              <Ionicons name="image-outline" size={24} color={"white"} />
            </View>
            <View style={styles.viewTextFeature}>
              <Text style={styles.textFeature}>
                Xem file phương tiện, file và liên kết
              </Text>
            </View>
          </Pressable>
          <Pressable
            android_ripple={{ color: "#444444", borderless: false }}
            style={styles.btnFeature}
          >
            <View style={styles.iconFeature}>
              <Ionicons name="search" size={24} color={"white"} />
            </View>
            <View style={styles.viewTextFeature}>
              <Text style={styles.textFeature}>
                Tìm kiếm trong cuộc trò chuyện
              </Text>
            </View>
          </Pressable>
          <Pressable
            android_ripple={{ color: "#444444", borderless: false }}
            style={styles.btnFeature}
            onPress={handleOutGroup}
          >
            <View style={styles.iconFeature}>
              <Ionicons name="exit-outline" size={24} color={"#ff3030"} />
            </View>
            <View style={styles.viewTextFeature}>
              <Text style={[styles.textFeature, { color: "#ff3030" }]}>
                Rời khỏi đoạn chat
              </Text>
            </View>
          </Pressable>
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

export default CommunityDetail;

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
    backgroundColor: "#171717",
  },
  viewHeader: {
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  viewHeaderCenter: {
    width: "70%",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  content: {
    minHeight: "100%",
    paddingBottom: 55,
    maxWidth: 425,
    marginHorizontal: "auto",
  },
  viewInfo: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  imgProfile: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  txtName: {
    color: "white",
    fontSize: 20,
    fontWeight: "semibold",
    marginTop: 10,
  },
  status: {
    display: "flex",
    flexDirection: "row",
    columnGap: 5,
    alignItems: "center",
  },
  txtStatus: {
    color: "#ACB3BF",
    fontSize: 12,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
  },
  btnIcon: {
    width: 35,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  contentTop: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  flexSpace: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  txtTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "medium",
    fontFamily: "Poppins",
    marginVertical: 5,
  },
  txt: {
    color: "#ACB3BF",
    fontSize: 12,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
  },
  Participants: {},
  member: {
    margin: 5,
    width: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imgMember: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  txtMember: {
    color: "white",
    fontSize: 16,
    fontWeight: "medium",
    fontFamily: "OpenSans",
    marginLeft: 10,
  },
  btn: {
    padding: 10,
    paddingVertical: 8,
    backgroundColor: "#80c8ff",
    borderColor: "#dddddd",
    borderWidth: 2,
    borderRadius: 25,
  },
  imgAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 1000,
    borderWidth: 5,
    borderColor: "pink",
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
  borderBtn: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 25,
    // justifyContent: "space-between",
  },
  viewBtn: {
    width: "25%",
    alignItems: "center",
  },
  iconMain: {
    width: 16,
    height: 16,
  },
  btnMain: {
    width: 30,
    height: 30,
    backgroundColor: "#b5b5b5",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  txtBtn: {
    fontSize: 10,
    color: "white",
  },
  btnFeature: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  iconFeature: {
    width: "12%",
    height: 50,
    justifyContent: "center",
  },
  viewTextFeature: {
    width: "88%",
    height: 50,
    justifyContent: "center",
  },
  textFeature: {
    fontSize: 16,
    color: "white",
  },
});
