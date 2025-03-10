import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { GET_ID, URL_IMAGE } from "@/app/api/APIService";

const InfoContact = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const { userId } = route.params; // Lấy id được truyền vào
  useEffect(() => {
    GET_ID(`public/users`, userId).then((response) => {
      setFullName(response.data.fullName);
      setAvatar(response.data.avatar);
    });
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" color={"white"} size={20} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={styles.content}>
        <ScrollView>
          <View style={styles.borderAvatar}>
            <TouchableOpacity>
              <Image
                style={styles.avatar}
                source={{ uri: URL_IMAGE + avatar }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.txtName}>{fullName}</Text>
          </View>
          <View style={styles.borderBtn}>
            <View style={styles.viewBtn}>
              <TouchableOpacity style={styles.btnMain}>
                <Ionicons
                  name="call"
                  size={18}
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
                  size={18}
                  style={styles.iconMain}
                  color={"white"}
                />
              </TouchableOpacity>
              <Text style={styles.txtBtn}>Gọi video</Text>
            </View>
            <View style={styles.viewBtn}>
              <TouchableOpacity style={styles.btnMain}>
                <Ionicons
                  name="person"
                  size={18}
                  style={styles.iconMain}
                  color={"white"}
                />
              </TouchableOpacity>
              <Text style={styles.txtBtn}>Trang cá nhân</Text>
            </View>
            <View style={styles.viewBtn}>
              <TouchableOpacity style={styles.btnMain}>
                <Ionicons
                  name="notifications"
                  size={18}
                  style={styles.iconMain}
                  color={"white"}
                />
              </TouchableOpacity>
              <Text style={styles.txtBtn}>Tắt Thông báo</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default InfoContact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    height: 60,
    flexDirection: "row",
    borderBottomWidth: 0.2,
    borderColor: "#555555",
  },
  viewHeader: {
    width: "15%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  borderAvatar: {
    width: "auto",
    marginHorizontal: "auto",
    marginVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "pink",
  },
  txtName: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    marginBottom: 15,
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
    justifyContent: "center",
  },
  iconMain: {
    width: 18,
    height: 18,
    margin: "auto",
  },
  btnMain: {
    width: 30,
    height: 30,
    backgroundColor: "#b5b5b5",
    borderRadius: 50,
  },
  txtBtn: {
    fontSize: 10,
    color: "white",
  },
});
