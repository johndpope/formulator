import React from "react";
import tw from "../../styles/tailwind";
import { View, Text } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";

interface SettingsTitleProps {
	text: string;
}

export const SettingsTitle = ({ text }: SettingsTitleProps) => {
	const { theme } = useThemeContext();
	return (
		<Text
			style={tw.style(
				{
					fontFamily: "Poppins_600SemiBold",
					backgroundColor: theme.background.secondary,
					color: theme.text.secondary,
				},
				"px-5 py-2 text-sm capitalize"
			)}>
			{text}
		</Text>
	);
};
