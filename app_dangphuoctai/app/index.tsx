import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Home from "./screens/homes/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import ForgotPassword from "./screens/Password/ForgotPassword";
import OTPVerify from "./screens/OTPVerify";
import Profile from "./screens/Profile";
import Setting from "./screens/Setting";
import EditProfile from "./screens/EditProfile";
import PersonalChat from "./screens/chats/PersonalChat";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import CommunityChat from "./screens/chats/CommunityChat";
import CommunityDetail from "./screens/chats/CommunityDetail";

import Search from "./screens/Search";
import InfoContact from "./screens/friends/InfoContact";
import ResetPassword from "./screens/Password/ResetPassword";
import aaaaaaa from "./screens/aaaaaaa";
import NewGroup from "./screens/chats/NewGroup";
import { AppProvider } from "./context/AppContext";
import AddMemberGroup from "./screens/chats/AddMemberGroup";
import GroupMembers from "./screens/chats/GroupMembers";

const Stack = createNativeStackNavigator();
function App() {
  // const [loaded, error] = useFonts({
  //   Sacramento: require("../assets/fonts/Sacramento.otf"),
  //   OpenSans: require("../assets/fonts/OpenSans-Regular.ttf"),
  //   Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
  //   VarelaRound: require("../assets/fonts/VarelaRound-Regular.ttf"),
  // });

  // useEffect(() => {
  //   if (loaded || error) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded, error]);
  // if (!loaded && !error) {
  //   return null;
  // }
  return (
    <AppProvider>
      <Stack.Navigator
        initialRouteName="aaaaaaa"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="aaaaaaa" component={aaaaaaa} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="PersonalChat" component={PersonalChat} />
        <Stack.Screen name="CommunityChat" component={CommunityChat} />
        <Stack.Screen name="InfoContact" component={InfoContact} />
        <Stack.Screen name="CommunityDetail" component={CommunityDetail} />
        <Stack.Screen name="GroupMembers" component={GroupMembers} />
        <Stack.Screen name="NewGroup" component={NewGroup} />
        <Stack.Screen name="AddMemberGroup" component={AddMemberGroup} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="OTPVerify" component={OTPVerify} />
      </Stack.Navigator>
    </AppProvider>
  );
}

export default App;
