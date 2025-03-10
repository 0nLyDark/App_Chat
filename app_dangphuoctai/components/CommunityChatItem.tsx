import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import { formatDateTime, GET_ID, URL_IMAGE } from "@/app/api/APIService";
import { useApp } from "@/app/context/AppContext";
import { limitString } from "./PersonalChatItem";
const isValidString = (str: string | null): boolean => {
  return !!str && str.trim().length > 0;
};
const CommunityChatItem = ({
  navigation,
  data,
}: {
  navigation: any;
  data: any;
}) => {
  const [loaded, error] = useFonts({
    Sacramento: require("../assets/fonts/Sacramento.otf"),
    OpenSans: require("../assets/fonts/OpenSans-Regular.ttf"),
  });
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [conversationName, setConversationName] = useState("");
  const {
    userId,
    isConnected,
    listFriendOnline,
    send,
    subscribeToChannel,
    setListFriendOnline,
  } = useApp();
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  useEffect(() => {
    setLastMessage(data.lastMessage);
    let result = data.conversationMembers
      .filter((member: any) => !member.isOut)
      .map((member: any) => {
        // if (member.user.userId != userId && member.user.isOnline == true) {
        //   setListFriendOnline((prev) => {
        //     const newSet = new Set(prev);
        //     newSet.add(member.user.userId);
        //     return Array.from(newSet);
        //   });
        // }

        return member.user.fullName;
      });
    if (data.conversationName == null) {
      result = result.join(",");
    } else {
      result = data.conversationName;
    }
    setConversationName(result);
  }, [data, userId]);
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
  useEffect(() => {
    setOnline(
      data.conversationMembers.some((member: any) =>
        listFriendOnline.includes(member.user.userId)
      )
    );
  }, [listFriendOnline]);
  if (!loaded && !error) {
    return null;
  }
  return (
    <Pressable
      android_ripple={{ color: "#444444", borderless: false }}
      style={styles.container}
      onPress={() =>
        navigation.navigate("CommunityChat", {
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
          source={{
            uri: URL_IMAGE + (data.avatar ? data.avatar : "default.png"),
          }}
          style={styles.img}
        />
        {online && <View style={styles.viewOnline} />}
      </View>
      <View style={styles.contentChat}>
        <View style={styles.headerChat}>
          <Text style={styles.title}>{limitString(conversationName, 18)}</Text>
          <View style={styles.countPerson}>
            {/* <Ionicons name="person" size={12} color="white" /> */}
            <Text style={styles.timeMessage}>
              {lastMessage && formatDateTime(lastMessage.createdAt)}
            </Text>
          </View>
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

export default CommunityChatItem;

const styles = StyleSheet.create({
  container: {
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
  countPerson: {
    display: "flex",
    flexDirection: "row",
    columnGap: 2,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 17,
    fontFamily: "OpenSans",
    fontWeight: "semibold",
  },
  message: {
    color: "#ACB3BF",
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "semibold",
  },
  timeMessage: {
    color: "#ACB3BF",
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "semibold",
  },
});
