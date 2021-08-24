import tw from "./styles/tailwind";
import React from "react";
import Navigator from "./screens/Navigator";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import FormulatorProvider from "./providers/FormulatorProvider";

export default function App() {
	return (
		<View style={tw`h-full flex`}>
			<FormulatorProvider>
				<Navigator />
			</FormulatorProvider>
		</View>
	);
}
