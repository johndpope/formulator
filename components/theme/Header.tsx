import React from "react";
import tw from "../../styles/tailwind";
import { StyleSheet, Text, View } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";
import { ViewStyle } from "react-native";

interface HeaderProps {
	style?: ViewStyle;
	children?: React.ReactNode | Array<React.ReactNode>;
}

export const Header = ({ children, style }: HeaderProps) => {
	const { theme } = useThemeContext();
	return (
		<View style={[tw`w-full flex flex-row px-5 h-14 items-center justify-between`, style]}>
			{children}
		</View>
	);
};
