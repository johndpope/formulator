import React from "react";
import { Text } from "react-native";
import tw from "../../../styles/tailwind";
import { useThemeContext } from "../../../providers/ThemeProvider";

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
