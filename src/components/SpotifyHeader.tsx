import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  title: string;
};

const SpotifyHeader = ({ title }: Props) => {
  return (
    <View
      style={styles.header}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={`${title} header`}
    >
      <Ionicons
        name="musical-notes"
        size={24}
        color="#1DB954"
        style={styles.icon}
        accessibilityLabel="Spotify logo icon"
        accessibilityRole="image"
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default SpotifyHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#191414',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
