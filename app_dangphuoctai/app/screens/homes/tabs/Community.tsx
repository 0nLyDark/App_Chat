import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import PersonalChatItem from "@/components/PersonalChatItem";
import CommunityChatItem from "@/components/CommunityChatItem";
import { useNavigation } from "@react-navigation/native";

const Community = () => {
  const navigation = useNavigation();
  return (
    <ScrollView>
      {Array(8)
        .fill(null)
        .map((_, index) => (
          <CommunityChatItem key={index} navigation={navigation} />
        ))}
    </ScrollView>
  );
};

export default Community;

const styles = StyleSheet.create({});
