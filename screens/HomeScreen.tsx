import React from "react";
import tw from "../styles/tailwind";
import { View, Text, Pressable } from "react-native";

export default function HomeScreen({ navigation }: { navigation: any }) {
	return (
		<View style={tw`flex-1 bg-gray-100 flex flex-col items-center justify-center`}>
			<Pressable
				onPress={() =>
					navigation.navigate("Formulator", {
						formula: {
							name: "Custom Name",
							equation: " 1 + 1 * ( 2 + 3 )",
							result: null,
							openBrackets: 0,
							lastConstantType: "EqBracketClosed",
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
