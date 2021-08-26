import tw from "./styles/tailwind";
import React from "react";
import Navigator from "./Navigator";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AuthProvider from "./providers/AuthProvider";
import FormulatorProvider from "./providers/FormulatorProvider";

export default function App() {
	return (
		<View style={tw`h-full flex`}>
			<AuthProvider>
				<FormulatorProvider>
					<Navigator />
				</FormulatorProvider>
			</AuthProvider>
		</View>
	);
}
