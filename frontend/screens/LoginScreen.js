import React, { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import {Box, Button} from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
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

  // colors={['#404066', '#022954']}

  return (

    <LinearGradient flex={1} colors={['#332a43', '#354c7c']}>
    <Box flex={1} justifyContent="center" alignItems="end" style={{marginLeft: 55}}>
      <Box position="absolute" p="10">
      <Text style={styles.title}>Log In</Text>
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
      <Button onPress={handleLogin} w="50%" mt="3" bg="#3498db" style={styles.buttonStyle}>
        <Text style={styles.buttonText}>Log in</Text>
      </Button>
      <Text style={styles.toggleText} onPress={() => navigation.navigate('Signup')}>
        In need of an account? Sign up here!
      </Text>
      {error && <Text style={{ color: 'red', fontWeight: "bold", fontSize: 16, textAlign: "right" }}>{error}</Text>}
      {loading && <ActivityIndicator size="large" color="#3498db" style={{marginLeft: 210}} />}
      </Box>
      </Box>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({

  image: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 33,
    marginBottom: 40,
    color: "whitesmoke",
    fontWeight: "bold",
    textAlign: "right",
  },

  buttonStyle: {
    borderRadius: 10,
    borderBottomWidth: 5,
    marginLeft: 135,

  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  input: {
    height: 45,
    borderBottomColor: '#000000',
    borderBottomWidth: 5,
    backgroundColor: "whitesmoke",
    marginBottom: 18,
    marginLeft: 55,
    padding: 10,
    borderRadius: 10,
    width: '85%',
    color: 'black',
    fontWeight: "bold",
  },

  toggleText: {
    color: 'whitesmoke',
    borderBottomColor: "whitesmoke",
    borderBottomWidth: 1.5,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    fontSize: 16,
    textAlign: "right"
  },
});


export default LoginScreen;
