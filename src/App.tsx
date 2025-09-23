import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

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

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState<any>();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY);
        if (savedState) {
          setInitialState(JSON.parse(savedState));
        }
      } catch (e) {
        console.log('Failed to load navigation state', e);
      }
      setIsReady(true);
    };

    restoreState();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <Stack.Navigator
        initialRouteName="MyProfile"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="MyProfile"
          component={MyProfile}
          options={{ accessibilityLabel: 'My Profile Screen' }}
        />
        <Stack.Screen
          name="ProfileDetails"
          component={ProfileDetails}
          options={{ accessibilityLabel: 'Profile Details Screen' }}
        />
        <Stack.Screen
          name="Spotify"
          component={Spotify}
          options={{ accessibilityLabel: 'Spotify Login Screen' }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ accessibilityLabel: 'Sign Up Screen' }}
        />
        <Stack.Screen
          name="PlaylistsScreen"
          component={PlaylistsScreen}
          options={{ accessibilityLabel: 'Playlists Screen' }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ accessibilityLabel: 'User Profile Screen' }}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{ accessibilityLabel: 'Settings Screen' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
