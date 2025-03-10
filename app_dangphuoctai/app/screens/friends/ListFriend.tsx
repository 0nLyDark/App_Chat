import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GET_ID, GET_PAGE, URL_IMAGE } from "@/app/api/APIService";
import { TextInput } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/app/context/AppContext";

interface User {
  userId: number;
  fullName: string;
  avatar: string;
  typeContact: string;
}
const ListFriend = ({ navigation }: { navigation: any }) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ListFriend, setListFriend] = useState<User[]>([]);
  const [keyword, setKeyword] = useState("");
  const { userId } = useApp();

  useEffect(() => {
    if (loading) return;
    setLoading(true);
    GET_PAGE("public/myFriend/keyword/" + keyword.trim(), 0, pageSize)
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
      "public/myFriend/keyword/" + keyword.trim(),
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
  const getChat = (friendId: number) => {
    GET_ID(`public/conversations/user/${userId}/friend`, friendId)
      .then((res) => {
        navigation.navigate("PersonalChat", {
          conversationId: res.data.conversationId,
        });
      })
      .catch((error) => {
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Không thể nhắn tin với người này",
            ToastAndroid.LONG
          );
        } else {
          Alert.alert("Thông báo", "Không thể nhắn tin với người này");
        }
        console.log(error);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="black" />
        <TextInput
          style={styles.inputSearch}
          placeholder="Tìm kiếm"
          placeholderTextColor="black"
          value={keyword}
          onChangeText={(text) => setKeyword(text)}
          onFocus={() => {}}
          onBlur={() => {}}
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
      {ListFriend.length == 0 && (
        <View
          style={{
            width: "100%",
            height: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
            Không tìm thấy kết quả nào
          </Text>
        </View>
      )}
      <FlatList
        data={ListFriend}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleLoadMyFriend}
        onEndReachedThreshold={0.2}
        // contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        renderItem={({ item }) => (
          <View style={styles.borderItem}>
            <View style={styles.borderInfo}>
              <Image
                source={{ uri: URL_IMAGE + item.avatar }}
                style={styles.avatar}
              />
              <Text style={styles.txtItem}>{item.fullName}</Text>
            </View>
            <View style={styles.borderBtn}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => getChat(item.userId)}
              >
                <Text style={styles.txtBtn}>Nhắn Tin</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ListFriend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  borderItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  borderInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  txtItem: {
    marginLeft: 5,
  },
  borderBtn: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    padding: 10,
    paddingVertical: 8,
    backgroundColor: "#80c8ff",
    borderColor: "#dddddd",
    borderWidth: 2,
    borderRadius: 25,
  },
  txtBtn: {
    color: "black",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    // maxWidth: 345,
    maxHeight: 50,
    color: "black",
    height: 45,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: 8,
    marginHorizontal: 20,
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
});
