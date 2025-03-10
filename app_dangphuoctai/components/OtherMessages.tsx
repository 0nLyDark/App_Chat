import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { URL_IMAGE } from "@/app/api/APIService";
import { useApp } from "@/app/context/AppContext";
const reactions = ["❤️", "👍", "😆", "😲", "😅", "😡"];
interface YourMessagesProps {
  messages: any;
  deleteMessage: (messageId: string | number) => void;
}
const OtherMessages = ({ messages, deleteMessage }: YourMessagesProps) => {
  const { userId, send, subscribeToChannel } = useApp();
  const [time, setTime] = useState("14:02");
  const [isOn, setIsOn] = useState(false);
  let timer: string | number | NodeJS.Timeout | undefined;
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [listselectedReaction, setListSelectedReaction] = useState([]);
  const [listReaction, setlistReaction] = useState("");

  useEffect(() => {
    console.log("ssssssssss", messages);
    const timestamp = Date.parse(messages.createdAt);
    const date = new Date(timestamp);
    setTime(`${date.getHours()}:${date.getMinutes()}`);
  }, []);

  useEffect(() => {
    const list = messages.listMessageStatus
      .map((ms: any) => {
        if (ms.member.user.userId == userId) {
          setSelectedReaction((icon) => {
            return icon != ms.icon ? ms.icon : null;
          });
        }
        return ms.icon;
      })
      .filter((icon: any) => icon != null);
    setListSelectedReaction(list);
    console.log(list);
    const uniqueIconsString = [...new Set(list)].join("");
    setlistReaction(uniqueIconsString);
  }, [messages.listMessageStatus]);
  const handleReaction = (reaction: any) => {
    sendIcon(reaction);
    setIsOn(false);
  };
  const sendIcon = (icon: string) => {
    const messageStatus = {
      messageId: messages.messageId,
      icon: icon,
    };
    send(`/app/messages/icon`, messageStatus);
  };
  const copyToClipboard = () => {
    Clipboard.setStringAsync(messages.content);
    if (Platform.OS === "android") {
      ToastAndroid.show("Đã sao chép", ToastAndroid.SHORT);
    } else {
      Alert.alert("Thông báo", "Đã sao chép");
    }
    setIsOn(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerView}>
        <Image
          style={styles.avatar}
          source={{ uri: URL_IMAGE + messages.senderMember.user.avatar }}
        />
        <View style={styles.content}>
          <Text style={styles.txtName}>
            {messages.senderMember.user.fullName}
          </Text>
          <Pressable
            style={styles.contentMessages}
            onPressIn={() => {
              timer = setTimeout(() => setIsOn(!isOn), 500); // Giữ 0.5 giây mới toggle
            }}
            onPressOut={() => clearTimeout(timer)} // Thả ra trước 0.5 giây thì không toggle
          >
            {!messages.isDeleted ? (
              <Text style={styles.txtMessages}>{messages.content}</Text>
            ) : (
              <Text style={{ fontSize: 17, color: "#d0d0d0" }}>
                Tin nhắn đã được thu hồi
              </Text>
            )}
            <Text style={styles.txtTime}>{time}PM</Text>
            {!messages.isDeleted && listReaction.length > 0 && (
              <View style={styles.reaction}>
                <Text style={{ color: "white" }}>
                  {listselectedReaction.length > 1
                    ? listselectedReaction.length + listReaction
                    : listReaction}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
      {listReaction.length > 0 && <View style={{ marginBottom: 15 }}></View>}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isOn}
        style={{ flexDirection: "column-reverse" }}
      >
        <TouchableOpacity
          onPress={() => setIsOn(!isOn)}
          style={{ flex: 1 }}
        ></TouchableOpacity>
        {!messages.isDeleted && (
          <View style={styles.reactionMenu}>
            {reactions.map((reaction) => (
              <TouchableOpacity
                key={reaction}
                onPress={() => handleReaction(reaction)}
              >
                {reaction == selectedReaction ? (
                  <View style={[styles.bgIcon, styles.pdIcon]}>
                    <Text style={styles.reactionText}>{reaction}</Text>
                  </View>
                ) : (
                  <Text style={styles.reactionText}>{reaction}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
        {messages.isDeleted ? (
          <View style={styles.editMessage}>
            <View style={styles.editItem2}>
              <TouchableOpacity
                style={styles.btnEditMessage}
                onPress={() => deleteMessage(messages.messageId)}
              >
                <Ionicons name="trash" size={24} color="blue" />
                <Text style={{ color: "black" }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.editMessage}>
            <View style={styles.editItem}>
              <TouchableOpacity style={styles.btnEditMessage}>
                <Ionicons name="arrow-undo" size={24} color="blue" />
                <Text style={{ color: "black" }}>Trả lời</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.editItem}>
              <TouchableOpacity
                style={styles.btnEditMessage}
                onPress={copyToClipboard}
              >
                <Ionicons name="copy-outline" size={24} color="blue" />
                <Text style={{ color: "black" }}>Sao chép</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.editItem}>
              <TouchableOpacity
                style={styles.btnEditMessage}
                onPress={() => deleteMessage(messages.messageId)}
              >
                <Ionicons name="trash" size={24} color="blue" />
                <Text style={{ color: "black" }}>Xóa</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.editItem}>
              <TouchableOpacity style={styles.btnEditMessage}>
                <Ionicons name="list" size={24} color="blue" />
                <Text style={{ color: "black" }}>Xem thêm</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        )}
      </Modal>
    </View>
  );
};

export default OtherMessages;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: "75%",
    display: "flex",
    flexDirection: "column",
  },
  containerView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 100,
    marginLeft: 4,
    alignItems: "flex-end",
  },
  content: {},
  contentMessages: {
    backgroundColor: "#222e3a",
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 10,
    marginLeft: 5,
    marginBottom: 8,
    paddingHorizontal: 15,
    paddingVertical: 2,
  },
  txtName: {
    color: "gray",
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 10,
  },
  txtMessages: {
    color: "white",
    fontSize: 17,
  },
  txtTime: {
    textAlign: "right",
    color: "#76a9d1",
    fontSize: 12,
    marginTop: 2,
  },

  reactionMenu: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderColor: "#cccccc",
    borderBottomWidth: 1,
  },
  reaction: {
    fontSize: 14,
    backgroundColor: "#555555",
    borderRadius: 50,
    padding: 1,
    // width: 20,
    // height: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    bottom: -16,
  },
  pdIcon: {
    padding: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bgIcon: {
    borderRadius: 50,
    backgroundColor: "#bebebe",
  },
  reactionText: {
    fontSize: 22,
    marginHorizontal: 5,
  },
  editMessage: {
    width: "100%",
    height: 100,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  editItem: {
    width: "auto",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  editItem2: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnEditMessage: {
    padding: 5,
    flexDirection: "column",
    alignItems: "center",
  },
});
