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
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type PlaylistsNav = NativeStackNavigationProp<RootStackParamList, "PlaylistsScreen">;

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

interface AnimatedPlaylistItemProps {
  item: string;
  index: number;
  onRemove: (item: string) => void;
  colors: { text: string; bg: string; removeBg: string; icon: string };
}

const AnimatedPlaylistItem = memo(({ item, index, onRemove, colors }: AnimatedPlaylistItemProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: index * 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      onRemove(item);
    });
  };

  return (
    <Animated.View
      style={[
        styles.playlistItem,
        { backgroundColor: colors.bg, opacity: fadeAnim, transform: [{ translateX: slideAnim }, { scale: scaleAnim }] },
      ]}
    >
      <View style={styles.playlistContent}>
        <View style={[styles.playlistIcon, { backgroundColor: colors.icon + "33" }]}>
          <Ionicons name="musical-notes" size={20} color={colors.icon} />
        </View>
        <Text style={[styles.playlistText, { color: colors.text }]}>{item}</Text>
      </View>
      <TouchableOpacity onPress={handleRemove} style={[styles.removeButton, { backgroundColor: colors.removeBg }]} activeOpacity={0.7}>
        <Ionicons name="trash" size={22} color="#ff4444" />
      </TouchableOpacity>
    </Animated.View>
  );
});

const mockRecentlyPlayed = [
  { id: "1", title: "R&B Mix", image: require("../assets/playlist1.jpg") },
  { id: "2", title: "I'm Drunk, I Love You OST", image: require("../assets/playlist2.jpg") },
  { id: "3", title: "Before Trilogy", image: require("../assets/playlist3.jpg") },
];

const mockMadeForYou = [
  { id: "1", title: "Release Radar", subtitle: "Catch all the latest music...", image: require("../assets/release_radar.jpg") },
  { id: "2", title: "Discover Weekly", subtitle: "Your shortcut to hidden gems...", image: require("../assets/discover_weekly.jpg") },
];

const PlaylistsScreen = () => {
  const navigation = useNavigation<PlaylistsNav>();
  const route = useRoute<any>();
  const token = route.params?.token ?? "No Token";

  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState("");
  const containerFadeAnim = useRef(new Animated.Value(0)).current;
  const addButtonScaleAnim = useRef(new Animated.Value(1)).current;

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const darkMode = themeMode === "dark";

  const colors = {
    text: darkMode ? "#fff" : "#191414",
    subtitle: darkMode ? "#aaa" : "#555",
    bg: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    inputBg: darkMode ? "#333" : "#eee",
    icon: "#1DB954",
    addButtonBg: "#1DB954",
    undoRedoBg: darkMode ? "#444" : "#ddd",
    undoRedoText: darkMode ? "#fff" : "#191414",
    placeholder: darkMode ? "#888" : "#555",
    removeBg: darkMode ? "rgba(255,68,68,0.2)" : "rgba(255,68,68,0.1)",
    cardBg: darkMode ? "#333" : "#f0f0f0",
    cardTitle: darkMode ? "#fff" : "#191414",
    cardSubtitle: darkMode ? "#ccc" : "#555",
    borderColor: darkMode ? "#333" : "#ccc",
  };

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("playlists");
        if (saved) dispatch({ type: "SET", payload: JSON.parse(saved) });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("playlists", JSON.stringify(state.playlists)).catch(console.log);
  }, [state.playlists]);

  useEffect(() => {
    Animated.timing(containerFadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const handleAdd = () => {
    if (input.trim()) {
      Animated.sequence([
        Animated.timing(addButtonScaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
        Animated.timing(addButtonScaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
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
        <View style={[styles.card, { width: cardSize, backgroundColor: colors.cardBg }]}>
          <Image source={item.image} style={styles.cardImage} />
          <Text style={[styles.cardTitle, { color: colors.cardTitle }]} numberOfLines={1}>{item.title}</Text>
          {item.subtitle && <Text style={[styles.cardSubtitle, { color: colors.cardSubtitle }]} numberOfLines={1}>{item.subtitle}</Text>}
        </View>
      )}
    />
  );

  const renderPlaylistItem = ({ item, index }: { item: string; index: number }) => (
    <AnimatedPlaylistItem item={item} index={index} onRemove={(itm) => dispatch({ type: "REMOVE", payload: itm })} colors={colors} />
  );

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#191414" : "#fff" }]}>
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Your Playlists</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("ProfileScreen", { token })} activeOpacity={0.7}>
            <Ionicons name="person-circle-outline" size={30} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("SettingsScreen")} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.inputRow, { opacity: containerFadeAnim }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="Add new playlist..."
            placeholderTextColor={colors.placeholder}
            value={input}
            onChangeText={setInput}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
          <Animated.View style={{ transform: [{ scale: addButtonScaleAnim }] }}>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.addButtonBg }]} onPress={handleAdd} activeOpacity={0.8}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.undoRedoRow, { opacity: containerFadeAnim }]}>
          <TouchableOpacity
            style={[styles.undoRedoButton, { backgroundColor: colors.undoRedoBg }, state.past.length === 0 && styles.disabledButton]}
            disabled={state.past.length === 0}
            onPress={() => dispatch({ type: "UNDO" })}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-undo" size={20} color={colors.undoRedoText} />
            <Text style={[styles.undoRedoText, { color: colors.undoRedoText }]}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.undoRedoButton, { backgroundColor: colors.undoRedoBg }, state.future.length === 0 && styles.disabledButton]}
            disabled={state.future.length === 0}
            onPress={() => dispatch({ type: "REDO" })}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-redo" size={20} color={colors.undoRedoText} />
            <Text style={[styles.undoRedoText, { color: colors.undoRedoText }]}>Redo</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.playlistContainer}>
          {state.playlists.length > 0 ? (
            <FlatList data={state.playlists} keyExtractor={(item, index) => `${item}-${index}`} renderItem={renderPlaylistItem} scrollEnabled={false} removeClippedSubviews={false} />
          ) : (
            <Animated.View style={{ opacity: containerFadeAnim }}>
              <Text style={[styles.emptyText, { color: colors.subtitle }]}>No playlists yet. Add one above!</Text>
            </Animated.View>
          )}
        </View>

        <Animated.View style={{ opacity: containerFadeAnim }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recently played</Text>
          {renderHorizontalList(mockRecentlyPlayed, 120)}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Made for you</Text>
          {renderHorizontalList(mockMadeForYou, 150)}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended for you</Text>
          {renderHorizontalList(mockRecentlyPlayed, 150)}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default PlaylistsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 12, paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingHorizontal: 4 },
  screenTitle: { fontSize: 28, fontWeight: "bold" },
  headerIcons: { flexDirection: "row" },
  iconButton: { padding: 10, marginLeft: 8, borderRadius: 20, backgroundColor: "rgba(128,128,128,0.2)" },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  input: { flex: 1, height: 45, borderRadius: 25, paddingHorizontal: 15, fontSize: 16 },
  addButton: { marginLeft: 10, padding: 12, borderRadius: 25, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  undoRedoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  undoRedoButton: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  disabledButton: { opacity: 0.5 },
  undoRedoText: { marginLeft: 6 },
  playlistContainer: { marginBottom: 20 },
  playlistItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, paddingHorizontal: 12, marginVertical: 2, borderRadius: 12, borderBottomWidth: 1 },
  playlistContent: { flexDirection: "row", alignItems: "center", flex: 1 },
  playlistIcon: { marginRight: 12, padding: 8, borderRadius: 20 },
  playlistText: { fontSize: 16, flex: 1 },
  removeButton: { padding: 8, borderRadius: 15 },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 16, fontStyle: "italic" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  card: { marginRight: 12, borderRadius: 8, overflow: "hidden" },
  cardImage: { width: "100%", height: 120, marginBottom: 6, borderRadius: 8, backgroundColor: "#333" },
  cardTitle: { fontSize: 14, fontWeight: "600" },
  cardSubtitle: { fontSize: 12 },
});