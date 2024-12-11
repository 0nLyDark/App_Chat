import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import YourMessages from "@/components/YourMessages";
import OtherMessages from "@/components/OtherMessages";
const CommunityChat = ({ navigation }: { navigation: any }) => {
  const scrollViewRef = useRef<ScrollView | null>(null); // ScrollView hoặc null
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true }); // Cuộn đến cuối
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" color={"#29B6F6"} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.viewHeaderCenter}>
          <TouchableOpacity
            style={styles.viewHeaderCenter}
            onPress={() => navigation.navigate("CommunityDetail")}
          >
            <View style={styles.imgProfile}>
              <Image
                source={require("../../assets/images/img_community.png")}
              />
            </View>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text style={styles.txtName}>Startup House</Text>
              <View style={styles.status}>
                <Ionicons name="person-outline" size={12} color={"#ACB3BF"} />
                <Text style={styles.txtStatus}>91/100</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.viewHeader}>
          <TouchableOpacity
          // onPress={() => navigation.navigate("Setting")}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollToBottom()}
      >
        <View style={styles.content}>
          <YourMessages messages={{ content: "I'm good" }} />
          <YourMessages messages={{ content: "What about you ?" }} />
          <YourMessages
            messages={{ content: "Do you enjoy meeting new Peopel?" }}
          />
          <OtherMessages messages={{ content: "I'm doing great. Thank you" }} />
          <OtherMessages
            messages={{
              content: "Yes,I love it. Because I like new Relationship",
            }}
          />
          <YourMessages messages={{ content: "I'm good" }} />
          <YourMessages messages={{ content: "What about you ?" }} />
          <YourMessages
            messages={{ content: "Do you enjoy meeting new Peopel?" }}
          />
          <OtherMessages messages={{ content: "I'm doing great. Thank you" }} />
          <OtherMessages
            messages={{
              content: "Yes,I love it. Because I like new Relationship",
            }}
          />
          <YourMessages messages={{ content: "I'm good" }} />
          <YourMessages messages={{ content: "What about you ?" }} />
          <YourMessages
            messages={{ content: "Do you enjoy meeting new Peopel?" }}
          />
          <OtherMessages messages={{ content: "I'm doing great. Thank you" }} />
          <OtherMessages
            messages={{
              content: "Yes,I love it. Because I like new Relationship",
            }}
          />
        </View>
        <View style={styles.Messages}>
          <TouchableOpacity style={styles.btnIcon}>
            <Ionicons name="happy-outline" size={28} color={"black"} />
          </TouchableOpacity>
          <TextInput
            style={styles.sendMessages}
            placeholder="Message"
            placeholderTextColor="white"
          />
          <TouchableOpacity style={styles.btnIcon}>
            <Ionicons name="send" size={28} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnIcon}>
            <Ionicons name="mic" size={28} color={"white"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CommunityChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    width: "100%",
    height: 68,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#171717",
  },
  viewHeader: {
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  viewHeaderCenter: {
    width: "70%",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  content: {
    minHeight: "100%",
    paddingBottom: 55,
  },
  imgProfile: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    borderWidth: 2,
    borderColor: "white",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  txtName: {
    color: "white",
    fontSize: 14,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
  },
  status: {
    display: "flex",
    flexDirection: "row",
    columnGap: 5,
    alignItems: "center",
  },
  txtStatus: {
    color: "#ACB3BF",
    fontSize: 12,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
  },
  Messages: {
    width: "100%",
    height: 45,
    backgroundColor: "#50555C",
    position: "absolute",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
  },
  sendMessages: {
    flex: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "medium",
    fontFamily: "Poppins",
  },
  btnIcon: {
    width: 35,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
});
