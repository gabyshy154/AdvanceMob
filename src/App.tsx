import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyProfile from './screens/MyProfile';
import ProfileDetails from './screens/ProfileDetails';
import Spotify from './screens/Spotify';
import SignUpScreen from './screens/SignUpScreen';
import PlaylistsScreen from './screens/PlaylistsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

export type RootStackParamList = {
  MyProfile: undefined;
  ProfileDetails: undefined;
  Spotify: undefined;
  SignUp: undefined;
  PlaylistsScreen: { token?: string };
  ProfileScreen: { token?: string };
  SettingsScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MyProfile"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MyProfile" component={MyProfile} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
        <Stack.Screen name="Spotify" component={Spotify} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="PlaylistsScreen" component={PlaylistsScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}