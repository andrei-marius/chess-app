import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://${process.env.IP_ADDRESS}:3000/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (response.ok) {
          await AsyncStorage.setItem('token', data.token);
          console.log('User signed in successfully!');
          navigation.navigate('Queue'); 
        } else {
          console.error('Authentication error:', data.message);
        }
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError, 'Response text:', text);
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleLogin} color="#3498db" />
      <Text style={styles.toggleText} onPress={() => navigation.navigate('Signup')}>
        Need an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    width: '80%',
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
