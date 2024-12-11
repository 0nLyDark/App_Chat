import { StyleSheet, Text, View } from "react-native";
import React from "react";

const OtherMessages = ({ messages }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentMessages}>
        <Text style={styles.txtMessages}>{messages.content}</Text>
        <Text style={styles.txtTime}>1:42 PM</Text>
      </View>
    </View>
  );
};

export default OtherMessages;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-start",
  },
  contentMessages: {
    backgroundColor: "#222e3a",
    width: "auto",
    maxWidth: "80%",
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 10,

    marginLeft: 10,
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
