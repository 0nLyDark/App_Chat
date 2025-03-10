import { View, Text, Platform } from "react-native";
import SockJS from "sockjs-client";
import { Client, Stomp } from "@stomp/stompjs";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { URL_IMAGE } from "./APIService";

// const IP_Address = "192.168.43.21";

// const IP_Address = "192.168.1.2";
// const IP_Address = "192.168.1.4"
const IP_Address = "192.168.1.5";

// const IP_Address = "localhost";

// export const stompClient = new Client({
//   brokerURL: "ws://" + IP_Address + ":8080/ws",
//   webSocketFactory: () => new SockJS("http://" + IP_Address + ":8080/ws"),
//   reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây nếu mất kết nối
//   heartbeatIncoming: 4000, // Heartbeat từ server
//   heartbeatOutgoing: 4000, // Heartbeat tới server
//   connectHeaders: {
//     Authorization: `Bearer token`,
//   },
//   onConnect(frame) {
//     console.log("Connected:", frame);

//     stompClient.subscribe("/topic/greetings", (message) => {
//       console.log("Received:", message.body);
//       // alert(message.body);
//     });

//     subscribeNotification();
//     stompClient.publish({
//       destination: "/app/hello",
//       body: "World",
//     });
//   },

//   onStompError(frame) {
//     console.error("Broker reported error:", frame.headers["message"]);
//     console.error("Additional details:", frame.body);
//   },
//   onDisconnect(frame) {
//     console.log("Disconnect: ", frame);
//   },
// });

// export const send = (endpoint: string, messages: any) => {
//   stompClient.publish({
//     destination: endpoint,
//     body: JSON.stringify(messages),
//     // headers: {
//     //   Authorization: token ? `Bearer ${token}` : "",
//     // },
//   });
// };
// let pageSpecificCallback: ((data: any) => void) | null = null;
// const FriendRequestGlobalLogic = (data: any) => {
//   console.log("Global logic:", data);
// };
// export const onPageFriendRequestLogic = (callback: (data: any) => void) => {
//   pageSpecificCallback = callback;
// };

// // Khi rời khỏi trang
// export const clearPageFriendRequestLogic = () => {
//   pageSpecificCallback = null;
// };

// const getToken = async () => {
//   const token = await AsyncStorage.getItem("jwt-token");
//   stompClient.connectHeaders.Authorization = `Bearer ${token}`;
// };
// const subscribeNotification = async () => {
//   const userId = await AsyncStorage.getItem("userId");
//   stompClient.subscribe(`/queue/friendRequest/${userId}`, (message: any) => {
//     const data = JSON.parse(message.body);
//     FriendRequestGlobalLogic(data);
//     const content = {
//       content: data.sender.fullName + " đã gửi cho bạn lời mời kết bạn",
//       avatar: data.sender.avatar,
//     };
//     sendNotification("Lời mời kết bạn", content);
//     // Nếu có logic cụ thể cho trang hiện tại
//     if (pageSpecificCallback) {
//       pageSpecificCallback(data);
//     }
//   });
// };

// // Kết nối đến server
// export const connect = async () => {
//   if (stompClient.active == false) {
//     await getToken();
//     stompClient.activate();
//   }
// };

// export const disconnect = () => {
//   stompClient.deactivate();
// };

// Gửi thông báo
export const sendNotification = async (title: string, data: any) => {
  if (Platform.OS === "web") {
    // Sử dụng API thông báo của web
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: data.content,
        icon: URL_IMAGE + data.avatar, // Tùy chọn: URL của biểu tượng thông báo
      });
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, {
            body: data.content,
          });
        }
      });
    }
  } else {
    // async function scheduleNotification() {
    try {
      let { status } = await Notifications.requestPermissionsAsync();
      console.log(status);
      if (status != "granted") {
        alert("Permission to access notifications was denied");
        return;
      }
      const imageUrl = URL_IMAGE + data.avatar;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: data.content,
          attachments: [
            {
              url: imageUrl, // Đường dẫn tới hình ảnh
              identifier: "image-attachment",
              type: imageUrl.endsWith(".png")
                ? "image/png"
                : imageUrl.endsWith(".jpg") || imageUrl.endsWith(".jpeg")
                ? "image/jpeg"
                : imageUrl.endsWith(".webp")
                ? "image/webp"
                : "image/png", // Loại hình ảnh (có thể là 'image/png', 'image/jpeg', v.v.)
            },
          ],
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 0,
          repeats: false,
          channelId: "default",
        },
      });
      alert(status);
    } catch (error) {
      console.log(error);
    }
  }
};
