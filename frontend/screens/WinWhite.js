import {Box, Flex, Text, Center, Button} from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6 } from '@expo/vector-icons';



const WinWhite = () => 
    {const navigation = useNavigation();

        return (
            <Box flex={1}>
            <LinearGradient flex={1} colors={['#38761d', '#7f6000']}> 
            <Center w="100%" h="auto" position="absolute" top="150">
                <Text fontSize="30" style={styles.title} >Well Done!</Text>
            </Center>
            
            <Box position="absolute" w="78%" h="35%" alignItems="center" top="250" left="39" bg="#eeeeee" borderRadius={10} borderBottomWidth="8" borderWidth="3" p="5">
            <Text style={styles.text} fontSize="35">White Team Wins!</Text>
            </Box>
            <FontAwesome6 name="chess-queen" size={55} color="black" style={styles.chessPiece}/>
            <Flex direction="row" justifyContent="center" alignItems="center" position="relative" top="598">
            <Button size="lg" variant={"outline"} w="35%" p="3" style={styles.buttonMenu} mr="10" onPress={() => navigation.navigate("Queue")}><Text style={styles.textStyle}>Play again</Text></Button>
            <Button size="lg"  variant={"outline"} w="35%" p="3" style={styles.buttonMenu} onPress={() => navigation.navigate("MainMenu")}><Text style={styles.textStyle}>Back</Text></Button>
            </Flex>
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
                    paddingTop: 10
                },
            
                title: {
                    borderBottomWidth: 3, 
                    borderBottomColor: "whitesmoke", 
                    color: "whitesmoke",
                    fontWeight: "bold"
                },
            
                buttonMenu: {
                    borderBottomWidth: 8,
                    borderWidth: 3,
                    borderRadius: 15,
                    borderColor: "#000000",
                    backgroundColor: "#c16216",
                },
            
                textStyle: {
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "whitesmoke",
                },

                chessPiece: {
                    position: "absolute",
                    top: 410,
                    left: 172,

                }
            })


export default WinWhite