import React from "react";
import tw from "../../../styles/tailwind";
import { Pressable, Text } from "react-native";
import { useThemeContext } from "../../../providers/ThemeProvider";
import { IconProp, text } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface ButtonProps {
	onPress: () => void;
	onLongPress?: () => void;
	icon: IconProp;
	text: string;
	textColor?: string;
	borderColor?: string;
	backgroundColor?: string;
}

export const Button = ({
	onPress,
	onLongPress,
	icon,
	text,
	textColor,
	borderColor,
	backgroundColor,
}: ButtonProps) => {
	const { theme } = useThemeContext();
	return (
		<Pressable
			onPress={onPress}
			style={[
				{
					borderColor: borderColor || backgroundColor || theme.brand,
					backgroundColor: backgroundColor || theme.brand,
				},
				tw`flex flex-row items-center rounded-full border-2 px-4 py-2`,
			]}>
			<FontAwesomeIcon icon={icon} size={20} style={{ color: theme.text.primary }} />
			<Text
				style={[
					{
						color: textColor || theme.text.primary,
						fontFamily: "Poppins_600SemiBold",
					},
					tw`text-base mx-auto`,
				]}>
				{text}
			</Text>
		</Pressable>
	);
};
