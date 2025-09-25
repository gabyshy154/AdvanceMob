import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type PlaylistsNav = NativeStackNavigationProp<RootStackParamList, 'PlaylistsScreen'>;

const mockRecentlyPlayed = [
  {
    id: '1',
    title: 'R&B Mix',
    image:
      'https://i.scdn.co/image/ab67616d0000b2734b8a4cdedexample1',
  },
  {
    id: '2',
    title: "I'm Drunk, I Love You OST",
    image:
      'https://i.scdn.co/image/ab67616d0000b2734b8a4cdedexample2',
  },
  {
    id: '3',
    title: 'Before Trilogy',
    image:
      'https://i.scdn.co/image/ab67616d0000b2734b8a4cdedexample3',
  },
];

const mockMadeForYou = [
  {
    id: '1',
    title: 'Release Radar',
    subtitle: 'Catch all the latest music...',
    image:
      'https://i.scdn.co/image/ab67616d0000b2734b8a4cdedexample4',
  },
  {
    id: '2',
    title: 'Discover Weekly',
    subtitle: 'Your shortcut to hidden gems...',
    image:
      'https://i.scdn.co/image/ab67616d0000b2734b8a4cdedexample5',
  },
];

const PlaylistsScreen = () => {
  const navigation = useNavigation<PlaylistsNav>();
  const route = useRoute<any>();
  const token = route.params?.token ?? 'No Token';

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

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Your Playlists</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => {
              console.log('Profile icon pressed');
              console.log('Token:', token);
              navigation.navigate('ProfileScreen', { token });
            }}
          >
            <Ionicons
              name="person-circle-outline"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => {
              console.log('Settings icon pressed');
              navigation.navigate('SettingsScreen');
            }}
          >
            <Ionicons
              name="settings-outline"
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recently played</Text>
        {renderHorizontalList(mockRecentlyPlayed, 120)}

        <Text style={styles.sectionTitle}>Made for you</Text>
        {renderHorizontalList(mockMadeForYou, 150)}

        <Text style={styles.sectionTitle}>Recommended for you</Text>
        {renderHorizontalList(mockRecentlyPlayed, 150)}
      </ScrollView>
    </View>
  );
};

export default PlaylistsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 12,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    marginRight: 12,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#333',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#ccc',
    fontSize: 12,
  },
});