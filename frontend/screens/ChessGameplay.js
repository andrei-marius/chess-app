import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import {Box, Text, Flex, Image} from "native-base"
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChessGameplay = () => {
    const blackTile = "#38596e";
    const whiteTile = "#dde6e3";
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8];

const chessPieces = {
    'a1': 'rook_black', 'b1': 'knight_black', 'c1': 'bishop_black', 'd1': 'queen_black', 'e1': 'king_black', 'f1': 'bishop_black', 'g1': 'knight_black', 'h1': 'rook_black',
    'a2': 'pawn_black', 'b2': 'pawn_black', 'c2': 'pawn_black', 'd2': 'pawn_black', 'e2': 'pawn_black', 'f2': 'pawn_black', 'g2': 'pawn_black', 'h2': 'pawn_black',
    'a8': 'rook_white', 'b8': 'knight_white', 'c8': 'bishop_white', 'd8': 'queen_white', 'e8': 'king_white', 'f8': 'bishop_white', 'g8': 'knight_white', 'h8': 'rook_white',
    'a7': 'pawn_white', 'b7': 'pawn_white', 'c7': 'pawn_white', 'd7': 'pawn_white', 'e7': 'pawn_white', 'f7': 'pawn_white', 'g7': 'pawn_white', 'h7': 'pawn_white',
};

const getPiece = (chessPiece) => {
    switch(chessPiece) {
        case "rook_black": return <FontAwesome5 name="chess-rook" size={40} color="black" style={styles.pieces} />;
        case "rook_white": return <FontAwesome6 name="chess-rook" size={40} color="black" style={styles.pieces} />;
        case "knight_black": return <FontAwesome5 name="chess-knight" size={40} color="black" style={styles.pieces} />;
        case "knight_white": return <FontAwesome6 name="chess-knight" size={40} color="black" style={styles.pieces} />;
        case "bishop_black": return <FontAwesome5 name="chess-bishop" size={40} color="black" style={styles.pieces} />
        case "bishop_white": return <FontAwesome6 name="chess-bishop" size={40} color="black" style={styles.pieces} />;
        case "queen_black": return <MaterialCommunityIcons name="chess-queen" size={40} color="black" style={styles.pieces}/>;
        case "queen_white": return <FontAwesome6 name="chess-queen" size={40} color="black" style={styles.pieces} />;
        case "king_black": return <FontAwesome5 name="chess-king" size={40} color="black" style={styles.pieces} />;
        case "king_white": return <FontAwesome6 name="chess-king" size={40} color="black" style={styles.pieces} />;
        case "pawn_black": return <FontAwesome5 name="chess-pawn" size={40} color="black" style={styles.pieces} />
        case "pawn_white": return <FontAwesome6 name="chess-pawn" size={40} color="black" style={styles.pieces} />;
        default: return null;

    }
};

const renderTiles = () => {
    const tiles = [];
    for (let i = verticalAxis.length - 1; i >= 0; i--){
        for(let j = 0; j < horizontalAxis.length; j++){
            const isBlack = (i + j) % 2 === 1;
            const piecePosition = `${horizontalAxis[j]}${verticalAxis[i]}`;
            const chessPiece = chessPieces[piecePosition];
            const piece = chessPiece ? getPiece(chessPiece) : null;
            tiles.push(
                <Box key={`${horizontalAxis[j]}${verticalAxis[i]}`} justifyContent="center" alignItems="center" w="12.5%" h="12.5%" bg={isBlack ? blackTile : whiteTile}>
                    {piece}
                </Box>
            );
        }
    }

    return tiles;
}

return (
    <LinearGradient flex={1} colors={['#354c7c', '#332a43']}>
        <Flex position="absolute" direction="row" style={styles.flexContainer1}>
        <Image source={require("../assets/profile_pic.jpeg")} w="65px" h="65px" alt="User profile picture" style={styles.userImg}/>
        <Flex direction="column" marginLeft="4">
        <Text style={styles.text}>Username</Text>
        <Text style={styles.text}>LVL 1</Text>
        </Flex>
        </Flex>
        <Box position="relative" w="100%" h="60%" alignItems="center" top="138" bg="#eeeeee" borderBottomWidth="15" borderWidth="3">
            <Box w="100%" h="100%" display="flex" flexWrap="wrap" flexDirection="row">{renderTiles()}</Box>
        </Box>
        <Flex direction="row-reverse" position="absolute" top="610" left="215">
        <Image source={require("../assets/userpic.png")} w="65px" h="65px" alt="User profile picture"/>
        <Flex direction="column" marginRight="4">
        <Text style={styles.text}>Username</Text>
        <Text style={styles.text} marginLeft="10">LVL 2</Text>
        </Flex>
        </Flex>
    </LinearGradient>
)
}

const styles = StyleSheet.create ({

    flexContainer1: {
        margin: 30,
    },

    text: {
        fontWeight: "bold",
        fontSize: 20,
        paddingTop: 9,
        color: "#dde6e3"

    },

    userImg: {
        borderRadius: 100,
    },

})

export default ChessGameplay;

