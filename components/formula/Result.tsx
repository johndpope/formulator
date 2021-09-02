import React from "react";
import tw from "../../styles/tailwind";
import { View, Text } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface ResultProps {
	data: string | null;
	color?: string;
}

export default function Result({ data, color }: ResultProps) {
	const { theme } = useThemeContext();
	return (
		<View
			style={[
				{
					borderColor: theme.border,
					backgroundColor: theme.background.secondary,
				},
				tw`flex flex-row h-10 w-full items-center justify-between pl-2 pr-4 border-b`,
			]}>
			<>
				<FontAwesomeIcon icon={["fal", "equals"]} size={20} color={theme.text.secondary} />
				<Text
					style={[
						{
							color: data === null ? theme.colors.error : theme.colors.green,
							fontFamily: "NovaMono_400Regular",
						},
						tw` text-xl`,
					]}>
					{data === null ? "!" : data}
				</Text>
			</>
		</View>
	);
}
