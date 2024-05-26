import { Button, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCustomContext } from "../contexts/globalContext";

const Account = () => {
    const { setUser } = useCustomContext()

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setUser(null)
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="LOG OUT" onPress={handleLogout}></Button>
        </View>
    )
}

export default Account
