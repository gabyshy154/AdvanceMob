import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type ProfileScreenNav = NativeStackNavigationProp<RootStackParamList, 'ProfileScreen'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNav>();
  const route = useRoute<any>();
  const token = route.params?.token;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else setLoading(false);
  }, [token]);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#1DB954"
          accessibilityLabel="Loading profile data"
        />
        <Text
          style={{ color: "#fff", marginTop: 10 }}
          accessibilityLabel="Loading your Spotify profile"
          accessible={true}
        >
          Loading profile...
        </Text>
      </View>
    );

  const userName = user?.display_name || "Unknown User";

  return (
    <ScrollView
      style={styles.container}
      accessibilityLabel="User profile screen"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* HEADER WITH BACK BUTTON AND TITLE */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            console.log('Back button pressed in ProfileScreen');
            navigation.goBack();
          }}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Navigate to the previous screen"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text
          style={styles.headerTitle}
          accessibilityRole="header"
          accessibilityLabel="Profile screen header"
        >
          Profile
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* PROFILE SECTION */}
      <View style={styles.profileSection}>
        <Image
          source={
            user?.images?.length
              ? { uri: user.images[0].url }
              : require("../assets/profile_placeholder.png")
          }
          style={styles.avatar}
          accessibilityLabel={`Profile picture of ${userName}`}
          accessible={true}
        />
        <Text
          style={styles.name}
          accessibilityRole="header"
          accessibilityLevel={2}
          accessibilityLabel={`User name: ${userName}`}
        >
          {userName}
        </Text>
        <Text
          style={styles.followInfo}
          accessibilityLabel="15 followers, 7 following"
          accessible={true}
        >
          <Text style={styles.bold}>15</Text>
          <Text> followers • </Text>
          <Text style={styles.bold}>7</Text>
          <Text> following</Text>
        </Text>

        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          accessibilityHint="Opens profile editing options"
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* PLAYLISTS SECTION */}
      <View style={styles.section}>
        <Text
          style={styles.sectionTitle}
          accessibilityRole="header"
          accessibilityLevel={2}
          accessibilityLabel="Playlists section"
        >
          Playlists
        </Text>

        {/* Sample playlists - replace with real data if available */}
        <TouchableOpacity
          style={styles.playlistItem}
          accessibilityRole="button"
          accessibilityLabel="Film,Make playlist, 0 saves"
          accessibilityHint="Tap to open this playlist"
        >
          <Image
            source={require("../assets/playlist_placeholder.jpg")}
            style={styles.playlistImage}
            accessibilityLabel="Film,Make playlist cover"
          />
          <View>
            <Text style={styles.playlistTitle}>Film,Make</Text>
            <Text style={styles.playlistSubtitle}>0 saves</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playlistItem}
          accessibilityRole="button"
          accessibilityLabel="get_off_dopamine playlist, 0 saves"
          accessibilityHint="Tap to open this playlist"
        >
          <Image
            source={require("../assets/playlist_placeholder.jpg")}
            style={styles.playlistImage}
            accessibilityLabel="get_off_dopamine playlist cover"
          />
          <View>
            <Text style={styles.playlistTitle}>get_off_dopamine</Text>
            <Text style={styles.playlistSubtitle}>0 saves</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playlistItem}
          accessibilityRole="button"
          accessibilityLabel="Gamin ft. the boys playlist, 0 saves"
          accessibilityHint="Tap to open this playlist"
        >
          <Image
            source={require("../assets/playlist_placeholder.jpg")}
            style={styles.playlistImage}
            accessibilityLabel="Gamin ft. the boys playlist cover"
          />
          <View>
            <Text style={styles.playlistTitle}>Gamin ft. the boys</Text>
            <Text style={styles.playlistSubtitle}>0 saves</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.seeAllButton}
          activeOpacity={0.7}
          onPress={() => {
            console.log('See all playlists pressed');
            navigation.navigate("PlaylistsScreen", { token });
          }}
          accessibilityRole="button"
          accessibilityLabel="See all playlists"
          accessibilityHint="Navigate to view all your playlists"
        >
          <Text style={styles.seeAllText}>See all playlists</Text>
        </TouchableOpacity>
      </View>

      {/* RECENTLY PLAYED ARTISTS */}
      <View style={styles.section}>
        <Text
          style={styles.sectionTitle}
          accessibilityRole="header"
          accessibilityLevel={2}
          accessibilityLabel="Recently played artists section"
        >
          Recently played artists
        </Text>

        <TouchableOpacity
          style={styles.artistItem}
          accessibilityRole="button"
          accessibilityLabel="Drake, 101,580,796 followers"
          accessibilityHint="Tap to view Drake's profile"
        >
          <Image
            source={require("../assets/artist_placeholder.jpg")}
            style={styles.artistImage}
            accessibilityLabel="Drake artist photo"
          />
          <View>
            <Text style={styles.artistName}>Drake</Text>
            <Text style={styles.artistFollowers}>101,580,796 followers</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.artistItem}
          accessibilityRole="button"
          accessibilityLabel="Tommy Richman, 925,880 followers"
          accessibilityHint="Tap to view Tommy Richman's profile"
        >
          <Image
            source={require("../assets/artist_placeholder.jpg")}
            style={styles.artistImage}
            accessibilityLabel="Tommy Richman artist photo"
          />
          <View>
            <Text style={styles.artistName}>Tommy Richman</Text>
            <Text style={styles.artistFollowers}>925,880 followers</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191414",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#191414",
    justifyContent: "center",
    alignItems: "center",
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
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  followInfo: {
    color: "#aaa",
    fontSize: 14,
    marginVertical: 5,
  },
  bold: {
    fontWeight: "bold",
    color: "#fff",
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginTop: 10,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: "#333",
  },
  playlistTitle: {
    color: "#fff",
    fontSize: 16,
  },
  playlistSubtitle: {
    color: "#aaa",
    fontSize: 13,
  },
  seeAllButton: {
    alignSelf: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 6,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeAllText: {
    color: "#fff",
    fontWeight: "bold",
  },
  artistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
  },
  artistImage: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    marginRight: 12,
    backgroundColor: "#333",
  },
  artistName: {
    color: "#fff",
    fontSize: 16,
  },
  artistFollowers: {
    color: "#aaa",
    fontSize: 13,
  },
});