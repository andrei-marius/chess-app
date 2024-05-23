import React, { useState, useEffect }  from "react";
import { useCustomContext } from "../contexts/globalContext";
import socket from "../socketConnection";
import { Text, Button, View } from "react-native";

const Voting = () => {
    const [votingLocked, setVotingLocked] = useState(true);
    const [voted, setVoted] = useState(false);
    const [msg, setMsg] = useState(null);
    const { mostFrequent, setMostFrequent, side } = useCustomContext()

    useEffect(() => {
        socket.on('receiveMostFrequent', (data) => {
            // console.log('Received most frequent:', data);
            setMostFrequent(data);
            setVotingLocked(false)
        });
    
        socket.on('receiveVotes', (data) => {
            // console.log('Received voting data:', data);
            setMostFrequent(data);
        }); 

        socket.on('revoteNeeded', (msg, data) => {
            setMostFrequent(data)
            setMsg(msg)
            setVoted(false)
        });

        socket.on('resetMove', () => {
            setVotingLocked(true)
            setVoted(false)
            setMostFrequent(null)
            setMsg(null)
        });
    }, [])

    const voteMove = (index) => {
        socket.emit('voteMove', { player: socket.id, mostFrequent, side, index });
        setVoted(true);
    }

    return (
        <>
            {!votingLocked && mostFrequent && mostFrequent.map((item, index) => (
                <View key={index}>
                    <Text style={{ fontSize: 20 }}>Move from {item.move.from} to {item.move.to}</Text>
                    <Button disabled={voted} title='VOTE' onPress={() => voteMove(index)} />
                    <Text style={{ fontSize: 20 }}>{item.numberOfVotes}</Text>
                </View>
            ))}
            {msg && <Text style={{ fontSize: 20 }}>{msg}</Text>}
        </>
    )
}

export default Voting