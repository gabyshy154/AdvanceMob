import React, { useReducer, useEffect, useRef, useState, memo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

// --- TYPES ---
type PlaylistsNav = NativeStackNavigationProp<
  RootStackParamList,
  "PlaylistsScreen"
>;

type State = {
  playlists: string[];
  past: string[][];
  future: string[][];
};

type Action =
  | { type: "ADD"; payload: string }
  | { type: "REMOVE"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET"; payload: string[] };

// --- REDUCER ---
const initialState: State = {
  playlists: [],
  past: [],
  future: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET":
      return { ...state, playlists: action.payload };
    case "ADD":
      return {
        past: [...state.past, state.playlists],
        playlists: [...state.playlists, action.payload],
        future: [],
      };
    case "REMOVE":
      return {
        past: [...state.past, state.playlists],
        playlists: state.playlists.filter((p) => p !== action.payload),
        future: [],
      };
    case "UNDO":
      if (state.past.length === 0) return state;
      const prev = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        playlists: prev,
        future: [state.playlists, ...state.future],
      };
    case "REDO":
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.playlists],
        playlists: next,
        future: state.future.slice(1),
      };
    default:
      return state;
  }
}

// --- ANIMATED PLAYLIST ITEM COMPONENT ---
interface AnimatedPlaylistItemProps {
  item: string;
  index: number;
  onRemove: (item: string) => void;
}

const AnimatedPlaylistItem = memo(({ item, index, onRemove }: AnimatedPlaylistItemProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100, // Stagger animation
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRemove = () => {
    // Exit animation before removal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(item);
    });
  };

  return (
    <Animated.View
      style={[
        styles.playlistItem,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <View style={styles.playlistContent}>
        <View style={styles.playlistIcon}>
          <Ionicons name="musical-notes" size={20} color="#1DB954" />
        </View>
        <Text style={styles.playlistText}>{item}</Text>
      </View>
      <TouchableOpacity
        onPress={handleRemove}
        style={styles.removeButton}
        activeOpacity={0.7}
      >
        <Ionicons name="trash" size={22} color="#ff4444" />
      </TouchableOpacity>
    </Animated.View>
  );
});

// --- MOCK DATA ---
const mockRecentlyPlayed = [
  {
    id: "1",
    title: "R&B Mix",
    image: "https://i.scdn.co/image/ab67616d0000b2734b8a4cdedexample1",
  },
  {
    id: "2",
    title: "I'm Drunk, I Love You OST",
    image: "https://i.scdn.co/image/ab67616d0000b2734b8a4cdedexample2",
  },
  {
    id: "3",
    title: "Before Trilogy",
    image: "https://i.scdn.co/image/ab67616d0000b2734b8a4cdedexample3",
  },
];

const mockMadeForYou = [
  {
    id: "1",
    title: "Release Radar",
    subtitle: "Catch all the latest music...",
    image: "https://i.scdn.co/image/ab67616d0000b2734b8a4cdedexample4",
  },
  {
    id: "2",
    title: "Discover Weekly",
    subtitle: "Your shortcut to hidden gems...",
    image: "https://i.scdn.co/image/ab67616d0000b2734b8a4cdedexample5",
  },
];

// --- MAIN COMPONENT ---
const PlaylistsScreen = () => {
  const navigation = useNavigation<PlaylistsNav>();
  const route = useRoute<any>();
  const token = route.params?.token ?? "No Token";

  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState("");
  const containerFadeAnim = useRef(new Animated.Value(0)).current;
  const addButtonScaleAnim = useRef(new Animated.Value(1)).current;

  // Load playlists from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("playlists");
        if (saved) {
          dispatch({ type: "SET", payload: JSON.parse(saved) });
        }
      } catch (error) {
        console.log("Failed to load playlists:", error);
      }
    })();
  }, []);

  // Save playlists whenever they change
  useEffect(() => {
    AsyncStorage.setItem("playlists", JSON.stringify(state.playlists))
      .catch(error => console.log("Failed to save playlists:", error));
  }, [state.playlists]);

  // Animate container on mount
  useEffect(() => {
    Animated.timing(containerFadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAdd = () => {
    if (input.trim()) {
      // Animate add button press
      Animated.sequence([
        Animated.timing(addButtonScaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(addButtonScaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      dispatch({ type: "ADD", payload: input.trim() });
      setInput("");
    }
  };

  const renderHorizontalList = (data: any[], cardSize: number) => (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={[styles.card, { width: cardSize }]}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          )}
        </View>
      )}
    />
  );

  const renderPlaylistItem = ({ item, index }: { item: string; index: number }) => (
    <AnimatedPlaylistItem
      item={item}
      index={index}
      onRemove={(itemToRemove) => dispatch({ type: "REMOVE", payload: itemToRemove })}
    />
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Your Playlists</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("ProfileScreen", { token })}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("SettingsScreen")}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY SCROLL */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* INPUT + ADD BUTTON */}
        <Animated.View style={[styles.inputRow, { opacity: containerFadeAnim }]}>
          <TextInput
            style={styles.input}
            placeholder="Add new playlist..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
          <Animated.View style={{ transform: [{ scale: addButtonScaleAnim }] }}>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.8}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* UNDO/REDO BUTTONS */}
        <Animated.View style={[styles.undoRedoRow, { opacity: containerFadeAnim }]}>
          <TouchableOpacity
            style={[
              styles.undoRedoButton,
              state.past.length === 0 && styles.disabledButton,
            ]}
            disabled={state.past.length === 0}
            onPress={() => dispatch({ type: "UNDO" })}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-undo" size={20} color="#fff" />
            <Text style={styles.undoRedoText}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.undoRedoButton,
              state.future.length === 0 && styles.disabledButton,
            ]}
            disabled={state.future.length === 0}
            onPress={() => dispatch({ type: "REDO" })}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-redo" size={20} color="#fff" />
            <Text style={styles.undoRedoText}>Redo</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ANIMATED PLAYLIST LIST */}
        <View style={styles.playlistContainer}>
          {state.playlists.length > 0 ? (
            <FlatList
              data={state.playlists}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={renderPlaylistItem}
              scrollEnabled={false}
              removeClippedSubviews={false}
            />
          ) : (
            <Animated.View style={{ opacity: containerFadeAnim }}>
              <Text style={styles.emptyText}>No playlists yet. Add one above!</Text>
            </Animated.View>
          )}
        </View>

        {/* MOCK SECTIONS */}
        <Animated.View style={{ opacity: containerFadeAnim }}>
          <Text style={styles.sectionTitle}>Recently played</Text>
          {renderHorizontalList(mockRecentlyPlayed, 120)}

          <Text style={styles.sectionTitle}>Made for you</Text>
          {renderHorizontalList(mockMadeForYou, 150)}

          <Text style={styles.sectionTitle}>Recommended for you</Text>
          {renderHorizontalList(mockRecentlyPlayed, 150)}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default PlaylistsScreen;

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191414",
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  screenTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 10,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: "#333",
    borderRadius: 25,
    paddingHorizontal: 15,
    color: "#fff",
    fontSize: 16,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#1DB954",
    padding: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  undoRedoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  undoRedoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#444",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.5
  },
  undoRedoText: {
    color: "#fff",
    marginLeft: 6
  },
  playlistContainer: {
    marginBottom: 20,
  },
  playlistItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginVertical: 2,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  playlistContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  playlistIcon: {
    marginRight: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(29, 185, 84, 0.2)",
  },
  playlistText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  removeButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: "rgba(255, 68, 68, 0.2)",
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    fontStyle: "italic",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    marginRight: 12
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#333",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600"
  },
  cardSubtitle: {
    color: "#ccc",
    fontSize: 12
  },
});