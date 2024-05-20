export let queueLength = 0;
export const queueMax = 1;
export const whitePlayers = [];
export const blackPlayers = [];
export const suggestedMoves = [];
export let votes = 0;
export let turn = 'white';
export const playersReady = [];

export function mostFrequentPropertyValues(array) {
  const frequencyMap = array.reduce((acc, obj) => {
    const moveString = JSON.stringify(obj.move);
    acc[moveString] = (acc[moveString] || 0) + 1;
    return acc;
  }, {});

  const maxFrequency = Math.max(...Object.values(frequencyMap));
  const mostFrequentMoves = Object.keys(frequencyMap).filter(
    key => frequencyMap[key] === maxFrequency
  );

  const moveObjectsWithVotes = mostFrequentMoves.map(moveString => {
    const move = JSON.parse(moveString);
    const { fen, side } = array.find(obj => JSON.stringify(obj.move) === moveString);
    return { move, side, numberOfVotes: 0, fen };
  });

  return moveObjectsWithVotes;
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function arrLengthCheck(array1, array2) {
  return array1.length === array2.length;
}

export function resetAndSwitchTurns(io) {
  suggestedMoves.length = 0;
  votes = 0;
  turn = turn === 'white' ? 'black' : 'white';
  io.emit('receiveResetAndTurn', turn);
}
