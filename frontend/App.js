import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import io from 'socket.io-client';

const App = () => {
  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [socket, setSocket] = useState(null);
  const [title, setTitle] = useState('JOIN');
  const [teamInfo, setTeamInfo] = useState(null);
  const [text, onChangeText] = useState('Useless Text');
  const [move, setMove] = useState(null);

  const queueMax = 2;

  useEffect(() => {
    if (socket) {
      socket.on('receiveMoves', (data) => {
        console.log('Received data:', data);
        setMove(data);
      });
    }
  }, [socket])

  const handleQueue = () => {
    if (!socket) {
      const newSocket = io('http://10.60.9.94:3000');
  
      newSocket.on('connect', () => {
        console.log(newSocket.id, 'joined');
        newSocket.emit('joinQueue')
        setConnected(true)
        setTitle('CANCEL');
      });

      newSocket.on('updateQueue', (data) => {
        console.log('Received queue length:', data);
        setQueueLength(data);
      });

      newSocket.on('assignTeam', (data) => {
        console.log('Received team assignment:', data);
        setTeamInfo(data);
      });
  
      setSocket(newSocket)
    } else {
      if (!connected && queueLength < queueMax) {
        console.log(socket.id, 'joined');
        socket.emit('joinQueue')
        setConnected(true);
        setTitle('CANCEL');
      }
  
      if (connected) {
        console.log(socket.id, 'cancelled');
        socket.emit('cancelQueue')
        setConnected(false);
        setTitle('JOIN');
      }
    }
  }

  const handleSend = () => {
    console.log(text)
    socket.emit('sendMove', { move: text, side: teamInfo.side })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {move && <Text style={{ fontSize: 20 }}>Move: {move}</Text>}
      {teamInfo && 
        <>
          <Text style={{ fontSize: 20 }}>Player: {teamInfo.player}</Text>
          <Text style={{ fontSize: 20 }}>Side: {teamInfo.side}</Text>
          <TextInput onChangeText={onChangeText} value={text} style={{ height: 50, width: 200, padding: 10, borderWidth: 1 }} />
          <Button title='SEND' onPress={handleSend} />
        </>
      }
      {!connected && queueLength < queueMax && 
        <>
          <Text style={{ fontSize: 20 }}>Queue {queueLength}/{queueMax}</Text>
          <Button title={title} onPress={handleQueue} />
        </>
      }

    </View>
  );
};

export default App;
