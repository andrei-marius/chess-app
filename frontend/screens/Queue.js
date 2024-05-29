import React, { useEffect, useState } from "react";
import { StyleSheet  } from "react-native";
import socket from "../socketConnection";
import { useCustomContext } from "../contexts/globalContext";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { formatTime } from "../utils";
import {Box, VStack, Text, Center, Button} from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native";

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
<Box flex={1}>
<LinearGradient flex={1} colors={['#332a43', '#354c7c']}> 
<Center w="100%" h="20%" position="absolute" top="100">
    <Text fontSize="30" style={styles.title} >Joining the queue...</Text>
</Center>

<Box position="absolute" w="87%" h="45%" alignItems="center" top="250" left="27" bg="#eeeeee" borderRadius={10} borderBottomWidth="8" borderWidth="3" p="7" pt="10">
<Text style={styles.text} fontSize="23">Did you know that...</Text>
<VStack space={5} pt="3" />
<Text style={styles.text} fontSize="15">...the longest chess game theoretically possible is 5,949 moves? This limit is based on the "50-move rule," which allows either player to claim a draw if no pawn move 
or capture has been made in the last 50 moves. This means that a game can technically continue for up to 5,949 moves before ending in a draw!</Text>
</Box>
<ActivityIndicator size="large" style={{position: "absolute", top: 640, left: 185}}></ActivityIndicator>
</LinearGradient>
</Box>
    )
}

const styles = StyleSheet.create ({
    text: {
        textAlign: "center",
        paddingBottom: 2,
        color: "black",
        fontWeight: "bold",
        width: "98%",
    },

    title: {
        borderBottomWidth: 3, 
        borderBottomColor: "whitesmoke", 
        color: "whitesmoke",
        fontWeight: "bold"
    },

    buttonMenu: {
        borderBottomWidth: 8,
        borderWidth: 3,
        borderRadius: 15,
        borderColor: "#000000",
        backgroundColor: "#97541e",
    },

    textStyle: {
        fontWeight: "bold",
        fontSize: 18,
        color: "whitesmoke",
    }
})

export default Queue;