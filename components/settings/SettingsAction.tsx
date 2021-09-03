import React from "react";
import tw from "../../styles/tailwind";
import { Pressable, View, Text } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface SettingsActionProps {
	text: string;
	icon?: IconProp;
	onPress: () => void;
	children?: React.ReactNode | Array<React.ReactNode>;
}

export const SettingsAction = ({ text, icon, children, onPress }: SettingsActionProps) => {
	const { theme } = useThemeContext();
	return (
		<Pressable
			style={tw.style(`flex flex-row items-center px-5 py-4 border-b`, {
				borderColor: theme.background.secondary,
			})}
			onPress={onPress}>
			{icon && <FontAwesomeIcon icon={icon} size={18} color={theme.brand} style={tw`mr-4`} />}
			<Text
				style={tw.style(
					{
						fontFamily: "Poppins_400Regular",
						color: theme.text.primary,
					},
					"text-base capitalize"
				)}>
				{text}
			</Text>
			<View style={tw`flex-1 flex flex-row items-center justify-end`}>{children}</View>
		</Pressable>
	);
};
