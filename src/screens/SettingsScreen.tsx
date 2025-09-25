import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setTheme } from "../store/themeSlice";

type SettingsScreenNav = NativeStackNavigationProp<RootStackParamList, "SettingsScreen">;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNav>();
  const dispatch = useDispatch();

  // Redux state for theme
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  // Local state for notifications
  const [notifications, setNotifications] = useState(true);

  // Determine colors based on theme
  const darkMode = themeMode === "dark";
  const bgColor = darkMode ? "#191414" : "#fff";
  const textColor = darkMode ? "#fff" : "#191414";
  const subtitleColor = darkMode ? "#aaa" : "#555";
  const iconColor = darkMode ? "#fff" : "#191414";

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* HEADER WITH BACK BUTTON */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={iconColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* STATIC SETTINGS LIST */}
        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: textColor }]}>Mobile Data</Text>
          <Text style={[styles.itemSubtitle, { color: subtitleColor }]}>232 kB used this month</Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: textColor }]}>Storage</Text>
          <Text style={[styles.itemSubtitle, { color: subtitleColor }]}>52 MB used by app</Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: textColor }]}>Audio Settings</Text>
          <Text style={[styles.itemSubtitle, { color: subtitleColor }]}>Audio quality: High</Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: textColor }]}>Download Settings</Text>
          <Text style={[styles.itemSubtitle, { color: subtitleColor }]}>Downloading on Wi-Fi only</Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: textColor }]}>Privacy Settings</Text>
          <Text style={[styles.itemSubtitle, { color: subtitleColor }]}>Manage sharing your listening activity</Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: textColor }]}>Explicit Content</Text>
          <Text style={[styles.itemSubtitle, { color: subtitleColor }]}>Explicit content allowed</Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: textColor }]}>Account</Text>
          <Text style={[styles.itemSubtitle, { color: subtitleColor }]}>Free account</Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: textColor }]}>About</Text>
          <Text style={[styles.itemSubtitle, { color: subtitleColor }]}>App version 1.0.0</Text>
        </View>

        {/* SWITCHES */}
        <View style={styles.itemSwitch}>
          <Text style={[styles.itemTitle, { color: textColor }]}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: "#1DB954", false: "#555" }}
          />
        </View>

        <View style={styles.itemSwitch}>
          <Text style={[styles.itemTitle, { color: textColor }]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={(val) => dispatch(setTheme(val ? "dark" : "light"))}
            trackColor={{ true: "#1DB954", false: "#555" }}
          />
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: "#1DB954" }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Spotify")}
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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, marginBottom: 10 },
  backButton: { padding: 12, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)" },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  item: { borderBottomWidth: 0.5, borderBottomColor: "#333", paddingVertical: 14 },
  itemTitle: { fontSize: 16, fontWeight: "500" },
  itemSubtitle: { fontSize: 13, marginTop: 3 },
  itemSwitch: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: "#333", paddingVertical: 14 },
  logoutButton: { marginTop: 30, borderRadius: 25, paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  logoutContent: { flexDirection: "row", alignItems: "center" },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
