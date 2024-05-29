import {Box, Flex, Text, Center, Button} from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';


const Draw = () => 
    {
        const navigation = useNavigation();

        return (
            <Box flex={1}>
            <LinearGradient flex={1} colors={['#332a43', '#354c7c']}> 
            <Center w="100%" h="auto" position="absolute" top="150">
                <Text fontSize="30" style={styles.title} >Game Over</Text>
            </Center>
            
            <Box position="absolute" w="78%" h="35%" alignItems="center" top="250" left="39" bg="#eeeeee" borderRadius={10} borderBottomWidth="8" borderWidth="3" p="7">
            <Text style={styles.text} fontSize="35">It's a draw!</Text>
            </Box>
            <Flex direction="row" justifyContent="center" alignItems="center" style={{marginTop: 390}}>
            <MaterialCommunityIcons name="chess-queen" size={65} color="black" style={{marginRight: 30, marginLeft: 10}}/>
            <FontAwesome6 name="chess-queen" size={55} color="black" style={{marginRight: 30, marginLeft: 5 }}/>
            </Flex>
            <Flex direction="row" justifyContent="center" alignItems="center" style={{marginTop: 110}}>
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
                    paddingTop: 30
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
                    backgroundColor: "#727499",
                },
            
                textStyle: {
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "whitesmoke",
                },

            })

export default Draw;