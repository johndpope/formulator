import React from "react";
import tw from "../../styles/tailwind";
import { Pressable, Text } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";
import { IconProp, text } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { theme } from "../../tailwind.config";

interface ButtonProps {
	small?: boolean;
	text: string;
	icon?: IconProp;
	onPress: () => void;
	onLongPress?: () => void;
	color?: string;
	backgroundColor?: string;
}

export const ButtonPrimary = ({
	text,
	icon,
	small,
	color,
	backgroundColor,
	onPress,
	onLongPress,
}: ButtonProps) => {
	const { theme } = useThemeContext();
	return (
		<Pressable
			onPress={onPress}
			style={[
				{
					borderColor: backgroundColor || theme.brand,
					backgroundColor: backgroundColor || theme.brand,
				},
				tw`flex flex-row items-center rounded-full border-2 ${small ? `px-3 py-1` : `px-4 py-2`}`,
			]}>
			{icon && <FontAwesomeIcon icon={icon} size={20} style={tw`${theme.text.primary}`} />}
			<Text
				style={[
					{
						color: color || theme.text.primary,
						fontFamily: "Poppins_600SemiBold",
					},
					tw`text-base mx-auto`,
				]}>
				{text}
			</Text>
		</Pressable>
	);
};

export const ButtonSecondary = ({ icon, text, small, onPress, onLongPress }: ButtonProps) => {
	const { theme } = useThemeContext();
	return (
		<Pressable
			onPress={onPress}
			style={[
				{
					borderColor: theme.button.secondary,
					backgroundColor: theme.button.secondary,
				},
				tw`flex flex-row items-center rounded-full border-2 ${small ? `px-3 py-1` : `px-4 py-2`}`,
			]}>
			{icon && <FontAwesomeIcon icon={icon} size={20} style={{ color: theme.text.primary }} />}
			<Text
				style={[
					{
						color: theme.text.primary,
						fontFamily: "Poppins_600SemiBold",
					},
					tw`text-base mx-auto`,
				]}>
				{text}
			</Text>
		</Pressable>
	);
};

interface IconButtonProps {
	flip?: boolean;
	size?: number;
	color?: string;
	icon: IconProp;
	onPress: () => void;
	onLongPress?: () => void;
}

export const IconButton = ({ icon, size, flip, color, onPress }: IconButtonProps) => {
	const { theme } = useThemeContext();

	return (
		<Pressable onPress={onPress} style={tw`w-10 h-10`}>
			{({ pressed }) => (
				<FontAwesomeIcon
					color={pressed ? theme.brand : color || theme.text.primary}
					icon={icon}
					size={size || 20}
					style={[
						tw`m-auto`,
						{
							transform: [{ scaleX: flip ? -1 : 1 }],
						},
					]}
				/>
			)}
		</Pressable>
	);
};
