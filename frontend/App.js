import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const App = () => {
  const [message, setMessage] = useState('');
  const [joined, setJoined] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [socket, setSocket] = useState(null);
  const [title, setTitle] = useState('JOIN');
  const [teamInfo, setTeamInfo] = useState(null);
  const [moves, setMoves] = useState(null);
  const [mostFrequent, setMostFrequent] = useState(null);
  const [votedMove, setVotedMove] = useState(null);
  const [votingLocked, setVotingLocked] = useState(false);
  const [voted, setVoted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [castVote, setCastVote] = useState(null);
  const [blackTeamVoted, setBlackTeamVoted] = useState(false);
  const [whiteTeamVoted, setWhiteTeamVoted] = useState(false);
  const [onlyWhiteMove, setOnlyWhiteMove] = useState(false);
  const [onlyBlackMove, setOnlyBlackMove] = useState(false);
  const queueMax = 5;

  useEffect(() => {
    if (!socket) {
      const newSocket = io('http://192.168.142.94:3000');
  
      newSocket.on('connect', () => {
        console.log(newSocket.id, 'connected');
        // newSocket.emit('joinQueue')
        // setConnected(true)
        // setTitle('CANCEL');
      
        newSocket.on('updateQueue', (data) => {
          console.log('Received queue length:', data);
          setQueueLength(data);
        });
  
        newSocket.on('assignTeam', (data) => {
          console.log('Received team assignment:', data);
          setTeamInfo(data);
        });
  
        newSocket.on('receiveMoves', (data) => {
          console.log('Received move data:', data)
          setMoves(data)                    
        });

        newSocket.on('blackTeamAllVoted', (data) => {
          console.log('blackTeamAllVoted');
          setBlackTeamVoted(true);
          setTeamInfo(data)
          setVotingLocked(true)
        });

        newSocket.on('whiteTeamAllVoted', (data) => {
          console.log('whiteTeamAllVoted');
          setWhiteTeamVoted(true);
          setTeamInfo(data)
          setVotingLocked(true)
        });
  
        newSocket.on('receiveMostFrequent', (data) => {
          console.log('Received data:', data);
          setMostFrequent(data);
          // setVotingLocked(false);
        });

        newSocket.on('receiveOnlyWhiteMove', (data) => {
          console.log('Only white move');
          setOnlyWhiteMove(true);
          setVotingLocked(true)
          setTeamInfo(data)
          socket.emit('onlyTwoFinalMoves', data)
        });  

        newSocket.on('receiveOnlyBlackMove', (data) => {
          console.log('Only black move');
          setOnlyBlackMove(true);
          setVotingLocked(true)
          setTeamInfo(data)
          socket.emit('onlyTwoFinalMoves', data)
        });

        newSocket.on('receiveVotes', (data) => {
          console.log('Received data:', data);
          setMostFrequent(data);
        }); 
        
        newSocket.on('onlyTwoFinalMoves', (data) => {
          console.log('Received data:', data);
          setMostFrequent(data);
        });

        newSocket.on('receiveWinner', (data) => {
          console.log('Received winner:', data);
          setVotedMove(data);
        });

        newSocket.on('restartGame', () => {
          restartGame()
        })
      });

      setSocket(newSocket)
    }
  }, [])

  const handleQueue = () => {
    if (!joined && queueLength < queueMax) {
      console.log(socket.id, 'joined');
      socket.emit('joinQueue')
      setJoined(true);
      setTitle('CANCEL');
    }

    if (joined) {
      console.log(socket.id, 'cancelled');
      socket.emit('cancelQueue')
      setJoined(false);
      setTitle('JOIN');
    }
  }

  const sendRock = () => {
    setCastVote(true);
    socket.emit('sendMove', { player: socket.id, move: 'rock', side: teamInfo.side})
  }
  const sendScissors = () => {
    setCastVote(true);
    socket.emit('sendMove', { player: socket.id, move: 'scissors', side: teamInfo.side})
  }
  const sendPaper = () => {
    setCastVote(true);
    socket.emit('sendMove', { player: socket.id, move: 'paper', side: teamInfo.side})
  }

  const getMostFrequent = () => {
    socket.emit('getMostFrequent', teamInfo.side)
  }

  const voteMove = (index) => {
    let arrCopy = [...mostFrequent]
    arrCopy[index].numberOfVotes++
    socket.emit('voteMove', { player: socket.id, mostFrequent: arrCopy, side: teamInfo.side  });
    setVoted(true);
  }
  
  const getFinalMove = () => {
    console.log("im really here")
    const maxVotesMove = mostFrequent.reduce((prev, current) => (prev.numberOfVotes > current.numberOfVotes) ? prev : current);
    socket.emit('sendFinalMoves', {...maxVotesMove, side: teamInfo.side });
    setVotingLocked(true);
  }

  const restartGame = () => {
    setVotedMove(null)
    setQueueLength(0)
    setTeamInfo(null)
    setMoves(null)
    setMostFrequent(null)
    setVotingLocked(false)
    setTitle('JOIN')
    setJoined(false)
    setCastVote(null)
    setBlackTeamVoted(false)
    setWhiteTeamVoted(false)
    setOnlyWhiteMove(false);
    setOnlyBlackMove(false);
    setVoted(false)

  }

  return (      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {votedMove ? 
          <View>
            <Text style={{ fontSize: 20 }}>{votedMove}</Text>
            <Button title='RESTART' onPress={() => socket.emit('restart')} />
          </View> :
          <View>
            {moves && !mostFrequent && moves.map((move, index) => (
              <View key={index}>
                <Text style={{ fontSize: 20 }}>Player: {move.player}</Text>
                <Text style={{ fontSize: 20 }}>Move: {move.move}</Text>
              </View>
            ))}
            {votingLocked && !voted && mostFrequent ? mostFrequent.map((item, index) => (
              <View key={index}>
                <Text style={{ fontSize: 20 }}>Suggested move</Text>
                <Text style={{ fontSize: 20 }}>{item.move}</Text>
                {mostFrequent.length > 1 && 
                  <>
                    <Button style={styles.button} title='VOTE' onPress={() => voteMove(index)} />
                    <Text style={{ fontSize: 20 }}>{item.numberOfVotes}</Text>
                  </>
                }
              </View>
            )) : null}
            {teamInfo && !castVote &&
              <>
                <Text style={{ fontSize: 20 }}>Player: {teamInfo.player}</Text>
                <Text style={{ fontSize: 20 }}>Side: {teamInfo.side}</Text>
                <Button style={styles.button} title='SEND ROCK' onPress={sendRock} />
                <Button style={styles.button} title='SEND SCISSORS' onPress={sendScissors} />
                <Button style={styles.button} title='SEND PAPER' onPress={sendPaper} />
              </>
              }
            {votingLocked && teamInfo && castVote && teamInfo.side === "White" && whiteTeamVoted && !onlyWhiteMove &&
              
                <Button style={styles.button} title='GET MOST FREQUENT' onPress={getMostFrequent} />
              } 
            {votingLocked && teamInfo && castVote && teamInfo.side === "Black" && blackTeamVoted && !onlyBlackMove &&
              
                <Button style={styles.button} title='GET MOST FREQUENT' onPress={getMostFrequent} />
              }
            {!teamInfo && queueLength < queueMax &&
              <>
                <Text style={{ fontSize: 20 }}>Queue {queueLength}/{queueMax}</Text>
                <Button style={styles.button} title={title} onPress={handleQueue} />
              </>
              }
          </View>
        }
      </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
  },
})

export default App;
