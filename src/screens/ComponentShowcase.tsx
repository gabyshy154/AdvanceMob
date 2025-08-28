import React from 'react';
import { View, Text, Button, Image, ScrollView, StyleSheet } from 'react-native';

export default function ComponentShowcase() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Component Showcase</Text>

      <Text style={styles.paragraph}>
        This is a Text component inside React Native. You can style it however you like.
      </Text>

      <Button title="Press Me" onPress={() => alert('Button pressed!')} />

      <Image
        source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        style={styles.image}
      />

      <Text style={styles.paragraph}>
        Scroll down to see more text. This area is wrapped in a ScrollView so it’s scrollable.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 15,
  },
});
