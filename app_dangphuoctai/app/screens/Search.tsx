import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { GET_PAGE, POST_ADD, PUT_EDIT, URL_IMAGE } from "../api/APIService";

interface User {
  userId: number;
  fullName: string;
  avatar: string;
  typeContact: string;
}
const Search = ({ navigation }: { navigation: any }) => {
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  useEffect(() => {
    console.log(keyword);
    if (keyword.length > 0) {
      GET_PAGE(`public/users/keyword/${keyword.trim()}`, page, size)
        .then((res) => {
          setSearchResult(res.data.content);
          console.log(res.data.content);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [keyword]);
  const sendFriendRequest = (receiverId: number) => {
    POST_ADD(`public/friendRequest/${receiverId}`, null)
      .then((response) => {
        const updatedResults = searchResult.map((user) =>
          user.userId === receiverId
            ? { ...user, typeContact: "REQUEST" }
            : user
        );
        setSearchResult(updatedResults);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const cancelFriendRequest = (receiverId: number) => {
    const data = {
      receiver: { userId: receiverId },
      status: "cancel",
    };

    PUT_EDIT(`public/friendRequest/status`, data)
      .then((response) => {
        const updatedResults = searchResult.map((user) =>
          user.userId === receiverId ? { ...user, typeContact: "NOT" } : user
        );
        setSearchResult(updatedResults);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const acceptFriendRequest = (senderId: number) => {
    const data = {
      sender: { userId: senderId },
      status: "accept",
    };
    PUT_EDIT(`public/friendRequest/status`, data)
      .then((response) => {
        const updatedResults = searchResult.map((user) =>
          user.userId === senderId ? { ...user, typeContact: "FRIEND" } : user
        );
        setSearchResult(updatedResults);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const notAcceptFriendRequest = (senderId: number) => {
    const data = {
      sender: { userId: senderId },
      status: "notAccept",
    };
    PUT_EDIT(`public/friendRequest/status`, data)
      .then((response) => {
        const updatedResults = searchResult.map((user) =>
          user.userId === senderId ? { ...user, typeContact: "NOT" } : user
        );
        setSearchResult(updatedResults);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="chevron-back" size={20} color="#70CEF9" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="black" />
          <TextInput
            style={styles.inputSearch}
            placeholder="Tìm kiếm"
            placeholderTextColor="black"
            value={keyword}
            onChangeText={(text) => setKeyword(text)}
          />
          <TouchableOpacity>
            <Ionicons
              name="mic"
              size={20}
              color="black"
              style={styles.iconMicro}
            />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={searchResult}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: URL_IMAGE + item.avatar }}
                // source={require("../../assets/images/avatar.png")}
                style={{ width: 50, height: 50, borderRadius: 50 }}
              />
              <Text style={{ marginLeft: 10 }}>{item.fullName}</Text>
            </TouchableOpacity>
            <View style={styles.btnItem}>
              {item.typeContact == "FRIEND" ? (
                <TouchableOpacity style={styles.btn}>
                  <Text style={styles.txtBtnItem}>Bạn bè</Text>
                </TouchableOpacity>
              ) : item.typeContact == "REQUEST" ? (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => cancelFriendRequest(item.userId)}
                >
                  <Text style={styles.txtBtnItem}>Hủy lời mời</Text>
                </TouchableOpacity>
              ) : item.typeContact == "ACCEPT" ? (
                <View style={{ flexDirection: "row", columnGap: 5 }}>
                  <TouchableOpacity
                    style={[styles.btn, { width: "50%" }]}
                    onPress={() => acceptFriendRequest(item.userId)}
                  >
                    <Text style={styles.txtBtnItem}>Chấp nhận</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, { width: "50%" }]}
                    onPress={() => notAcceptFriendRequest(item.userId)}
                  >
                    <Text style={styles.txtBtnItem}>Từ chối</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => sendFriendRequest(item.userId)}
                >
                  <Text style={styles.txtBtnItem}>Thêm bạn bè</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    width: "100%",
    height: 60,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    // Shadow cho iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // Đổ bóng xuống dưới
    shadowOpacity: 0.4,
    shadowRadius: 5,
    // Shadow cho Android
    elevation: 2,
  },
  btnBack: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    // maxWidth: 345,
    color: "black",
    height: 45,
    backgroundColor: "white",
    borderRadius: 6,
    marginVertical: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  inputSearch: {
    flex: 1,
    height: "100%",
    paddingLeft: 5,
    color: "black",
    borderColor: "transparent",
    outlineColor: "transparent",
  },
  iconSearch: {
    width: 24,
    height: 24,
  },
  iconMicro: {
    width: 24,
    height: 24,
  },
  userItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  btnItem: {
    width: "35%",
    maxWidth: 100,
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    height: 35,
    backgroundColor: "#eeeeee",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  txtBtnItem: {
    color: "black",
    fontSize: 14,
  },
});
