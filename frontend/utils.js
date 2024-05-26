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

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export {
    getLatestMove,
    formatTime,
}