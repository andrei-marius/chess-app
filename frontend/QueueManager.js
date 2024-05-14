// QueueManager.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const QueueManager = ({ queueLength, handleQueue, title }) => (
  <View>
    <Text>Queue: {queueLength}</Text>
    <Button title={title} onPress={handleQueue} />
  </View>
);

export default QueueManager;
