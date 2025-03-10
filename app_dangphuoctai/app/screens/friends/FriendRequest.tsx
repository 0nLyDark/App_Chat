import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  GET_ALL,
  GET_PAGE,
  POST_ADD,
  PUT_EDIT,
  URL_IMAGE,
} from "@/app/api/APIService";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApp } from "@/app/context/AppContext";

interface friendRequest {
  friendRequestId: number;
  sender: any;
  receiver: any;
  status: string;
  createdDate: Date;
}

const FriendRequest = () => {
  const {
    userId,
    subscribeToChannel,
    onPageFriendRequestLogic,
    clearPageFriendRequestLogic,
  } = useApp();
  const [ListFriend, setListFriend] = useState<friendRequest[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sender, setSender] = useState(0);
  const [isFeedback, setIsFeedback] = useState(false);
  useEffect(() => {
    GET_PAGE("public/friendRequest", page, size)
      .then((res) => {
        setListFriend(res.data.content);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    const subscribe = async () => {
      // const userId = await AsyncStorage.getItem("userId");
      // console.log(userId);
      onPageFriendRequestLogic((data: any) => {
        setListFriend((prevMessages) => {
          return [...prevMessages, data];
        });
      });
      // stompClient.subscribe(
      //   `/queue/friendRequest/${userId}`,
      //   (message: any) => {
      //     const data = JSON.parse(message.body);
      //     setListFriend((prevMessages) => {
      //       return [...prevMessages, data];
      //     });
      //   }
      // );
      const handleSubscription = (message: any) => {
        const data = JSON.parse(message.body);
        const result = ListFriend.filter(
          (f) => f.sender.userId != data.sender.userId
        );
        setListFriend(result);
      };
      const subscription = subscribeToChannel(
        `/queue/unFriendRequest/${userId}`,
        handleSubscription
      );
    };
    subscribe();
    return () => {
      clearPageFriendRequestLogic();
    };
  }, []);
  const feedBack = (senderId: number) => {
    setSender(senderId);
    setIsFeedback(true);
  };
  const acceptFriendRequest = (senderId: number) => {
    const data = {
      sender: { userId: senderId },
      status: "accept",
    };
    PUT_EDIT(`public/friendRequest/status`, data)
      .then((response) => {
        const updatedResults = ListFriend.filter(
          (request) => request.sender.userId !== senderId
        );
        setListFriend(updatedResults);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsFeedback(false);
  };
  const notAcceptFriendRequest = (senderId: number) => {
    const data = {
      sender: { userId:senderId },
      status: "notAccept",
    };
    PUT_EDIT(`public/friendRequest/status`, data)
      .then((response) => {
        const updatedResults = ListFriend.filter(
          (request) => request.sender.userId !== senderId
        );
        setListFriend(updatedResults);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsFeedback(false);
  };
  return (
    <View style={styles.container}>
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
            Không có yều cầu kết bạn nào
          </Text>
        </View>
      )}
      <FlatList
        data={ListFriend}
        renderItem={({ item }) => {
          return (
            <View style={styles.borderItem}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: URL_IMAGE + item.sender.avatar }}
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />
                <Text style={{ marginLeft: 10 }}>{item.sender.fullName}</Text>
              </TouchableOpacity>
              <View style={styles.btnItem}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => feedBack(item.sender.userId)}
                >
                  <Text style={styles.txtBtnItem}>Phản Hồi</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
      {isFeedback && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setIsFeedback(false)}
          ></TouchableOpacity>
          <View style={styles.formfeedback}>
            <TouchableOpacity
              style={styles.btnFeedback}
              onPress={() => acceptFriendRequest(sender)}
            >
              <Text style={styles.txtFeedback}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnFeedback}
              onPress={() => notAcceptFriendRequest(sender)}
            >
              <Text style={styles.txtFeedback}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  borderItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  btnItem: {
    width: "35%",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#eeeeee",
    borderRadius: 15,
  },
  txtBtnItem: {},
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#a7a7a7e3",
    opacity: 0.8,
    zIndex: 5,
  },
  formfeedback: {
    height: 150,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 10,
  },
  btnFeedback: {
    width: "100%",
    height: 50,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  txtFeedback: {
    fontWeight: "bold",
  },
});
