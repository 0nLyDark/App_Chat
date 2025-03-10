import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { formatDateTime, GET_ID, URL_IMAGE } from "@/app/api/APIService";
import { useApp } from "@/app/context/AppContext";
export interface ConversationMember {
  conversationMemberId: string;
  isOut: boolean;
  role: string;
  user: any;
}
export function limitString(str: string, maxLength: number) {
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
}
const PersonalChatItem = ({
  navigation,
  data,
}: {
  navigation: any;
  data: any;
}) => {
  const [conversationMember, setConversationMember] =
    useState<ConversationMember>({
      conversationMemberId: "",
      isOut: false,
      role: "",
      user: {},
    });
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [online, setOnline] = useState(false);
  const {
    userId,
    isConnected,
    listFriendOnline,
    subscribeToChannel,
    setListFriendOnline,
  } = useApp();

  useEffect(() => {
    setLastMessage(data.lastMessage);

    const member = data.conversationMembers.find(
      (m: any) => m.user.userId != userId
    );
    if (member) {
      // if (member.user.isOnline == true) {
      //   setListFriendOnline((prev) => {
      //     const newSet = new Set(prev);
      //     newSet.add(member.user.userId);
      //     return Array.from(newSet);
      //   });
      // }
      setConversationMember(member);
      // console.log("member", member);
      // console.log("image", URL_IMAGE + member.user.avatar);
    }
  }, [data, userId]);
  useEffect(() => {}, [listFriendOnline]);
  useEffect(() => {
    if (isConnected) {
      const handleSubscription = (msg: any) => {
        const message = JSON.parse(msg.body);
        setLastMessage(message);
        console.log("message", message);
      };
      const subscription = subscribeToChannel(
        `/queue/conversation/${data.conversationId}`,
        handleSubscription
      );
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [data, isConnected]);

  return (
    <Pressable
      android_ripple={{ color: "#444444", borderless: false }}
      style={styles.container}
      onPress={() =>
        navigation.navigate("PersonalChat", {
          conversationId: data.conversationId,
        })
      }
    >
      <View
        style={{
          width: 60,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={{ uri: URL_IMAGE + conversationMember.user.avatar }}
          style={styles.img}
        />
        {listFriendOnline.includes(conversationMember.user.userId) && (
          <View style={styles.viewOnline} />
        )}
      </View>
      <View style={styles.contentChat}>
        <View style={styles.headerChat}>
          <Text style={styles.title}>{conversationMember.user.fullName}</Text>
          <Text style={styles.timeMessage}>
            {lastMessage && formatDateTime(lastMessage.createdAt)}
          </Text>
        </View>
        <Text style={styles.message}>
          {lastMessage
            ? lastMessage.senderMember.user.userId == userId
              ? `Bạn: ${limitString(lastMessage.content, 22)}`
              : `${lastMessage.senderMember.user.fullName}: ${limitString(
                  lastMessage.content,
                  22
                )}`
            : "Giờ các bạn có thể nhắn với nhau"}
        </Text>
      </View>
    </Pressable>
  );
};

export default PersonalChatItem;

const styles = StyleSheet.create({
  container: {
    width: "auto",
    height: "auto",
    maxHeight: 80,
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
  },
  img: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 50,
  },
  viewOnline: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: "#00d100",
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  viewOffline: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: "#bebebe",
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  contentChat: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 6,
  },
  headerChat: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 17,
    fontWeight: "semibold",
  },
  message: {
    color: "#ACB3BF",
    fontSize: 12,
    fontWeight: "semibold",
  },
  timeMessage: {
    color: "#ACB3BF",
    fontSize: 12,
    fontWeight: "semibold",
  },
});
