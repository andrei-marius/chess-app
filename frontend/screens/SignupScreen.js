import React from 'react';
import {Text, TextInput, StyleSheet} from 'react-native';
import {Box, Button} from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import useApiService from '../hooks/useApiService';
// import { useCustomContext } from '../contexts/globalContext';

const SignupScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const { signup, data, loading, error } = useApiService()
//   const { setUser } = useCustomContext();

//   const handleSignup = async () => {
//     await signup(email, password, username)
//   };

//   useEffect(() => {
//     (async () => {
//       if (data) {
//         await AsyncStorage.setItem('token', data.token);
//         setUser(data.token);
//       }
//     })();
//   }, [data]);


  return (

    <LinearGradient flex={1} colors={['#354c7c', '#332a43']}>
    <Box flex={1} justifyContent="center" alignItems="start" >
      <Box position="absolute" p="10">
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        // value={username}
        // onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        // value={email}
        // onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        // value={password}
        // onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button onPress={() => navigation.navigate('MainMenu')} w="50%" mt="3" style={styles.buttonStyle}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Button>
      <Text style={styles.toggleText} onPress={() => navigation.navigate('Login')}>
        Already have an account? Sign in here!
      </Text>
      {/* {error && <Text style={{ color: 'red', fontWeight: "bold", fontSize: 16 }}>{error}</Text>}
      {loading && <ActivityIndicator size="large" color="#3498db" />} */}
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
  },

  buttonStyle: {
    borderRadius: 10,
    borderBottomWidth: 8,
    borderWidth: 3,
    backgroundColor: "#727499"

  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "whitesmoke",
  },

  input: {
    height: 45,
    borderBottomColor: '#000000',
    borderBottomWidth: 5,
    backgroundColor: "whitesmoke",
    marginBottom: 18,
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
  },
});

export default SignupScreen;
