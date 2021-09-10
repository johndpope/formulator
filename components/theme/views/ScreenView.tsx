import React from "react";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import tw from "../../../styles/tailwind";
import { View, Platform } from "react-native";
import { useThemeContext } from "../../../providers/ThemeProvider";

interface ScreenViewProps {
	padded?: boolean;
	children?: React.ReactNode | Array<React.ReactNode>;
}

export function ScreenView({ children, padded = true }: ScreenViewProps) {
	const { theme } = useThemeContext();
	return (
		<View
			style={[
				{
					backgroundColor: theme.background.primary,
					paddingTop: padded ? Constants.statusBarHeight : 0,
				},
				tw`flex-1`,
			]}>
			{children}
			<StatusBar style="light" />
		</View>
	);
}
