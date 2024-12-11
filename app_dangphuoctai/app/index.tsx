import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Home from "./screens/homes/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Detail from "./screens/Detail";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import ForgotPassword from "./screens/ForgotPassword";
import OTPVerify from "./screens/OTPVerify";
import Profile from "./screens/Profile";
import Setting from "./screens/Setting";
import EditProfile from "./screens/EditProfile";
import PersonalChat from "./screens/PersonalChat";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import CommunityChat from "./screens/CommunityChat";
import CommunityDetail from "./screens/CommunityDetail";

const Stack = createNativeStackNavigator();
function App() {
  const [loaded, error] = useFonts({
    Sacramento: require("../assets/fonts/Sacramento.otf"),
    OpenSans: require("../assets/fonts/OpenSans-Regular.ttf"),
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    VarelaRound: require("../assets/fonts/VarelaRound-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  if (!loaded && !error) {
    return null;
  }
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="PersonalChat" component={PersonalChat} />
      <Stack.Screen name="CommunityChat" component={CommunityChat} />
      <Stack.Screen name="CommunityDetail" component={CommunityDetail} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="Details" component={Detail} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OTPVerify" component={OTPVerify} />
    </Stack.Navigator>
  );
}

export default App;
