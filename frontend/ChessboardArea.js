// ChessboardArea.js
import React, { useRef } from 'react';
import { View } from 'react-native';
import Chessboard from 'react-native-chessboard';

const ChessboardArea = () => {
  const chessboardRef = useRef(null);

  return (
    <View>
      <Chessboard ref={chessboardRef} />
    </View>
  );
};

export default ChessboardArea;
