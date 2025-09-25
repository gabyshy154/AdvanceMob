import React, { useEffect, useState, useRef, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type ProfileScreenNav = NativeStackNavigationProp<RootStackParamList, 'ProfileScreen'>;

// --- CONSTANTS ---
const GENRES = ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop'];
const PROFILE_CACHE_KEY = 'user_profile_cache';

const GENRE_IMAGES = {
  Pop: 'https://via.placeholder.com/120x120/FF69B4/FFFFFF?text=POP',
  Rock: 'https://via.placeholder.com/120x120/8B0000/FFFFFF?text=ROCK',
  Jazz: 'https://via.placeholder.com/120x120/4169E1/FFFFFF?text=JAZZ',
  Classical: 'https://via.placeholder.com/120x120/800080/FFFFFF?text=CLASSICAL',
  'Hip-Hop': 'https://via.placeholder.com/120x120/32CD32/FFFFFF?text=HIP-HOP',
  '': 'https://via.placeholder.com/120x120/808080/FFFFFF?text=USER',
};

// --- VALIDATION FUNCTIONS ---
const validateUsername = (username: string): string => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 20) return 'Username must be less than 20 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return '';
};

const validateEmail = (email: string): string => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

const validateGenre = (genre: string): string => {
  if (!genre) return 'Please select a favorite genre';
  if (!GENRES.includes(genre)) return 'Invalid genre selection';
  return '';
};

// --- TYPES ---
interface ProfileData {
  username: string;
  email: string;
  genre: string;
}

interface ValidationErrors {
  username: string;
  email: string;
  genre: string;
}

// --- ANIMATED INPUT COMPONENT ---
interface AnimatedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error: string;
  placeholder: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  icon: string;
}

const AnimatedInput = memo(({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  autoCapitalize = 'none',
  keyboardType = 'default',
  icon
}: AnimatedInputProps) => {
  const shakeAnim = useSharedValue(0);
  const errorFadeAnim = useSharedValue(0);

  useEffect(() => {
    if (error) {
      // Shake animation for error
      shakeAnim.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      // Fade in error message
      errorFadeAnim.value = withTiming(1, { duration: 300 });
    } else {
      errorFadeAnim.value = withTiming(0, { duration: 200 });
    }
  }, [error]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnim.value }],
  }));

  const errorStyle = useAnimatedStyle(() => ({
    opacity: errorFadeAnim.value,
    maxHeight: errorFadeAnim.value * 25,
  }));

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Animated.View style={[styles.inputWrapper, shakeStyle]}>
        <View style={styles.inputRow}>
          <Ionicons name={icon as any} size={20} color="#1DB954" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#888"
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
          />
          {!error && value ? (
            <Ionicons name="checkmark-circle" size={20} color="#1DB954" />
          ) : error ? (
            <Ionicons name="close-circle" size={20} color="#ff4444" />
          ) : null}
        </View>
      </Animated.View>
      <Animated.View style={[styles.errorContainer, errorStyle]}>
        <Text style={styles.errorText}>{error}</Text>
      </Animated.View>
    </View>
  );
});

// --- PROFILE PREVIEW COMPONENT ---
interface ProfilePreviewProps {
  profileData: ProfileData;
  isEditing: boolean;
}

const ProfilePreview = memo(({ profileData, isEditing }: ProfilePreviewProps) => {
  const fadeAnim = useSharedValue(1);
  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    if (isEditing) {
      fadeAnim.value = withTiming(0.8, { duration: 200 });
      scaleAnim.value = withTiming(0.95, { duration: 200 });
    } else {
      fadeAnim.value = withSpring(1, { damping: 15 });
      scaleAnim.value = withSpring(1, { damping: 15 });
    }
  }, [isEditing]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }));

  const imageUri = GENRE_IMAGES[profileData.genre as keyof typeof GENRE_IMAGES] || GENRE_IMAGES[''];

  return (
    <Animated.View style={[styles.profileSection, animatedStyle]}>
      <Image
        source={{ uri: imageUri }}
        style={styles.avatar}
        accessibilityLabel={`Profile picture for ${profileData.genre || 'user'} genre`}
      />
      <Text style={styles.name}>
        {profileData.username || 'Your Username'}
      </Text>
      <Text style={styles.email}>
        {profileData.email || 'your.email@example.com'}
      </Text>
      <View style={styles.genreContainer}>
        <Ionicons name="musical-note" size={16} color="#1DB954" />
        <Text style={styles.genreText}>
          {profileData.genre || 'Select Genre'}
        </Text>
      </View>
      <Text style={styles.followInfo}>
        <Text style={styles.bold}>15</Text>
        <Text> followers • </Text>
        <Text style={styles.bold}>7</Text>
        <Text> following</Text>
      </Text>
    </Animated.View>
  );
});

// --- MAIN COMPONENT ---
const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNav>();
  const route = useRoute<any>();
  const token = route.params?.token;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    email: '',
    genre: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({
    username: '',
    email: '',
    genre: '',
  });

  const editButtonScale = useSharedValue(1);
  const saveButtonScale = useSharedValue(1);

  // Load user data and cached profile data
  useEffect(() => {
    loadData();
  }, [token]);

  // Cache profile data whenever it changes
  useEffect(() => {
    if (!loading) {
      cacheProfileData();
    }
  }, [profileData, loading]);

  const loadData = async () => {
    try {
      // Load cached profile data
      const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
      if (cached) {
        const parsedData = JSON.parse(cached);
        setProfileData(parsedData);
      }

      // Load Spotify user data if token exists
      if (token) {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await response.json();
        setUser(userData);

        // If no cached data but we have Spotify data, initialize with it
        if (!cached && userData) {
          setProfileData({
            username: userData.display_name || '',
            email: userData.email || '',
            genre: '',
          });
        }
      }
    } catch (error) {
      console.log('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cacheProfileData = async () => {
    try {
      await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profileData));
    } catch (error) {
      console.log('Failed to cache profile data:', error);
    }
  };

  const validateField = (field: keyof ProfileData, value: string): string => {
    switch (field) {
      case 'username':
        return validateUsername(value);
      case 'email':
        return validateEmail(value);
      case 'genre':
        return validateGenre(value);
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));

    // Real-time validation
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {
      username: validateUsername(profileData.username),
      email: validateEmail(profileData.email),
      genre: validateGenre(profileData.genre),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleEdit = () => {
    editButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    setIsEditing(true);
  };

  const handleSave = () => {
    saveButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    if (validateAllFields()) {
      Alert.alert(
        'Profile Updated!',
        'Your profile has been successfully updated.',
        [
          {
            text: 'OK',
            onPress: () => setIsEditing(false),
          },
        ]
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset validation errors
    setErrors({ username: '', email: '', genre: '' });
  };

  const editButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: editButtonScale.value }],
  }));

  const saveButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveButtonScale.value }],
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  const isFormValid = !Object.values(errors).some(error => error !== '') &&
                     Object.values(profileData).every(value => value !== '');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* PROFILE PREVIEW */}
      <ProfilePreview profileData={profileData} isEditing={isEditing} />

      {/* EDIT BUTTON OR FORM */}
      {!isEditing ? (
        <Animated.View style={[styles.editButtonContainer, editButtonStyle]}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="pencil" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Edit Your Profile</Text>

          <AnimatedInput
            label="Username"
            value={profileData.username}
            onChangeText={(text) => handleInputChange('username', text)}
            error={errors.username}
            placeholder="Enter your username"
            icon="person"
          />

          <AnimatedInput
            label="Email"
            value={profileData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            error={errors.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            icon="mail"
          />

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Favorite Genre</Text>
            <View style={styles.inputRow}>
              <Ionicons name="musical-notes" size={20} color="#1DB954" style={styles.inputIcon} />
              <View style={[styles.pickerWrapper, errors.genre ? styles.inputError : null]}>
                <Picker
                  selectedValue={profileData.genre}
                  onValueChange={(value) => handleInputChange('genre', value)}
                  style={styles.picker}
                  dropdownIconColor="#1DB954"
                >
                  <Picker.Item label="Select a genre..." value="" />
                  {GENRES.map((genre) => (
                    <Picker.Item key={genre} label={genre} value={genre} />
                  ))}
                </Picker>
              </View>
              {!errors.genre && profileData.genre ? (
                <Ionicons name="checkmark-circle" size={20} color="#1DB954" />
              ) : errors.genre ? (
                <Ionicons name="close-circle" size={20} color="#ff4444" />
              ) : null}
            </View>
            {errors.genre ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.genre}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <Animated.View style={saveButtonStyle}>
              <TouchableOpacity
                style={[styles.saveButton, isFormValid ? styles.saveButtonActive : styles.saveButtonInactive]}
                onPress={handleSave}
                disabled={!isFormValid}
              >
                <Text style={[styles.saveText, isFormValid ? styles.saveTextActive : styles.saveTextInactive]}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      )}

      {/* PLAYLISTS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Playlists</Text>

        <TouchableOpacity style={styles.playlistItem}>
          <Image
            source={require("../assets/playlist_placeholder.jpg")}
            style={styles.playlistImage}
          />
          <View>
            <Text style={styles.playlistTitle}>Film,Make</Text>
            <Text style={styles.playlistSubtitle}>0 saves</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playlistItem}>
          <Image
            source={require("../assets/playlist_placeholder.jpg")}
            style={styles.playlistImage}
          />
          <View>
            <Text style={styles.playlistTitle}>get_off_dopamine</Text>
            <Text style={styles.playlistSubtitle}>0 saves</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playlistItem}>
          <Image
            source={require("../assets/playlist_placeholder.jpg")}
            style={styles.playlistImage}
          />
          <View>
            <Text style={styles.playlistTitle}>Gamin ft. the boys</Text>
            <Text style={styles.playlistSubtitle}>0 saves</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => navigation.navigate("PlaylistsScreen", { token })}
        >
          <Text style={styles.seeAllText}>See all playlists</Text>
        </TouchableOpacity>
      </View>

      {/* RECENTLY PLAYED ARTISTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently played artists</Text>

        <TouchableOpacity style={styles.artistItem}>
          <Image
            source={require("../assets/artist_placeholder.jpg")}
            style={styles.artistImage}
          />
          <View>
            <Text style={styles.artistName}>Drake</Text>
            <Text style={styles.artistFollowers}>101,580,796 followers</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.artistItem}>
          <Image
            source={require("../assets/artist_placeholder.jpg")}
            style={styles.artistImage}
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
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 8,
  },
  genreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  genreText: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  followInfo: {
    color: "#aaa",
    fontSize: 14,
  },
  bold: {
    fontWeight: "bold",
    color: "#fff",
  },
  editButtonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1DB954",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  formTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 14,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  picker: {
    color: '#fff',
    backgroundColor: 'transparent',
  },
  errorContainer: {
    marginTop: 4,
    overflow: 'hidden',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#444',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonActive: {
    backgroundColor: '#1DB954',
  },
  saveButtonInactive: {
    backgroundColor: '#666',
  },
  saveText: {
    fontWeight: '600',
  },
  saveTextActive: {
    color: '#fff',
  },
  saveTextInactive: {
    color: '#aaa',
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