import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import YourMessages from "@/components/YourMessages";
import OtherMessages from "@/components/OtherMessages";
import {
  GET_ID,
  GET_PAGE,
  PUT_EDIT,
  timeAgo,
  URL_IMAGE,
} from "@/app/api/APIService";
import { ConversationMember } from "@/components/PersonalChatItem";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { toast } from "../EditProfile";
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
const PersonalChat = ({
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
  const { userId, listFriendOnline, send, subscribeToChannel } = useApp();
  const [timeOffline, setTimeOffline] = useState("");
  const [time, setTime] = useState("");
  const [conversationMember, setConversationMember] =
    useState<ConversationMember>({
      conversationMemberId: "",
      isOut: false,
      role: "",
      user: {},
    });
  const [message, setMessage] = useState("");
  const [listMessages, setListMessages] = useState<Message[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const flatListRef = useRef<FlatList<Message> | null>(null);
  const [loading, setLoading] = useState(false);
  const onContentSizeChange = () => {
    flatListRef.current?.scrollToOffset({ offset: 0 });
  };
  useEffect(() => {
    GET_ID(`public/conversations`, conversationId)
      .then((res) => {
        res.data.conversationMembers.map((member: any) => {
          if (member.user.userId != userId) {
            setConversationMember(member);
            return;
          }
        });
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
    setTimeOffline(conversationMember.user.timeOffline);
  }, [conversationMember]);
  useEffect(() => {
    setTime(timeAgo(timeOffline));
    const interval = setInterval(() => {
      setTime(timeAgo(timeOffline));
    }, 30000); // Cập nhật mỗi nửa phút
    return () => clearInterval(interval);
  }, [timeOffline]);
  useEffect(() => {
    if (!listFriendOnline.includes(conversationMember.user.userId)) {
      setTimeOffline(new Date().toISOString());
    }
  }, [listFriendOnline]);
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
        <View style={styles.viewHeaderCenter}>
          <TouchableOpacity
            style={styles.imgProfile}
            onPress={() =>
              navigation.navigate("InfoContact", {
                userId: conversationMember.user.userId,
              })
            }
          >
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{ uri: URL_IMAGE + conversationMember.user.avatar }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("InfoContact", {
                  userId: conversationMember.user.userId,
                })
              }
            >
              <Text style={styles.txtName}>
                {conversationMember.user.fullName}
              </Text>
            </TouchableOpacity>
            {listFriendOnline.includes(conversationMember.user.userId) ? (
              <Text style={styles.txtStatus}>Online</Text>
            ) : (
              <Text style={styles.txtStatus}>{time}</Text>
            )}
          </View>
        </View>
        <View style={styles.viewHeader}>
          <TouchableOpacity
            onPress={scrollToBottom}
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
          onEndReached={lastPage ? handleLoadMessages : null} // Load khi kéo lên trên
          onEndReachedThreshold={0.5} // Khi cuộn gần 50% đầu danh sách thì gọi API
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

export default PersonalChat;

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
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  txtName: {
    color: "white",
    fontSize: 14,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
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
