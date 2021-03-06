import React from "react";
import tw from "../../../styles/tailwind";
import { Pressable } from "react-native";
import { useThemeContext } from "../../../providers/ThemeProvider";
import { IconProp, text } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface IconButtonProps {
	size?: "sm" | "md" | "lg";
	icon: IconProp;
	flip?: boolean;
	color?: string;
	backgroundColor?: string;
	onPress: () => void;
	onLongPress?: () => void;
}

export const IconButton = ({
	size = "md",
	icon,
	flip,
	color,
	backgroundColor,
	onPress,
}: IconButtonProps) => {
	const { theme } = useThemeContext();
	const iconSizes = { sm: 18, md: 20, lg: 24 };

	return (
		<Pressable
			onPress={onPress}
			style={tw.style(theme.shape, {
				backgroundColor: backgroundColor || "transparent",
				"w-6 h-6": size === "sm",
				"w-8 h-8": size === "md",
				"w-12 h-12": size === "lg",
			})}>
			{({ pressed }) => (
				<FontAwesomeIcon
					color={pressed ? theme.brand : color || theme.text.primary}
					icon={icon}
					size={iconSizes[size]}
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
