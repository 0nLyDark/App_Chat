import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IP_Address, URL_IMAGE } from "../api/APIService";
import { sendNotification } from "../api/WSService";

// Định nghĩa kiểu dữ liệu cho context
type AppContextType = {
  // User context
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  listFriendOnline: string[];
  setListFriendOnline: React.Dispatch<React.SetStateAction<string[]>>;

  // Socket context
  isConnected: boolean;
  send: (destination: string, messages: any) => void;
  subscribeToChannel: (
    destination: string,
    callback: (message: any) => void
  ) => StompSubscription | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  onPageFriendRequestLogic: (callback: (data: any) => void) => void;
  clearPageFriendRequestLogic: () => void;
};

// Tạo context với giá trị mặc định
const AppContext = createContext<AppContextType | null>(null);

// Hook custom để sử dụng AppContext
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // User state
  const [userId, setUserId] = useState<string | null>(null);
  const [listFriendOnline, setListFriendOnline] = useState<string[]>([]);
  // Socket state
  const [isConnected, setIsConnected] = useState(false);
  const [stompClient] = useState(
    new Client({
      brokerURL: "ws://" + IP_Address + ":8080/ws",
      webSocketFactory: () => new SockJS("http://" + IP_Address + ":8080/ws"),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer token`,
      },
      onConnect(frame) {
        console.log("Connected:", frame);
        setIsConnected(true);
        stompClient.subscribe("/topic/greetings", (message) => {
          console.log("Received:", message.body);
        });

        // Đăng ký nhận thông báo trạng thái trực tuyến
        stompClient.subscribe("/user/queue/status", (message) => {
          console.log("status online:", message.body);
          console.log("online:", listFriendOnline);
          const user = JSON.parse(message.body);
          setListFriendOnline((pre) =>
            user.userId != userId && user.isOnline === true
              ? [...pre, user.userId]
              : pre.filter((p) => p !== user.userId)
          );
        });

        subscribeNotification();
        stompClient.publish({
          destination: "/app/hello",
          body: "World",
        });
      },
      onStompError(frame) {
        console.error("Broker reported error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
        setIsConnected(false);
        setListFriendOnline([]);
      },
      onDisconnect(frame) {
        console.log("Disconnect: ", frame);
        setIsConnected(false);
        setListFriendOnline([]);
      },
    })
  );

  let pageSpecificCallback: ((data: any) => void) | null = null;

  const FriendRequestGlobalLogic = (data: any) => {
    console.log("Global logic:", data);
  };

  const onPageFriendRequestLogic = (callback: (data: any) => void) => {
    pageSpecificCallback = callback;
  };

  const clearPageFriendRequestLogic = () => {
    pageSpecificCallback = null;
  };

  const getToken = async () => {
    const token = await AsyncStorage.getItem("jwt-token");
    stompClient.connectHeaders.Authorization = `Bearer ${token}`;
  };

  const subscribeNotification = async () => {
    const currentUserId = await AsyncStorage.getItem("userId");
    if (currentUserId) {
      setUserId(currentUserId);
    }

    stompClient.subscribe(
      `/queue/friendRequest/${currentUserId}`,
      (message: any) => {
        const data = JSON.parse(message.body);
        FriendRequestGlobalLogic(data);
        const content = {
          content: data.sender.fullName + " đã gửi cho bạn lời mời kết bạn",
          avatar: data.sender.avatar,
        };
        sendNotification("Lời mời kết bạn", content);

        if (pageSpecificCallback) {
          pageSpecificCallback(data);
        }
      }
    );
  };

  const connect = async () => {
    if (!stompClient.active) {
      await getToken();
      stompClient.activate();
    }
  };

  const disconnect = () => {
    stompClient.deactivate();
  };

  const send = (destination: string, messages: any) => {
    if (stompClient.connected) {
      stompClient.publish({
        destination: destination,
        body: JSON.stringify(messages),
      });
    } else {
      console.warn("Không thể gửi tin nhắn: STOMP client chưa kết nối");
    }
  };
  const subscribeToChannel = (
    destination: string,
    callback: (message: any) => void
  ) => {
    if (stompClient && stompClient.connected) {
      return stompClient.subscribe(destination, callback);
    } else {
      console.warn("STOMP Client chưa kết nối!");
      return null;
    }
  };
  // Auto-connect khi userId thay đổi
  useEffect(() => {
    if (userId) {
      connect();
    }
  }, [userId]);
  const listFriendOnlineRef = useRef(listFriendOnline);
  useEffect(() => {
    listFriendOnlineRef.current = listFriendOnline;
  }, [listFriendOnline]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("online:", listFriendOnlineRef.current);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);
  const contextValue: AppContextType = {
    // User context
    userId,
    setUserId,
    listFriendOnline,
    setListFriendOnline,

    // Socket context
    isConnected,
    send,
    subscribeToChannel,
    connect,
    disconnect,
    onPageFriendRequestLogic,
    clearPageFriendRequestLogic,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
