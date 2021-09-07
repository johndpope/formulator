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
			numberOfLines={1}
			style={[
				tw`text-xs mt-2 overflow-hidden`,
				{
					color: theme.brand,
					fontFamily: "Poppins_400Regular",
				},
			]}>
			{text}
		</Text>
	);
};
