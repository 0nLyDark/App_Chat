import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useApp } from "@/app/context/AppContext";
import { ConversationMember } from "@/components/PersonalChatItem";
import { GET_ID, PUT_EDIT, URL_IMAGE } from "@/app/api/APIService";
import { toast } from "../EditProfile";
import { Ionicons } from "@expo/vector-icons";

const GroupMembers = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { conversationId } = route.params; // Lấy id được truyền vào
  const { userId } = useApp();
  const [listMember, setListMember] = useState<ConversationMember[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    GET_ID(`public/conversations`, conversationId)
      .then((res) => {
        console.log(res.data.conversationMembers);
        setListMember(
          res.data.conversationMembers.filter((item: any) => !item.isOut)
        );
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" color={"white"} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.viewHeaderCenter}>
          <Text style={{ color: "white", fontSize: 20 }}>Thành viên</Text>
        </View>
        <View style={[styles.viewHeader, { alignItems: "flex-start" }]}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddMemberGroup", {
                conversationId: conversationId,
              })
            }
          >
            <Text style={{ color: "#3333ff" }}>Thêm</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={listMember}
        keyExtractor={(item) => item.conversationMemberId.toString()}
        ListHeaderComponent={
          <View style={styles.contentTop}>
            <Text style={styles.txtTitle}>{listMember.length} thành viên</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            android_ripple={{ color: "#444444", borderless: false }}
            style={styles.viewMember}
          >
            <View style={styles.imgMember}>
              <Image
                style={styles.avatar}
                source={{ uri: URL_IMAGE + item.user.avatar }}
              />
            </View>
            <View style={styles.infoMember}>
              <Text style={styles.txtMember}>{item.user.fullName}</Text>
              <Text style={styles.txtRole}>
                {item.role == "LEADER" ? "Trưởng nhóm" : ""}
              </Text>
            </View>
            <View style={styles.borderBtn}>
              {item.user.userId == userId ? (
                <Text style={{ color: "white", fontWeight: "bold" }}>Bạn</Text>
              ) : (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => getChat(item.user.userId)}
                >
                  <Text style={styles.txtBtn}>Nhắn Tin</Text>
                </TouchableOpacity>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default GroupMembers;

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
  txtName: {
    color: "white",
    fontSize: 20,
    fontWeight: "semibold",
    marginTop: 10,
  },
  txtRole: {
    color: "#ACB3BF",
    fontSize: 14,
    fontWeight: "semibold",
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
  viewMember: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  imgMember: {
    width: "15%",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  infoMember: {
    flex: 1,
    paddingLeft: 5,
  },
  txtMember: {
    color: "white",
    fontSize: 16,
    fontWeight: "medium",
  },
  btn: {
    padding: 10,
    paddingVertical: 8,
    backgroundColor: "#80c8ff",
    borderColor: "#dddddd",
    borderWidth: 2,
    borderRadius: 25,
  },
  borderBtn: {
    width: "25%",
    flexDirection: "row",
    justifyContent: "center",
  },
  txtBtn: {
    fontSize: 10,
    color: "white",
  },
});
