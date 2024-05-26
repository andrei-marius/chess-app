import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCustomContext } from '../contexts/globalContext';
import useApiService from '../hooks/useApiService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useCustomContext();
  const { login, data, loading, error } = useApiService()

  const handleLogin = async () => {
    await login(email, password)
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

export default LoginScreen;
