// src/screens/LeaderboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { database } from '../firebase';

const LeaderboardScreen = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const scoresRef = database.ref('scores');
    scoresRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const scoresArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }));
      setScores(scoresArray);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={scores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.username}: {item.points}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default LeaderboardScreen;
