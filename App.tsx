import tw from "./styles/tailwind";
import React from "react";
import Navigator from "./Navigator";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AuthProvider from "./providers/AuthProvider";
import FormulatorProvider from "./providers/FormulatorProvider";
import {
	useFonts,
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
	Poppins_900Black,
} from "@expo-google-fonts/poppins";

export default function App() {
	const [fontsLoaded] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_600SemiBold,
		Poppins_700Bold,
		Poppins_900Black,
	});

	return (
		<View style={tw`h-full flex`}>
			{fontsLoaded ? (
				<AuthProvider>
					<FormulatorProvider>
						<Navigator />
					</FormulatorProvider>
				</AuthProvider>
			) : (
				<View style={tw`flex-1 bg-purple-200`}></View>
			)}
		</View>
	);
}
