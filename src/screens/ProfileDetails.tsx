import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ProfileDetailsNav = NativeStackNavigationProp<RootStackParamList, 'ProfileDetails'>;

const ProfileDetails = () => {
  const navigation = useNavigation<ProfileDetailsNav>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            console.log('Back button pressed in ProfileDetails');
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.headerTitle}>📄 Student Profile</Text>

      <Image style={styles.profileImage} source={require('../assets/profile_pic.jpg')} />

      <View style={styles.infoBox}>
        <Text style={styles.label}>Full Name:</Text>
        <Text style={styles.value}>Neil Francis Evangelista Gabisay</Text>

        <Text style={styles.label}>Student ID:</Text>
        <Text style={styles.value}>23103612</Text>

        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.value}>September 19, 2003</Text>

        <Text style={styles.label}>Year Level:</Text>
        <Text style={styles.value}>2</Text>

        <Text style={styles.label}>Student Type:</Text>
        <Text style={styles.value}>Continuing</Text>

        <Text style={styles.label}>Foreign:</Text>
        <Text style={styles.value}>No</Text>

        <Text style={styles.label}>Faculty Evaluation:</Text>
        <Text style={styles.value}>Not Completed (1st Sem 2025)</Text>
      </View>
    </ScrollView>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 12,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
  },
  infoBox: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    marginBottom: 5,
  },
});