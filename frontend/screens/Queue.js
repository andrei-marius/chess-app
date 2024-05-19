import React, { useEffect, useState } from "react";
import { Text, Button, View } from "react-native";
import socket from "../socketConnection";
import { useCustomContext } from "../contexts/globalContext";

const Queue = ({ navigation }) => {
    const [ queueLength, setQueueLength ] = useState(0)
    const [joined, setJoined] = useState(false);
    const [title, setTitle] = useState('JOIN');
    const { setSide } = useCustomContext()
    const queueMax = 3

    useEffect(() => {
        socket.on('updateQueue', (data) => {
          setQueueLength(data);
        });

        socket.on('receiveAssignTeams', (data) => {
          // console.log('Received team assignment:', data);
          setSide(data)
          navigation.replace('Chess')
      });
    }, [])

    const handleQueue = () => {
      if (!joined && queueLength < queueMax) {
        // console.log(socket.id, 'joined');
        socket.emit('joinQueue')
        setJoined(true);
        setTitle('CANCEL');
      }
  
      if (joined) {
        // console.log(socket.id, 'cancelled');
        socket.emit('cancelQueue')
        setJoined(false);
        setTitle('JOIN');
      }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{queueLength}/{queueMax}</Text>
            <Button onPress={handleQueue} title={title}></Button>
        </View>
    )
}

export default Queue;