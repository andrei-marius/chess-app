import React, { useState } from "react";
import { Button, Box, Image, VStack, Center, Text, Pressable } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

const MainMenu = () => {

    const navigation = useNavigation();
    const [isMuted, setMute] = useState(false);

    const handleBgMusic = () => {
        setMute(prevState => !prevState);
    };

//     const startButton = React.useRef(null);
//     const HtpButton = React.useRef(null);
//     const SettingsButton = React.useRef(null);

//     React.useEffect(() => {
//         const applyChanges = (ref) => {
//             if(ref && ref.current) {
//         ref.current.setNativeProps({
//             style: {
//             borderBottomWidth: 8,
//             borderRadius: 15,
//             borderColor: "#000000",
            
//         },
//         })
//     }
//     };

//     applyChanges(startButton);
//     applyChanges(HtpButton);
//     applyChanges(SettingsButton);

// }, [])

return (

<Box flex={1}>
<LinearGradient flex={1} colors={['#5c7cbf', '#332a43']}>
<Center flex={1} w="100%" h="75%" position="absolute" top="-40" left="1">
    <Image w="100%" h="75%" marginLeft="3" source={require('../assets/chessapp_icon.png')} alt="Logo"/>
</Center>
<Box position="absolute" w="100%" h="100%"  top="300" alignItems="center">
    <Button variant={"outline"} size="lg" w="35%" p="3" style={styles.buttonMenu} onPress={() => navigation.navigate("Queue")}>
        <Text style={styles.textStyle}>Start game</Text>
        </Button>
    <VStack space={5} pt="6" />
    <Button size="lg" variant={"outline"} w="35%" p="3" style={styles.buttonMenu} onPress={() => navigation.navigate("Instructions")}><Text style={styles.textStyle}>How to play</Text></Button>
    <VStack space={5} pt="6" />
    <Button size="lg"  variant={"outline"} w="35%" p="3" style={styles.buttonMenu} onPress={() => navigation.navigate("Account")}><Text style={styles.textStyle}>Profile</Text></Button>
    <VStack space={5} pt="6" />
    </Box>

    <Center flex={1} position="absolute" top="290" w="100%" h="100%">
        <Pressable onPress={handleBgMusic}>
    {isMuted ? (
    <Octicons name="mute" size={45} color="#7090d2" />
    ) : (
    <Octicons name="unmute" size={45} color="#7090d2" />
    )}
    </Pressable>
    </Center>
    </LinearGradient>
</Box>

);

}

const styles = StyleSheet.create({
    buttonMenu: {
        borderBottomWidth: 8,
        borderWidth: 3,
        borderRadius: 15,
        borderColor: "#000000",
        backgroundColor: "#727499"
    },

    textStyle: {
        fontWeight: "bold",
        fontSize: 18,
        color: "whitesmoke",
    }
})



export default MainMenu;