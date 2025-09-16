import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';
import type { DrawerParamList } from '../App';

const Drawer = createDrawerNavigator<DrawerParamList>();

interface DrawerNavigatorProps {
  token?: string;
}

const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({ token }) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: { backgroundColor: '#191414', width: 240 },
        drawerActiveTintColor: '#1DB954',
        drawerInactiveTintColor: '#fff',
      }}
    >
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ token }}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Playlists"
        component={PlaylistsScreen}
        initialParams={{ token }}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="musical-notes-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
