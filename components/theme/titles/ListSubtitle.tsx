import React from "react";
import { Text } from "react-native";
import tw from "../../../styles/tailwind";
import { useThemeContext } from "../../../providers/ThemeProvider";

interface TitleProps {
	text: string;
	align?: string;
}

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
