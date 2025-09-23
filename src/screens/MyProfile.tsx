import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type MyProfileNav = NativeStackNavigationProp<RootStackParamList, 'MyProfile'>;

const MyProfile = () => {
  const navigation = useNavigation<MyProfileNav>();

  return (
    <View style={styles.container}>
      <Image style={styles.headerImage} source={require('../assets/school_header.png')} />
      <Text style={styles.title}>Welcome to My Profile</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ProfileDetails')}
      >
        <Text style={styles.buttonText}>Go to Profile Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#1DB954', marginTop: 15 }]}
        onPress={() => navigation.navigate('Spotify')}
      >
        <Text style={styles.buttonText}>Go to Spotify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  headerImage: {
    width: '90%',
    height: 50,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
