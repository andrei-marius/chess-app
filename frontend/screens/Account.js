import {Box, Flex, Image, Text, Center, Button} from "native-base";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useCustomContext } from "../contexts/globalContext";
import CountryFlag from "react-native-country-flag";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';




const Account = () => {
    // const { setUser } = useCustomContext()

    // const handleLogout = async () => {
    //     await AsyncStorage.removeItem('token');
    //     setUser(null)
    // };

    return (
        <Box flex={1}>
        <LinearGradient flex={1} colors={['#c59f2a', '#b45f06']}>
            <Center style={styles.userTitle}>
            <Text fontSize="18" fontWeight="bold" borderBottomWidth="2" mb="1">Welcome,</Text>
            <Text fontSize="30" fontWeight="bold">BABANCA</Text>
            </Center>
            <Flex direction="row" justifyContent="center" alignItems="center" style={styles.user} position="relative"> 
            <Text style={styles.textSpacing} fontSize="23" fontWeight="bold">LVL 1</Text>
                <Image source={require("../assets/profile_pic.jpeg")} alt="User profile picture" style={styles.userImg}/>
                <AntDesign position="absolute" name="pluscircle" size={45} color="#97541e" style={{top: 155, left: 240}}/>
                <Flex direction="column" style={styles.textSpacing}>
                <CountryFlag isoCode="dk" size={35} />
                <Text mt="1" fontWeight="bold" fontSize="15">DENMARK</Text>
                </Flex>
            </Flex>
            <Box style={styles.info} position="absolute">
                <Text style={styles.achievments}>Your achievments</Text>
                <Flex direction="row">
                <MaterialCommunityIcons name="trophy-award" size={45} color="#97541e" style={styles.trophies} />
                <MaterialCommunityIcons name="trophy" size={45} color="#97541e" style={styles.trophies}/>
                <MaterialCommunityIcons name="trophy" size={45} color="#97541e" style={styles.trophies}/>
                <MaterialCommunityIcons name="trophy-award" size={45} color="#97541e" style={styles.trophies}/>
                </Flex>
                <Button style={styles.buttonAchievments}><Text style={styles.buttonText}>See all achievments</Text></Button>
                <Box borderBottomColor="black" borderBottomWidth="2" top="180"></Box>
                <Flex direction="row" mb="6" top="210">
                <Text top="0" style={styles.additional1}>Member since:</Text>
                <Text top="0" style={styles.additional2}>August 18th, 2023</Text>
                </Flex>
                <Flex direction="row" top="220">
                    <Text style={styles.additional1}>Your email:</Text>
                    <Text style={styles.additional3}>babanca123@gmail.com</Text>
                </Flex>
                {/* <Button><Text>Edit profile</Text></Button> */}
            </Box>
        </LinearGradient>
        </Box>
    )
}

const styles = StyleSheet.create({

    userTitle: {
        marginTop: 20
    },

    userImg: {
        borderRadius: 100,
        borderColor: "whitesmoke",
        borderWidth: 5,
    },

    user: {
        top: 20,
        zIndex: 2,
        left: 5
       
    },

    textSpacing: {
        marginHorizontal: 20,
    },
    
    info: {
        backgroundColor: "whitesmoke",
        borderRadius: 50,
        width: "100%",
        height: "80%",
        top: 265,
        zIndex: 1
    },

    achievments: {
        fontSize: 20,
        borderBottomWidth: 2,
        paddingBottom: 5,
        fontWeight: "bold",
        textAlign: "left",
        top: 80,
        paddingLeft: 15
    },

    trophies: {
        marginHorizontal: 28,
        top: 110,
        justifyContent: "center",
        alignItems: "center"
    },

    buttonAchievments: {
        top: 140,
        width: "50%",
        height: "10%",
        left: 102,
        borderRadius: 15,
        borderWidth: 3,
        borderBottomWidth: 8,
        backgroundColor: "#97541e",
    },

    buttonText: {
        fontWeight: "bold",
        fontSize: 18,
        color: "whitesmoke"
    },
    
    additional1: {
        marginLeft: 20,
        fontSize: 15,
        fontWeight: "bold"
    },

    additional2: {
        marginLeft: 140,
        fontSize: 15,
        fontWeight: "bold",
        borderBottomWidth: 2,
    },

    additional3: {
        marginLeft: 123,
        fontSize: 15,
        fontWeight: "bold",
        borderBottomWidth: 2,
    }
})

export default Account
