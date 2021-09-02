import "react-native-get-random-values";
import tw from "./styles/tailwind";
import React from "react";
import Navigator from "./Navigator";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AuthProvider from "./providers/AuthProvider";
import FormulatorProvider from "./providers/FormulatorProvider";
import ThemeProvider from "./providers/ThemeProvider";

import { fal } from "@fortawesome/pro-light-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fab, fal);

import { PTMono_400Regular } from "@expo-google-fonts/pt-mono";
import { NovaMono_400Regular } from "@expo-google-fonts/nova-mono";
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
		NovaMono_400Regular,
		PTMono_400Regular,
	});

	return (
		<View style={tw`h-full flex`}>
			{fontsLoaded ? (
				<AuthProvider>
					<ThemeProvider>
						<FormulatorProvider>
							<Navigator />
						</FormulatorProvider>
					</ThemeProvider>
				</AuthProvider>
			) : (
				<View style={tw`flex-1 bg-purple-200`}></View>
			)}
		</View>
	);
}
