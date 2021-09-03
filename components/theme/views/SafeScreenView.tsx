import React from "react";
import Constants from "expo-constants";
import tw from "../../../styles/tailwind";
import { SafeAreaView } from "react-native";
import { useThemeContext } from "../../../providers/ThemeProvider";

interface SafeScreenViewProps {
	padded?: boolean;
	children?: React.ReactNode | Array<React.ReactNode>;
}

export function SafeScreenView({ children }: SafeScreenViewProps) {
	const { theme } = useThemeContext();
	return (
		<SafeAreaView
			style={[
				{
					backgroundColor: theme.background.primary,
					paddingTop: Constants.statusBarHeight,
				},
				tw`flex-1`,
			]}>
			{children}
		</SafeAreaView>
	);
}
