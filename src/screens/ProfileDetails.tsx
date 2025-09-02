import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';

const ProfileDetails = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📄 Student Profile</Text>

      
      <Image
        style={styles.profileImage}
        source={require('../assets/profile_pic.jpg')}
      />

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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    elevation: 2, // Android shadow
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

export default ProfileDetails;
