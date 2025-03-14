import { View, Text, Button, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { POST_LOGIN } from "../api/APIService";

const aaaaaaa = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("SignIn");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View>
      <Button title="Login with Google" />
    </View>
  );
};

export default aaaaaaa;
