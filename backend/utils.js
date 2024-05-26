export function mostFrequentPropertyValues(array) {
  // Count the frequency of each move object
  const frequencyMap = array.reduce((acc, obj) => {
    const moveString = JSON.stringify(obj.move);
    acc[moveString] = (acc[moveString] || 0) + 1;
    return acc;
  }, {});

  // Find the highest frequency
  const maxFrequency = Math.max(...Object.values(frequencyMap));

  // Find the move objects with the highest frequency
  const mostFrequentMoves = Object.keys(frequencyMap).filter(
    key => frequencyMap[key] === maxFrequency
  );

  // Extract the move objects and add the numberOfVotes property
  const moveObjectsWithVotes = mostFrequentMoves.map(moveString => {
    const move = JSON.parse(moveString);
    const { fen, side } = array.find(obj => JSON.stringify(obj.move) === moveString);
    return { move, side, numberOfVotes: 0, fen };
  });

  return moveObjectsWithVotes;
}

// Shuffle function using Fisher-Yates algorithm
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function arrLengthCheck (array1,array2){
  return array1.length === array2.length ? true : false;
}