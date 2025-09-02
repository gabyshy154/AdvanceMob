import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyProfile from './screens/MyProfile';
import ProfileDetails from './screens/ProfileDetails';
import Spotify from './screens/Spotify';

export type RootStackParamList = {
  MyProfile: undefined;
  ProfileDetails: undefined;
  Spotify: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MyProfile">
        <Stack.Screen
          name="MyProfile"
          component={MyProfile}
          options={{ title: 'My Profile' }}
        />
        <Stack.Screen
          name="ProfileDetails"
          component={ProfileDetails}
          options={{ title: 'Profile Details' }}
        />
        <Stack.Screen
          name="Spotify"
          component={Spotify}
          options={{ title: 'Spotify Sign In' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
