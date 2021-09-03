import React from "react";
import { Text } from "react-native";
import tw from "../../../styles/tailwind";
import { useThemeContext } from "../../../providers/ThemeProvider";

interface TitleProps {
	text: string;
	align?: string;
}

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
