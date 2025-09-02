import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Spotify = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <View style={styles.container}>
      {/* Spotify Logo */}
      <Image
        style={styles.logo}
        source={require('../assets/spotify_logo.png')}
      />

      <Text style={styles.title}>Spotify</Text>


      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email or username"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
      </View>


      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>


      <Text style={styles.socialText}>Or sign in with</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={22} color="#fff" />
        </TouchableOpacity>
      </View>


      <Text style={styles.footerText}>
        Don't have an account? <Text style={styles.signUpText}>Sign up</Text>
      </Text>
    </View>
  );
};

export default Spotify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1DB954',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  socialText: {
    color: '#aaa',
    marginTop: 20,
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  socialButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  footerText: {
    color: '#fff',
    marginTop: 20,
  },
  signUpText: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
});
