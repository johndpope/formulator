import React from "react";
import tw from "../styles/tailwind";
import { View, Text, Pressable } from "react-native";

export default function HomeScreen({ navigation }: { navigation: any }) {
	return (
		<View>
			<Pressable onPress={() => navigation.navigate("Formulator")} style={tw`p-5 bg-gray-100`}>
				<Text>Press Me</Text>
			</Pressable>
		</View>
	);
}
