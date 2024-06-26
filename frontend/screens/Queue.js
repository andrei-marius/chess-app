import React, { useEffect, useState } from "react";
import { Text, Button, View, StyleSheet  } from "react-native";
import socket from "../socketConnection";
import { useCustomContext } from "../contexts/globalContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTime } from "../utils";

const Queue = ({ navigation }) => {
    const [ queueLength, setQueueLength ] = useState(0)
    const [joined, setJoined] = useState(false);
    const [title, setTitle] = useState('JOIN');
    const [countdown, setCountdown] = useState(10);
    const [msg, setMsg] = useState(null)
    const { setSide } = useCustomContext()

    useEffect(() => {
        socket.on('countdown', time => {
          console.log('countdown')
          setCountdown(time);
        });

        socket.on('updateQueue', (data) => {
          console.log('updateQueue')
          setQueueLength(data);
        });
      
        socket.on('receiveAssignTeams', (data) => {
          console.log('receiveAssignTeams')
          // console.log('Received team assignment:', data);
          setSide(data)
          navigation.replace('Chess')
        });

        socket.on('notEnoughPlayers', (data) => {
          setMsg(data);
          setJoined(false);
          setTitle('JOIN');
        });
    }, [])

    const handleQueue = () => {
      if (!joined) {
        // console.log(socket.id, 'joined');
        socket.emit('joinQueue')
        setJoined(true);
        setTitle('CANCEL');
        setMsg(null)
      }
  
      if (joined) {
        // console.log(socket.id, 'cancelled');
        socket.emit('cancelQueue')
        setJoined(false);
        setTitle('JOIN');
      }
    }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mainContent}>
        {msg && <Text>{msg}</Text>}
        {joined &&
          <>
            <Text>Time left: {formatTime(countdown)}</Text>
            <Text>{queueLength} in queue</Text>
          </>
        }
        <Button onPress={handleQueue} title={title}></Button>
      </View>
    </View>
);
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default Queue;