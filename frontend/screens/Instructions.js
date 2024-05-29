import {Text, Center, Box, VStack, Button} from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Instructions = () => {

    const navigation = useNavigation();

    return (

<Box flex={1}>
<LinearGradient flex={1} colors={['#c59f2a', '#b45f06']}>
<Center w="100%" h="20%" position="absolute" top="-20">
    <Text fontSize="30" style={styles.title} >How to play?</Text>
</Center>

<Box position="absolute" w="87%" h="70%" alignItems="center" top="105" left="27" bg="#eeeeee" borderRadius={10} borderBottomWidth="8" borderWidth="3" p="7">
<Text style={styles.text}>In this unique chess format, each move is determined not by a single player, but through a majority vote from a team. Here's how you can play:</Text>
<VStack space={5} pt="3" />
<Text style={styles.text}> ● Form Teams: Controlled individually, but the moves are decided collectively.</Text>
<VStack space={5} pt="3" />
<Text style={styles.text}>● Propose Moves: Any team member can propose a move.</Text>
<VStack space={5} pt="3" />
<Text style={styles.text}> ● Vote on Moves: Each team member casts a vote for the move they believe is best.</Text>
<VStack space={5} pt="3" />
<Text style={styles.text}> ● Determine the Move: The move that receives the majority of votes is executed on the chessboard. If there's a tie, the team captain has the deciding vote.</Text>
<VStack space={5} pt="3" />
<Text style={styles.text}> ● Execute and Alternate: Once the move is executed, the turn passes to the opposing team, and the process repeats.</Text>
</Box>
<Button size="lg"  position="absolute" top="638" left="128" variant={"outline"} w="35%" p="3" style={styles.buttonMenu} onPress={() => navigation.navigate("MainMenu")}><Text style={styles.textStyle}>Back</Text></Button>
</LinearGradient>
</Box>
    )
}

const styles = StyleSheet.create ({
    text: {
        textAlign: "center",
        paddingBottom: 2,
        color: "black",
        fontWeight: "bold",
        width: "97%",
    },

    title: {
        borderBottomWidth: 3, 
        borderBottomColor: "black", 
        color: "black",
        fontWeight: "bold"
    },

    buttonMenu: {
        borderBottomWidth: 8,
        borderWidth: 3,
        borderRadius: 15,
        borderColor: "#000000",
        backgroundColor: "#97541e",
    },

    textStyle: {
        fontWeight: "bold",
        fontSize: 18,
        color: "whitesmoke",
    }
})

export default Instructions;