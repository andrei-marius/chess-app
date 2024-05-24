import React, { useRef, useEffect, useState } from "react";
import { Text, View, Button } from "react-native";
import Chessboard from 'react-native-chessboard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import socket from "../socketConnection";
import SuggestedMoves from "../components/SuggestedMoves";
import Voting from "../components/Voting";
import { useCustomContext } from "../contexts/globalContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const Chess = () => {
    const [suggestedMove, setSuggestedMove] = useState(null)
    const [finalMove, setFinalMove] = useState(null)
    const [fenHistory, setFenHistory] = useState(['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']);
    const [turn, setTurn] = useState('white');
    const [playersReady, setPlayersReady] = useState(false);
    const { side } = useCustomContext()
    const chessboardRef = useRef(null);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        socket.emit('playerReady', socket.id)

        socket.on('playersReady', () => {
            setPlayersReady(true)
        })

        socket.on('receiveFinalMove', (data, turn) => {
            // console.log('Received final move:', data);
            chessboardRef.current.resetBoard(data.fen)
            setTurn(turn)
            setFinalMove(data);
            setFenHistory(oldArray => [...oldArray, data.fen])
        });
        
        socket.on('resetMove', (data) => {
            setSuggestedMove(null)
            setFinalMove(null)
            // setGameOver(false)
        });
    }, [])

    const addGameResult = async (result) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.0.19:3000/addGameResult', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(result),
            });
            if (response.ok) {
                console.log('Game result added to leaderboard!');
            } else {
                const errorData = await response.json();
                console.error('Error adding game result:', errorData.error);
            }
        } catch (error) {
            console.error('Error adding game result:', error);
        }
    };
    
      //Win: 3 points Draw: 1 point Loss: 0 points
    
      const handleGameEnd = async (outcome) => {
        const token = await AsyncStorage.getItem('token');
        const user = jwtDecode(token);
        let score = 0;
        let result = 'draw';

        if (outcome.in_checkmate) {
            result = (side === outcome.turn) ? 'win' : 'lose';
            score = (result === 'win') ? 3 : 0;
        } else if (outcome.in_draw || outcome.in_stalemate || outcome.in_threefold_repetition || outcome.insufficient_material) {
            result = 'draw';
            score = 1;
        }

        const gameResult = {
            username: user.name || user.email,
            score: score,
            result: result
        };
        addGameResult(gameResult);
        setGameOver(true); 
    };

    
    const onMoveEnd = ({ in_checkmate, in_draw, in_stalemate, in_threefold_repetition, insufficient_material, game_over, turn }) => {
        console.log('Game end conditions:', { in_checkmate, in_draw, in_stalemate, in_threefold_repetition, insufficient_material, game_over, turn });
        if (in_checkmate || in_draw || in_stalemate || in_threefold_repetition || insufficient_material || game_over) {
            handleGameEnd({ in_checkmate, in_draw, in_stalemate, in_threefold_repetition, insufficient_material, turn });
        }
    };

    function getLatestMove(fen1, fen2) {
        if (!fen1 || !fen2) {
          return
        }
    
        const board1 = fen1.split(' ')[0];
        const board2 = fen2.split(' ')[0];
    
        const rows1 = board1.split('/');
        const rows2 = board2.split('/');
    
        let from = '';
        let to = '';
        let pieceMoved = '';
    
        // Convert FEN row to expanded form for easier comparison
        const expandRow = (fenRow) => {
            return fenRow.replace(/[1-8]/g, (match) => ''.padStart(parseInt(match, 10), '-'));
        };
    
        rows1.forEach((row1, rowIndex) => {
            const expandedRow1 = expandRow(row1);
            const expandedRow2 = expandRow(rows2[rowIndex]);
    
            for (let colIndex = 0; colIndex < expandedRow1.length; colIndex++) {
                const char1 = expandedRow1[colIndex];
                const char2 = expandedRow2[colIndex];
    
                if (char1 !== char2) {
                    const position = String.fromCharCode(97 + colIndex) + (8 - rowIndex);
                    if (char1 === '-') {
                        to = position;
                        pieceMoved = char2;
                    } else if (char2 === '-') {
                        from = position;
                    } else {
                        // This could be a capture and move
                        from = position;  // Assume the move is from this cell
                        to = position;    // Also assume this is the destination for now
                        pieceMoved = char2;
                    }
                }
            }
        });
        return {
            from: from,
            to: to,
            piece: pieceMoved
        };
    }

    const sendMove = (move, fen) => {
        socket.emit('sendMove', { player: socket.id, move, fen, side})
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {playersReady ? (
                gameOver ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Game Over</Text>
                        <Button title="Back to Queue" onPress={() => navigation.navigate('Queue')} />
                        <Button title="View Leaderboard" onPress={() => navigation.navigate('Leaderboard')} />
                    </View>
                ) : (
                    <>
                        <Text>Player: {socket.id}</Text>
                        <Text>Side: {side}</Text>
                        <Text>Turn: {turn}</Text>
                        <SuggestedMoves />
                        <Voting />
                        <Chessboard
                            gestureEnabled={side && side === turn && !suggestedMove}
                            ref={chessboardRef}
                            onMove={({ state }) => {
                                const latestMove = getLatestMove(fenHistory.slice(-1)[0], state.fen);
                                sendMove(latestMove, state.fen);
                                setSuggestedMove(latestMove);
                                onMoveEnd({ ...state, turn });
                            }}
                        />
                    </>
                )
            ) : (
                <Text>waiting for everyone</Text>
            )}
        </GestureHandlerRootView>
    );
};

export default Chess;