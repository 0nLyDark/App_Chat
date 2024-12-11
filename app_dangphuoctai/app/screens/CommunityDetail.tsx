import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const CommunityDetail = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" color={"#29B6F6"} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.viewHeaderCenter}>
          <TouchableOpacity style={styles.viewHeaderCenter}>
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
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.contentTop}>
            <Text style={styles.txtTitle}>About</Text>
            <Text style={styles.txt}>
              Startup is the industry norm for those working with new and small
              businesses, as well as being more popular in general (which is why
              we opted for it)...more
            </Text>
            <View style={styles.flexSpace}>
              <Text style={styles.txtTitle}>Term & Conditions </Text>
              <Text style={styles.txtTitle}>See more</Text>
            </View>
            <View style={styles.flexSpace}>
              <Text style={styles.txtTitle}>Notification</Text>
              <Text style={styles.txtTitle}>Notification</Text>
            </View>
          </View>
          <View style={styles.Participants}>
            <Text style={styles.txtTitle}>Participants</Text>
            {Array(8)
              .fill(null)
              .map((__, index) => (
                <View
                  style={{
                    width: "auto",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity style={styles.member}>
                    <View style={styles.imgMember}>
                      <Image
                        source={require("../../assets/images/img_community.png")}
                      />
                    </View>
                    <Text style={styles.txtMember}>Tony Stark</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CommunityDetail;

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
    paddingHorizontal: 20,
    paddingBottom: 55,
    maxWidth: 425,
    marginHorizontal: "auto",
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
  btnIcon: {
    width: 35,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  contentTop: {
    paddingVertical: 5,
  },
  flexSpace: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  txtTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "medium",
    fontFamily: "Poppins",
    marginVertical: 5,
  },
  txt: {
    color: "#ACB3BF",
    fontSize: 12,
    fontWeight: "semibold",
    fontFamily: "OpenSans",
  },
  Participants: {},
  member: {
    margin: 5,
    width: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  imgMember: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  txtMember: {
    color: "white",
    fontSize: 18,
    fontWeight: "medium",
    fontFamily: "OpenSans",
    marginLeft: 10,
  },
});
