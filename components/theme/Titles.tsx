import React from "react";
import tw from "../../styles/tailwind";
import { StyleSheet, Text, View } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";

interface TitleProps {
	text: string;
	align?: string;
}

export const Title = ({ text, align }: TitleProps) => {
	const { theme } = useThemeContext();
	return (
		<Text
			style={[
				tw`flex-1 text-lg`,
				{
					textAlign: align || "auto",
					color: theme.text.primary,
					fontFamily: "Poppins_400Regular",
				},
			]}>
			{text}
		</Text>
	);
};

export const ListTitle = ({ text }: TitleProps) => {
	const { theme } = useThemeContext();
	return (
		<Text
			style={[
				tw`flex-1 text-base`,
				{
					color: theme.text.primary,
					fontFamily: "Poppins_500Medium",
				},
			]}>
			{text}
		</Text>
	);
};

export const ListSubtitle = ({ text }: TitleProps) => {
	const { theme } = useThemeContext();
	return (
		<Text
			style={[
				tw`flex-1 text-xs mt-2`,
				{
					color: theme.brand,
					fontFamily: "Poppins_400Regular",
				},
			]}>
			{text}
		</Text>
	);
};
