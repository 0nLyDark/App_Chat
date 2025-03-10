import { GET_PAGE, POST_ADD, PUT_EDIT, URL_IMAGE } from "@/app/api/APIService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  ToastAndroid,
} from "react-native";
import { toast } from "../EditProfile";
import { useApp } from "@/app/context/AppContext";
interface User {
  userId: number;
  fullName: string;
  avatar: string;
  typeContact: string;
}

const AddMemberGroup = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { conversationId } = route.params;
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ListFriend, setListFriend] = useState<User[]>([]);
  const [keyword, setKeyword] = useState("");
  const [conversationName, setConversationName] = useState("");
  const [listMemberId, setListMemberId] = useState<number[]>([]);
  const { userId } = useApp();
  useEffect(() => {
    if (loading) return;
    console.log(keyword);
    setLoading(true);
    GET_PAGE(
      `public/myFriend/conversation/${conversationId}/keyword/` +
        keyword.trim(),
      0,
      pageSize
    )
      .then((res) => {
        setPageNumber(1);
        setListFriend(res.data.content);
        setLastPage(res.data.lastPage);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  }, [keyword]);
  const handleLoadMyFriend = () => {
    if (loading || lastPage) return;
    setLoading(true);
    GET_PAGE(
      `public/myFriend/conversation/${conversationId}/keyword/` +
        keyword.trim(),
      pageNumber + 1,
      pageSize
    )
      .then((res) => {
        setPageNumber(pageNumber + 1);
        setListFriend((prevListFriend) => [
          ...prevListFriend,
          ...res.data.content,
        ]);
        setLastPage(res.data.lastPage);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  const handleSelectMember = (friendId: number) => {
    setListMemberId((prevList) => {
      if (prevList.includes(friendId)) {
        return prevList.filter((id) => id !== friendId);
      } else {
        return [...prevList, friendId];
      }
    });
  };
  const handleAddMember = () => {
    POST_ADD(
      `public/conversations/${conversationId}/conversationMembers`,
      listMemberId
    )
      .then((res) => {
        toast("Thêm thành viên thành công", "short");
        navigation.goBack();
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <View style={styles.back}>
            <TouchableOpacity
              style={styles.iconheader}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.viewHeaderCenter}>
          <Text style={styles.txtHeader}>Thêm thành viên</Text>
        </View>
        <View style={[styles.viewHeader]}>
          {listMemberId.length < 1 ? (
            <View style={styles.iconheader}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "#cccccc" }}
              >
                Thêm
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.iconheader}
              onPress={handleAddMember}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Thêm</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TextInput
        style={styles.search}
        placeholder="Tìm kiếm"
        value={keyword}
        onChangeText={(text) => setKeyword(text)}
      />
      <FlatList
        data={ListFriend}
        keyExtractor={(item) => item.userId.toString()}
        onEndReached={handleLoadMyFriend}
        renderItem={({ item }) => (
          <Pressable
            android_ripple={{ color: "#dddddd", borderless: false }}
            style={styles.item}
            onPress={() => handleSelectMember(item.userId)}
          >
            <Image
              source={{ uri: URL_IMAGE + item.avatar }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{item.fullName}</Text>
            {listMemberId.includes(item.userId) ? (
              <Ionicons name="checkmark-circle" size={22} color="blue" />
            ) : (
              <View style={styles.radioButton} />
            )}
          </Pressable>
        )}
      />
    </View>
  );
};

export default AddMemberGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    marginBottom: 10,
  },
  search: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  radioButton: {
    width: 23,
    height: 23,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    // backgroundColor: "#ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    width: "100%",
    height: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewHeader: {
    width: "15%",
    justifyContent: "center",
    position: "relative",
  },
  viewHeaderCenter: {
    width: "70%",
    justifyContent: "center",
  },
  txtHeader: {
    width: "100%",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  back: {
    // alignItems: "center",
    // justifyContent: "center",
  },
  iconheader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
