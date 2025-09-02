import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MyProfile = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        style={styles.headerImage}
        source={require('../assets/school_header.png')}
      />
      <Text style={styles.title}>Welcome to My Profile</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ProfileDetails' as never)}
      >
        <Text style={styles.buttonText}>Go to Profile Details</Text>
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
  },
  headerImage: {
    width: '90%',
    height: 50, // smaller height
    marginBottom: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
