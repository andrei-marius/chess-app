import {Text, Button, VStack, Center, Box, Image} from "native-base";

const Instructions = () => {
    return (
        
<Box flex={1}>
    <Image flex={5} paddingTop="8" alt="bg" resizeMode="cover" size="xl" w="full" style={{opacity: 0.4}}source={require("../assets/chess_background.jpg")} />
<Center w="100%" h="20%" position="absolute" top="0">
    <Text fontSize="30" borderBottomColor="black" borderBottomWidth="2" >How to play?</Text>
</Center>

<Box position="absolute" w="80%" h="70%" alignItems="center" top="150" left="39" bg="#D9D9D9" p="4">
<Text color="black" textAlign="center">In this unique chess format, each move is determined not by a single player, but through a majority vote from a team. Here's how you can play:</Text>
<Text textAlign="center">Form Teams: Each side of the chessboard is controlled by a team rather than an individual. Each team discusses and decides on their moves collectively.</Text>
<Text textAlign="center">Propose Moves: During your team's turn, any team member can propose a move. Discussion is encouraged to explore the best possible strategy.</Text>
<Text textAlign="center">Vote on Moves: After a brief discussion period, the team votes on the proposed moves. Each team member casts a vote for the move they believe is best.</Text>
<Text textAlign="center">Determine the Move: The move that receives the majority of votes is executed on the chessboard. If there's a tie, the team captain has the deciding vote.</Text>
<Text textAlign="center">Execute and Alternate: Once the move is executed, the turn passes to the opposing team, and the process repeats.</Text>
</Box>

</Box>
    )
}

export default Instructions;