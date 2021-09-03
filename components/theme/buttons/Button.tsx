import React from "react";
import tw from "../../../styles/tailwind";
import { Pressable, Text } from "react-native";
import { useThemeContext } from "../../../providers/ThemeProvider";
import { IconProp, text } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface ButtonProps {
	block?: boolean;
	size?: "sm" | "md" | "lg";
	iconPosition?: "left" | "right";
	text?: string;
	icon?: IconProp;
	textColor?: string;
	borderColor?: string;
	backgroundColor?: string;
	onPress: () => void;
	onLongPress?: () => void;
}

export const Button = ({
	size = "md",
	iconPosition = "left",
	text,
	icon,
	textColor,
	borderColor,
	backgroundColor,
	onPress,
	onLongPress,
}: ButtonProps) => {
	const { theme } = useThemeContext();
	const iconSizes = {
		sm: 18,
		md: 20,
		lg: 24,
	};
	return (
		<Pressable
			onPress={onPress}
			style={tw.style(`flex flex-row items-center rounded-full border-2`, {
				borderColor: borderColor || backgroundColor || theme.brand,
				backgroundColor: backgroundColor || theme.brand,
				"flex-row-reverse": iconPosition === "right",
				"px-3 py-1": size === "sm",
				"px-3 py-2.5": size === "md",
				"px-3 py-3": size === "lg",
			})}>
			{icon && (
				<FontAwesomeIcon icon={icon} size={iconSizes[size]} color={textColor || theme.text.primary} />
			)}
			<Text
				style={tw.style(`mx-auto`, {
					fontFamily: "Poppins_600SemiBold",
					color: textColor || theme.text.primary,
					"text-sm": size === "sm",
					"text-base": size === "md",
					"text-lg": size === "lg",
				})}>
				{text}
			</Text>
		</Pressable>
	);
};
