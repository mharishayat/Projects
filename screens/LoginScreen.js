import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000); // show splash for 4 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    try {
      const data = await AsyncStorage.getItem('user');
      if (!data) return Alert.alert('No user found', 'Please sign up first.');
      const { email: storedEmail, password: storedPassword } = JSON.parse(data);
      if (email === storedEmail && password === storedPassword) {
        navigation.replace('MainApp');
      } else {
        Alert.alert('Error', 'Incorrect email or password');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  if (showSplash) {
    // Show splash screen UI here
    return (
      <View style={styles.splashContainer}>
        <Image source={require('../assets/slogo.jpg')} style={styles.splashLogo} />
        <Text style={styles.splashCopy}>© CopyRight Project</Text>
      </View>
    );
  }

  // Show login form UI after splash
  return (
    <View style={styles.container}>
      <Image source={require('../assets/slogo.jpg')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.copy}>© CopyRight Project</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: { 
    flex: 1, backgroundColor: '#7e6261', justifyContent: 'center', padding: 20
  },
  splashLogo: {
    width: 150, height: 150, alignSelf: 'center', marginBottom: 20 
  },
  splashCopy: {
    color: '#000000',
    fontSize: 14,
    position: 'absolute',
    bottom: 20,
    textAlign: 'center',
    left: 0,
    right: 0,
  },

  container: { flex: 1, backgroundColor: '#7e6261', justifyContent: 'center', padding: 20 },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 30, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  linkText: { marginTop: 20, color: '#fff', textAlign: 'center' },
  copy: { 
    color: '#000000', 
    fontSize: 15, 
    textAlign: 'center', 
    position: 'absolute', 
    bottom: 20, 
    left: 0, 
    right: 0 
  },
});
