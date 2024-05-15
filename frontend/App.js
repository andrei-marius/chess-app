import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import Chessboard from 'react-native-chessboard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  const [message, setMessage] = useState('');
  const [joined, setJoined] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [socket, setSocket] = useState(null);
  const [title, setTitle] = useState('JOIN');
  const [teamInfo, setTeamInfo] = useState(null);
  const [suggestedMoves, setSuggestedMoves] = useState(null);
  const [mostFrequent, setMostFrequent] = useState(null);
  const [finalMove, setFinalMove] = useState(null);
  const [votingLocked, setVotingLocked] = useState(false);
  const [voted, setVoted] = useState(false);
  const [fenHistory, setFenHistory] = useState(['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']);
  const [turn, setTurn] = useState(null);
  const [suggestedMove, setSuggestedMove] = useState(null);

  const queueMax = 4

  const chessboardRef = useRef(null);

  useEffect(() => {
    if (!socket) {
      const newSocket = io('http://192.168.77.33:3000');
  
      newSocket.on('connect', () => {
        console.log(newSocket.id, 'connected');
      
        newSocket.on('updateQueue', (data) => {
          // console.log('Received queue length:', data);
          setQueueLength(data);
        });

        newSocket.on('turnChange', (turn) => {
          // console.log('Turn changed to:', turn);
          setTurn(turn);
        });
  
        newSocket.on('assignTeam', (data) => {
          // console.log('Received team assignment:', data);
          setTeamInfo(data);
        });
  
        newSocket.on('receiveMoves', (data) => {
          // console.log('Received move data:', data)
          setSuggestedMoves(data)                    
        });

        newSocket.on('allTeamVoted', (data) => {
          newSocket.emit('getMostFrequent', data)
        });
  
        newSocket.on('receiveMostFrequent', (data) => {
          // console.log('Received most frequent:', data);
          setMostFrequent(data);
        });

        newSocket.on('receiveVotes', (data) => {
          // console.log('Received voting data:', data);
          setMostFrequent(data);
        }); 

        newSocket.on("receiveFinalVotes", (data) => {
          const maxVotesMove = data.mostFrequent.reduce((prev, current) => (prev.numberOfVotes > current.numberOfVotes) ? prev : current);
          newSocket.emit('sendFinalMove', maxVotesMove);
          setVotingLocked(true);
        });
        
        newSocket.on('receiveFinalMove', (data) => {
          // console.log('Received final move:', data);
          setFinalMove(data);
          chessboardRef.current.resetBoard(data.fen)
          setFenHistory(oldArray => [...oldArray, data.fen])
          newSocket.emit('sendReset');
        });

        newSocket.on('receiveReset', () => {
          setSuggestedMoves(null);
          setMostFrequent(null);
          setFinalMove(null);
          setVotingLocked(false);
          setVoted(false);
          setSuggestedMove(null);
          newSocket.emit('resetSentOnce')
        })

        newSocket.on('restartGame', () => {
          restartGame()
        }) 
      });
      
      setSocket(newSocket)
    }
  }, [])

  useEffect(() => {
    console.log(turn)
  }, [turn])

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

  const sendMove = (move, fen) => {
    socket.emit('sendMove', { player: socket.id, move, fen, side: teamInfo.side})
  }

  const voteMove = (index) => {
    let arrCopy = [...mostFrequent]
    arrCopy[index].numberOfVotes++
    socket.emit('voteMove', { player: socket.id, mostFrequent: arrCopy, side: teamInfo.side  });
    setVoted(true);
  }

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

  return (
    <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!teamInfo && queueLength < queueMax ? (
        <>
          <Text style={{ fontSize: 20 }}>Queue {queueLength}/{queueMax}</Text>
          <Button style={styles.button} title={title} onPress={handleQueue} />
        </>
      ) : (
        <>
          {teamInfo && (
            <>
              <Text style={{ fontSize: 20 }}>Player: {teamInfo.player}</Text>
              <Text style={{ fontSize: 20 }}>Side: {teamInfo.side}</Text>
            </>
          )}
          {turn && <Text style={{ fontSize: 20 }}>Turn: {turn}</Text>}
          {/* {finalMove ? (
            <View>
              <Text style={{ fontSize: 20 }}>Final move</Text>
              <Text style={{ fontSize: 20 }}>from {finalMove.move.from} to {finalMove.move.to}</Text>
            </View>
          ) : ( */}
            <View>
              {suggestedMoves && !finalMove && !mostFrequent && suggestedMoves.map((move, index) => (
                <View key={index}>
                  <Text style={{ fontSize: 20 }}>Player: {move.player}</Text>
                  <Text style={{ fontSize: 20 }}>Move: from {move.move.from} to {move.move.to}</Text>
                </View>
              ))}
              {mostFrequent && mostFrequent.map((item, index) => (
                <View key={index}>
                  <Text style={{ fontSize: 20 }}>Suggested move</Text>
                  <Text style={{ fontSize: 20 }}>from {item.move.from} to {item.move.to}</Text>
                  <Button disabled={voted} style={styles.button} title='VOTE' onPress={() => voteMove(index)} />
                  <Text style={{ fontSize: 20 }}>{item.numberOfVotes}</Text>
                </View>
              ))}
            </View>
          {/* )} */}
          <Chessboard
            gestureEnabled={teamInfo && teamInfo.side === turn && !suggestedMove}
            ref={chessboardRef}
            onMove={({ state }) => {
              const latestMove = getLatestMove(fenHistory.slice(-1)[0], state.fen)
              sendMove(latestMove, state.fen)
              setSuggestedMove(latestMove)
            }}
          />
        </>
      )}
    </GestureHandlerRootView>
  );  
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
  },
})

export default App;