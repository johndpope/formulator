import React from "react";
import { Text } from "react-native";
import tw from "../../../styles/tailwind";
import { useThemeContext } from "../../../providers/ThemeProvider";

interface TitleProps {
	padded?: boolean;
	text: string;
	align?: string;
}

export const Title = ({ text, align, padded = false }: TitleProps) => {
	const { theme } = useThemeContext();
	return (
		<Text
			style={tw.style(`flex-1 text-lg`, {
				"px-2": padded,
				textAlign: align || "auto",
				color: theme.text.primary,
				fontFamily: "Poppins_400Regular",
			})}>
			{text}
		</Text>
	);
};
