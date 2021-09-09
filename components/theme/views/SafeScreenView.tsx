import React from "react";
import Constants from "expo-constants";
import tw from "../../../styles/tailwind";
import { SafeAreaView } from "react-native";
import { useThemeContext } from "../../../providers/ThemeProvider";

interface SafeScreenViewProps {
	padded?: boolean;
	backgroundColor?: string;
	children?: React.ReactNode | Array<React.ReactNode>;
}

export function SafeScreenView({ children, backgroundColor }: SafeScreenViewProps) {
	const { theme } = useThemeContext();
	return (
		<SafeAreaView
			style={[
				{
					backgroundColor: backgroundColor || theme.background.primary,
					paddingTop: Constants.statusBarHeight,
				},
				tw`flex-1`,
			]}>
			{children}
		</SafeAreaView>
	);
}
