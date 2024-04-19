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
  const [moves, setMoves] = useState(null);
  const [mostFrequent, setMostFrequent] = useState(null);

  const queueMax = 3;

  const handleQueue = () => {
    if (!socket) {
      const newSocket = io('http://192.168.203.33:3000');
  
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

      newSocket.on('receiveMoves', (data) => {
        console.log('Received data:', data);
        setMoves(data);
      });

      newSocket.on('receiveMostFrequent', (data) => {
        console.log('Received data:', data);
        setMostFrequent(data)
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

  const sendRock = () => {
    socket.emit('sendMove', { player: socket.id, move: 'rock', side: teamInfo.side})
  }
  const sendScissors = () => {
    socket.emit('sendMove', { player: socket.id, move: 'scissors', side: teamInfo.side})
  }
  const sendPaper = () => {
    socket.emit('sendMove', { player: socket.id, move: 'paper', side: teamInfo.side})
  }

  const getMostFrequent = () => {
    socket.emit('getMostFrequent', teamInfo.side)
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {moves && !mostFrequent && moves.map((move, index) => (
        <View key={index}>
          <Text style={{ fontSize: 20 }}>Player: {move.player}</Text>
          <Text style={{ fontSize: 20 }}>Move: {move.move}</Text>
        </View>
      ))}
      {mostFrequent && <Text style={{ fontSize: 20 }}>Most frequent move: {mostFrequent}</Text>}
      {teamInfo && 
        <>
          <Text style={{ fontSize: 20 }}>Player: {teamInfo.player}</Text>
          <Text style={{ fontSize: 20 }}>Side: {teamInfo.side}</Text>
          <Button title='SEND ROCK' onPress={sendRock} />
          <Button title='SEND SCISSORS' onPress={sendScissors} />
          <Button title='SEND PAPER' onPress={sendPaper} />
          <Button title='GET MOST FREQUENT' onPress={getMostFrequent} />
        </>
      }
      {!teamInfo && queueLength < queueMax && 
        <>
          <Text style={{ fontSize: 20 }}>Queue {queueLength}/{queueMax}</Text>
          <Button title={title} onPress={handleQueue} />
        </>
      }
    </View>
  );
};

export default App;
