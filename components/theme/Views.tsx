import React from "react";
import Constants from "expo-constants";
import tw from "../../styles/tailwind";
import { View, SafeAreaView } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";

interface ScreenViewProps {
	noPadding?: boolean;
	children?: React.ReactNode | Array<React.ReactNode>;
}

export function ScreenView({ children, noPadding }: ScreenViewProps) {
	const { theme } = useThemeContext();
	return (
		<View
			style={[
				{
					backgroundColor: theme.background.primary,
					paddingTop: !noPadding ? Constants.statusBarHeight : 0,
				},
				tw`flex-1`,
			]}>
			{children}
		</View>
	);
}

export function SafeScreenView({ children }: ScreenViewProps) {
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

export function WrapperView({ children }: ScreenViewProps) {
	return <View style={tw`w-full flex-1 flex flex-col px-5 justify-start`}>{children}</View>;
}
