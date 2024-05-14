// app.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import io from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [queueLength, setQueueLength] = useState(0);
  const [turn, setTurn] = useState('White');

  useEffect(() => {
    const newSocket = io('http://127.0.0.1:3000');
    newSocket.on('connect', () => {
      console.log('Connected');
    });
    newSocket.on('updateQueue', (length) => {
      setQueueLength(length);
    });
    newSocket.on('turnChange', (newTurn) => {
      setTurn(newTurn);
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const handleJoinQueue = () => {
    socket.emit('joinQueue');
  };

  return (
    <View>
      <Text>Queue Length: {queueLength}</Text>
      <Button title="Join Queue" onPress={handleJoinQueue} />
      <Text>Current Turn: {turn}</Text>
    </View>
  );
};

export default App;
