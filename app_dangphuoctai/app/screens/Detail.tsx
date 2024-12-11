import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";

const Detail = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.bg}>
      <Text>Details </Text>
      <Button title="Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
