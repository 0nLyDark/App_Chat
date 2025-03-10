import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import YourMessages from "@/components/YourMessages";
import OtherMessages from "@/components/OtherMessages";
import { ConversationMember } from "@/components/PersonalChatItem";
import { GET_ID, GET_PAGE, PUT_EDIT, URL_IMAGE } from "@/app/api/APIService";
import { toast } from "../EditProfile";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useApp } from "@/app/context/AppContext";
interface Message {
  messageId: number;
  senderMember: any;
  conversationId: string;
  content: string;
  listMessageStatus: any[];
  isDeleted: boolean;
  createdAt: string;
}
const CommunityChat = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const scrollViewRef = useRef<ScrollView | null>(null); // ScrollView hoặc null
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true }); // Cuộn đến cuối
    }
  };
  const { conversationId } = route.params; // Lấy id được truyền vào

  const { userId, isConnected, listFriendOnline, send, subscribeToChannel } =
    useApp();
  const [conversationMembers, setConversationMembers] = useState<any[]>([]);
  const [online, setOnline] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [conversationName, setConversationName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [numberMember, setNumberMember] = useState(0);
  const [message, setMessage] = useState("");
  const [listMessages, setListMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList<Message> | null>(null);
  const [loading, setLoading] = useState(false);
  const onContentSizeChange = () => {
    flatListRef.current?.scrollToOffset({ offset: 0 });
  };
  useEffect(() => {
    GET_ID(`public/conversations`, conversationId)
      .then((res) => {
        setConversationMembers(res.data.conversationMembers);
        setAvatar(res.data.avatar ? res.data.avatar : "default.png");
        setNumberMember(res.data.conversationMembers.length);
        let result = res.data.conversationMembers
          .filter((member: any) => !member.isOut)
          .map((member: { user: any }) => {
            return member.user.fullName;
          });
        if (res.data.conversationName == null) {
          result = result.join(",");
        } else {
          result = res.data.conversationName;
        }
        setConversationName(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [conversationId, userId]);
  useEffect(() => {
    handleLoadMessages();
  }, [conversationId]);
  useEffect(() => {
    const handleSubscription = (message: any) => {
      const data = JSON.parse(message.body);
      console.log("Received:", data);
      setListMessages((prevMessages) => {
        return [data, ...prevMessages];
      });
    };
    const subscription = subscribeToChannel(
      `/queue/conversation/${conversationId}`,
      handleSubscription
    );

    return () => {
      if (subscription) {
        subscription.unsubscribe(); // Cleanup khi component bị unmount
      }
    };
  }, []);
  useEffect(() => {
    const handleSubscription = (message: any) => {
      const data = JSON.parse(message.body);
      console.log("Received:", data);
      setListMessages((prevMessages) => {
        return prevMessages.map((m) => {
          if (m.messageId == data.messageId && data.isDeleted == true) {
            return data; // Thay thế tin nhắn nếu nó đã bị xóa
          }
          return m;
        });
      });
      if (data.senderMember.user.userId == userId) {
        toast("Đã thu hồi tin nhắn", "short");
      }
    };
    const handleSubscription2 = (message: any) => {
      const data = JSON.parse(message.body);
      console.log("Received:", data);
      setListMessages((prevMessages) => {
        return prevMessages.map((m) => {
          if (m.messageId == data.messageId) {
            return data;
          }
          return m;
        });
      });
    };
    const subscription = subscribeToChannel(
      `/queue/conversation/${conversationId}/retrieveMessage`,
      handleSubscription
    );
    const subscription2 = subscribeToChannel(
      `/queue/conversation/${conversationId}/icon`,
      handleSubscription2
    );
    return () => {
      // Cleanup khi component bị unmount
      if (subscription) {
        subscription.unsubscribe();
      }
      if (subscription2) {
        subscription2.unsubscribe();
      }
    };
  }, []);
  useEffect(() => {
    if (isConnected) {
      const handleSubscription = (res: any) => {
        const conversation = JSON.parse(res.body);
        if (conversation.conversationId == conversationId) {
          if (conversation.conversationName == null) {
            let result = conversation.conversationMembers.map(
              (member: { user: { fullName: string } }) => {
                return member.user.fullName;
              }
            );
            if (conversation.conversationName == null) {
              result = result.join(",");
            } else {
              result = conversation.conversationName;
            }
            setConversationName(result);
          } else {
            setConversationName(conversation.conversationName);
          }
          setAvatar(conversation.avatar ? conversation.avatar : "default.png");
        }
      };
      const subscription = subscribeToChannel(
        `/queue/users/${userId}/conversations/group`,
        handleSubscription
      );

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [isConnected]);
  useEffect(() => {
    setOnline(
      conversationMembers.some((member: any) =>
        listFriendOnline.includes(member.user.userId)
      )
    );
  }, [listFriendOnline, conversationMembers]);
  const sendMessage = () => {
    if (message.trim() == "") return;
    let messages = {
      userId: userId,
      conversationId: conversationId,
      content: message,
    };
    send(`/app/messages`, messages);
    setMessage("");
    onContentSizeChange();
  };
  const deleteMessage = (messageId: string | number) => {
    PUT_EDIT(`public/conversations/messages/${messageId}`, {})
      .then((response) => {
        setListMessages((prevMessages) =>
          prevMessages.filter((message) => message.messageId !== messageId)
        );
      })
      .catch((error) => {
        console.log("Error: ", error);
        toast("Đã xảy ra lỗi! Xóa thất bại", "long");
      });
  };
  const handleLoadMessages = async () => {
    if (loading || lastPage) return;
    setLoading(true);

    GET_PAGE(
      `public/conversations/${conversationId}/messages`,
      pageNumber + 1,
      14,
      "createdAt",
      "desc"
    )
      .then((res) => {
        setPageNumber(pageNumber + 1);
        setListMessages((prevMessages) => {
          return [...prevMessages, ...res.data.content];
        });
        setLastPage(res.data.lastPage);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" color={"#29B6F6"} size={20} />
          </TouchableOpacity>
        </View>
        {/* <View style={styles.viewHeaderCenter}> */}
        <TouchableOpacity
          style={styles.viewHeaderCenter}
          onPress={() =>
            navigation.navigate("CommunityDetail", {
              conversationId: conversationId,
            })
          }
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image
              style={styles.imgProfile}
              source={{ uri: URL_IMAGE + avatar }}
            />
          </View>
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.txtName}>{conversationName}</Text>
            <View style={styles.status}>
              <Text style={styles.txtStatus}>{online && "Online"}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* </View> */}
        <View style={styles.viewHeader}>
          <TouchableOpacity
          // onPress={() => navigation.navigate("Setting")}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>

      <GestureHandlerRootView style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={listMessages}
          keyExtractor={(item, index) => item.messageId.toString()}
          renderItem={({ item }) => {
            return (
              <View>
                {String(item.senderMember.user.userId) == String(userId) ? (
                  <YourMessages messages={item} deleteMessage={deleteMessage} />
                ) : (
                  <OtherMessages
                    messages={item}
                    deleteMessage={deleteMessage}
                  />
                )}
              </View>
            );
          }}
          inverted={true}
          onEndReached={handleLoadMessages} // Load khi kéo lên trên
          onEndReachedThreshold={0.5} // Khi cuộn gần 10% đầu danh sách thì gọi API
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }} // Giúp căn tin nhắn đúng vị trí
          ListFooterComponent={loading ? <ActivityIndicator /> : null} // Hiển thị loading khi tải
        />
      </GestureHandlerRootView>

      <View style={styles.Messages}>
        <TouchableOpacity style={styles.btnIcon}>
          <Ionicons name="happy-outline" size={28} color={"black"} />
        </TouchableOpacity>
        <TextInput
          style={styles.sendMessages}
          placeholder="Message"
          placeholderTextColor="white"
          value={message}
          onChangeText={(text) => setMessage(text)}
          multiline={true}
        />
        <TouchableOpacity style={styles.btnIcon} onPress={sendMessage}>
          <Ionicons name="send" size={28} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnIcon}>
          <Ionicons name="mic" size={28} color={"white"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommunityChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    height: 68,
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
    flex: 1,
    paddingBottom: 5,
  },
  imgProfile: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    overflow: "hidden",
  },
  txtName: {
    color: "white",
    fontSize: 14,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
  },
  status: {
    display: "flex",
    flexDirection: "row",
    columnGap: 5,
    alignItems: "center",
  },
  txtStatus: {
    color: "#34A853",
    fontSize: 12,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
  },
  Messages: {
    width: "100%",
    height: "auto",
    minHeight: 45,
    maxHeight: 100,
    backgroundColor: "#50555C",
    display: "flex",
    flexDirection: "row",
  },
  sendMessages: {
    flex: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "medium",
    fontFamily: "Poppins",
  },
  btnIcon: {
    width: 35,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
});
