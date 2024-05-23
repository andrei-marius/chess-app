import React, { useState, useEffect } from "react";
import { useCustomContext } from "../contexts/globalContext";
import socket from "../socketConnection";
import { Text } from "react-native";

const SuggestedMoves = () => {
    const [suggestedMoves, setSuggestedMoves] = useState(null);
    const { mostFrequent } = useCustomContext()

    useEffect(() => {
        socket.on('receiveMoves', (data) => {
            // console.log('Received move data:', data)
            setSuggestedMoves(data)                    
          });

        socket.on('allTeamMoved', (data) => {
            socket.emit('getMostFrequent', data)
        });

        socket.on('receiveResetAndTurn', () => {
            setSuggestedMoves(null)
        });
    }, [])

    return (
        suggestedMoves && !mostFrequent && suggestedMoves.map((move, index) => (
            <Text key={index} style={{ fontSize: 20 }}>Player {move.player} suggested move from {move.move.from} to {move.move.to}</Text>
        ))
    )
}

export default SuggestedMoves