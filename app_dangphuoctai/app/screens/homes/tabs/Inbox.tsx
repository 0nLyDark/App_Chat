import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import PersonalChatItem from "@/components/PersonalChatItem";
import { useNavigation } from "@react-navigation/native";

const Inbox = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {Array(8)
        .fill(null)
        .map((_, index) => {
          return <PersonalChatItem key={index} navigation={navigation} />;
        })}
      <PersonalChatItem navigation={navigation} />
    </ScrollView>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
