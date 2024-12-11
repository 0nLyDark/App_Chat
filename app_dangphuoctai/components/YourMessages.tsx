import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const YourMessages = ({ messages }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentMessages}>
        <Text style={styles.txtMessages}>{messages.content}</Text>
        <Text style={styles.txtTime}>1:41 PM</Text>
      </View>
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
    maxWidth: "80%",
    borderRadius: 20,
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
});
