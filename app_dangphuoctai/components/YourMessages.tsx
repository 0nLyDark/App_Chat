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
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useApp } from "@/app/context/AppContext";

const reactions = ["❤️", "👍", "😆", "😲", "😅", "😡"];
interface YourMessagesProps {
  messages: any;
  deleteMessage: (messageId: string | number) => void;
}

const YourMessages = ({ messages, deleteMessage }: YourMessagesProps) => {
  const { userId, send } = useApp();
  const [time, setTime] = useState("14:02");
  const [isOn, setIsOn] = useState(false);
  let timer: string | number | NodeJS.Timeout | undefined;
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [listselectedReaction, setListSelectedReaction] = useState([]);
  const [listReaction, setlistReaction] = useState("");
  useEffect(() => {
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
  const copyToClipboard = () => {
    Clipboard.setStringAsync(messages.content);
    if (Platform.OS === "android") {
      ToastAndroid.show("Đã sao chép", ToastAndroid.SHORT);
    } else {
      Alert.alert("Thông báo", "Đã sao chép");
    }
    setIsOn(false);
  };
  const handleReaction = (reaction: any) => {
    sendIcon(reaction);
    setIsOn(false);
  };
  const retrieveMessages = () => {
    send(`/app/messages/retrieve`, { messageId: messages.messageId });
    setIsOn(false);
  };
  const sendIcon = (icon: string) => {
    const messageStatus = {
      messageId: messages.messageId,
      icon: icon,
    };
    send(`/app/messages/icon`, messageStatus);
  };
  return (
    <View style={styles.container}>
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
                onPress={retrieveMessages}
              >
                <Ionicons name="refresh" size={24} color="blue" />
                <Text style={{ color: "black" }}>Thu hồi</Text>
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

export default YourMessages;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-end",
  },
  contentMessages: {
    backgroundColor: "#3e6189",
    width: "auto",
    maxWidth: "75%",
    borderRadius: 15,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 10,
    marginRight: 10,
    marginBottom: 8,
    paddingHorizontal: 15,
    paddingVertical: 2,
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
    display: "flex",
    flexDirection: "row",
    fontSize: 14,
    backgroundColor: "#555555",
    borderRadius: 50,
    padding: 1,
    // width: 20,
    // height: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 10,
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
    justifyContent: "space-between",
  },
  editItem: {
    width: "25%",
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
