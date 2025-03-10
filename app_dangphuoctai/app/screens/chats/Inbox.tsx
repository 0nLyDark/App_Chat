import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useId, useState } from "react";
import PersonalChatItem from "@/components/PersonalChatItem";
import { useNavigation } from "@react-navigation/native";
import { GET_PAGE } from "@/app/api/APIService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommunityChatItem from "@/components/CommunityChatItem";
import { useApp } from "@/app/context/AppContext";

interface Conversation {
  conversationId: number;
  isGroup: boolean;
  conversationName: string;
  avatar: string;
  conversationMembers: any[];
  lastMessage: string;
  lastMessageTime: string;
}
const Inbox = ({ navigation }: { navigation: any }) => {
  const navigations = useNavigation();
  const [pageNumber, setPageNumber] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;
  const sortBy = "lastMessage.createdAt";
  const sortOrder = "desc";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { userId, isConnected, subscribeToChannel } = useApp();

  useEffect(() => {
    setConversations([]);
    handleLoadConversation();
  }, []);
  useEffect(() => {
    if (isConnected) {
      const handleSubscription = (res: any) => {
        const conversation = JSON.parse(res.body);
        setConversations((preConversations) => {
          const existingIndex = preConversations.findIndex(
            (conv) => conv.conversationId === conversation.conversationId
          );
          if (existingIndex !== -1) {
            // Nếu đã có trong danh sách, cập nhật nó
            const updatedConversations = [...preConversations];
            updatedConversations[existingIndex] = conversation;
            return updatedConversations;
          } else {
            // Nếu chưa có, thêm mới vào đầu danh sách
            return [conversation, ...preConversations];
          }
        });
      };
      const subscription = subscribeToChannel(
        `/user/queue/conversations/create`,
        handleSubscription
      );

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [isConnected]);
  // useEffect(() => {
  //   console.log(conversations);
  // }, [conversations]);

  const handleLoadConversation = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const id = await AsyncStorage.getItem("userId");
      const response = await GET_PAGE(
        `public/conversations/user/${id}/type/all`,
        pageNumber + 1,
        pageSize,
        sortBy,
        sortOrder
      );
      setLastPage(response.data.lastPage);
      setConversations((prevConversations) => [
        ...prevConversations,
        ...response.data.content,
      ]);
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const loadConversation = () => {
    if (!lastPage) {
      handleLoadConversation();
    }
  };

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item, index) => item.conversationId.toString()}
      renderItem={({ item }) => {
        return (
          <View>
            {item.isGroup == true ? (
              <CommunityChatItem navigation={navigations} data={item} />
            ) : (
              <PersonalChatItem navigation={navigations} data={item} />
            )}
          </View>
        );
      }}
      onEndReached={loadConversation} // Gọi hàm khi cuộn đến cuối
      onEndReachedThreshold={0.4} // Ngưỡng kích hoạt (0.2 = 20% của màn hình)
    />
  );
};

export default Inbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
