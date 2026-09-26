import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text } from "react-native";
import React from "react";

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";


import CustomButton from "../components/CustomButton";
import { RootStackParamList } from "../navigation/StackNavigator";
import { TabsParamList } from "../navigation/TbsNavigator";


type NestedFeedProps = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function Home({ route, navigation }: NestedFeedProps) {
    const { email } = route.params;

    const handleGoToSettings = () => {
        navigation.navigate("Settings");
    };

    return (
        <View>
            <Text>Bienvenido, {email}</Text>
            <CustomButton title="Preferencias de usuario" onPress={handleGoToSettings} />
        </View>
    );
}