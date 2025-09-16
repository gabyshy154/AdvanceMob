import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type SettingsScreenNav = NativeStackNavigationProp<RootStackParamList, 'SettingsScreen'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNav>();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      {/* HEADER WITH BACK BUTTON */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            console.log('Back button pressed in Settings');
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 32 }} /> {/* Placeholder for spacing */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* STATIC SETTINGS LIST */}
        <View style={styles.item}>
          <Text style={styles.itemTitle}>Mobile Data</Text>
          <Text style={styles.itemSubtitle}>232 kB used this month</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>Storage</Text>
          <Text style={styles.itemSubtitle}>52 MB used by app</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>Audio Settings</Text>
          <Text style={styles.itemSubtitle}>Audio quality: High</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>Download Settings</Text>
          <Text style={styles.itemSubtitle}>Downloading on Wi-Fi only</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>Privacy Settings</Text>
          <Text style={styles.itemSubtitle}>Manage sharing your listening activity</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>Explicit Content</Text>
          <Text style={styles.itemSubtitle}>Explicit content allowed</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>Account</Text>
          <Text style={styles.itemSubtitle}>Free account</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>About</Text>
          <Text style={styles.itemSubtitle}>App version 1.0.0</Text>
        </View>

        {/* SWITCHES (NOTIFICATIONS & DARK MODE) */}
        <View style={styles.itemSwitch}>
          <Text style={styles.itemTitle}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: "#1DB954", false: "#555" }}
          />
        </View>

        <View style={styles.itemSwitch}>
          <Text style={styles.itemTitle}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ true: "#1DB954", false: "#555" }}
          />
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={() => {
            console.log('Logout button pressed');
            navigation.navigate("Spotify");
          }}
        >
          <View style={styles.logoutContent}>
            <Ionicons name="power" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191414",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 10,
  },
  backButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
    paddingVertical: 14,
  },
  itemTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  itemSubtitle: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 3,
  },
  itemSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
    paddingVertical: 14,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#1DB954",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});