import React from "react";
import { Button, Box, Image, VStack, Center, Text, Pressable } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const MainMenu = () => {

    const navigation = useNavigation();
    const [isMuted, setMute] = React.useState(false);

    const handleBgMusic = () => {
        setMute(prevState => !prevState);
    };
    
    const startButton = React.useRef(null);
    const HtpButton = React.useRef(null);
    const SettingsButton = React.useRef(null);

    React.useEffect(() => {
        const applyChanges = (ref) => {
            if(ref && ref.current) {
        ref.current.setNativeProps({
            style: {
            borderBottomWidth: 8,
            borderRadius: 15,
            borderColor: "#074173",
        },
        })
    }
    };

    applyChanges(startButton);
    applyChanges(HtpButton);
    applyChanges(SettingsButton);
    
}, [])

return (

<Box flex={1}>
    <Image flex={5} paddingTop="8" alt="bg" resizeMode="cover" size="xl" w="full" style={{opacity: 0.4}}source={require("../assets/chess_background.jpg")} />
<Center flex={1} w="100%" h="70%" position="absolute" top="0">
    <Image w="100%" h="75%" marginLeft="3" source={require('../assets/chessapp_icon.png')} alt="Logo"/>
</Center>
<Box position="absolute" w="full" h="full"  top="350" alignItems="center">
    <Button variant={"outline"} size="lg" bg="#1679AB" w="35%" p="3" ref={startButton} onPress={() => navigation.navigate("Queue")}><Text fontWeight="bold" fontSize="18" color="whitesmoke">Start game</Text></Button>
    <VStack space={5} pt="6" />
    <Button size="lg" variant={"outline"} bg="#1679AB" w="35%" p="3" ref={HtpButton} onPress={() => navigation.navigate("Instructions")}><Text fontWeight="bold" fontSize="18" color="whitesmoke">How to play</Text></Button>
    <VStack space={5} pt="6" />
    <Button size="lg"  variant={"outline"} bg="#1679AB" w="35%" p="3" ref={SettingsButton} onPress={() => navigation.navigate("Settings")}><Text fontWeight="bold" fontSize="18" color="whitesmoke">Settings</Text></Button>
    <VStack space={5} pt="6" />
    </Box>

    <Center flex={1} position="absolute" top="300" w="100%" h="100%">
        <Pressable onPress={handleBgMusic}>
    {isMuted ? (
    <Octicons name="mute" size={50} color="black" />
    ) : (
    <Octicons name="unmute" size={50} color="black" />
    )}
    </Pressable>
    </Center>
</Box>

);

}

    

export default MainMenu;

