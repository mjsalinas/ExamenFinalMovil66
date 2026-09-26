import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

import Home from "../screens/Home";
import Settings from "../features/Settings";
import Profile from "../features/Profile";

export type TabsParamList = {
    Profile: undefined,
    Settings: undefined,
    HomeTab: {email: string},
};

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ size }) => {
                    let icon = require("../../../assets/profile.png");

                    if (route.name === "Settings") {
                        icon = require("../../../assets/settings.png");
                    } else if (route.name === "HomeTab") {
                        icon = require("../../../assets/home.png");
                    }

                    return (
                        <Image
                            source={icon}
                            style={{ width: size, height: size }}
                            resizeMode="contain"
                        />
                    );
                },
            })}
        >
            <Tab.Screen name="Profile" component={Profile} />
            <Tab.Screen name="Settings" component={Settings} />
            <Tab.Screen name="HomeTab" component={Home} initialParams={{ email: "usuario" }} />
        </Tab.Navigator>
    );
}