import React from "react";
import { View, Text } from "react-native";
import tw from "../../../styles/tailwind";

interface FormHeaderProps {
	color: string;
	children: React.ReactNode | React.ReactNodeArray;
}

export function FormHeader({ color, children }: FormHeaderProps) {
	return (
		<Text style={tw.style(`text-3xl leading-12 p-2`, { color: color, fontFamily: "Poppins_700Bold" })}>
			{children}
		</Text>
	);
}
