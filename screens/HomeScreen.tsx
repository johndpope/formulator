import React from "react";
import tw from "../styles/tailwind";
import { View, Text, Pressable } from "react-native";
import { HomeScreenProps } from "../types/NavigatorTypes";

export default function HomeScreen({ navigation }: HomeScreenProps) {
	return (
		<View style={tw`flex-1 bg-gray-100 flex flex-col items-center justify-center`}>
			<Pressable
				onPress={() =>
					navigation.navigate("Formulator", {
						formula: {
							name: "Custom Name",
							equation: " 1 + 1",
							result: null,
							openBrackets: 0,
							lastConstantType: "EQ_NUMBER",
							variables: [],
						},
					})
				}
				style={tw`p-5 bg-gray-200`}>
				<Text>Press Me</Text>
			</Pressable>
		</View>
	);
}
