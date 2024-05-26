import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useApiService from '../hooks/useApiService';
import { useCustomContext } from '../contexts/globalContext';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { signup, data, loading, error } = useApiService()
  const { setUser } = useCustomContext();

  const handleSignup = async () => {
    await signup(email, password, username)
  };

  useEffect(() => {
    (async () => {
      if (data) {
        await AsyncStorage.setItem('token', data.token);
        setUser(data.token);
      }
    })();
  }, [data]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
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
      <Button title="SIGN UP" onPress={handleSignup} color="#3498db" />
      <Text style={styles.toggleText} onPress={() => navigation.navigate('Login')}>
        Already have an account? Sign In
      </Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {loading && <ActivityIndicator size="large" color="#3498db" />}
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

export default SignupScreen;
