import React from "react";
import { View, Text } from "react-native";
import tw from "../../../styles/tailwind";

interface FormLabelProps {
	color: string;
	children: React.ReactNode | React.ReactNodeArray;
}

export function FormLabel({ color, children }: FormLabelProps) {
	return (
		<Text style={tw.style(`text-base p-2 py-3`, { color: color, fontFamily: "Poppins_600SemiBold" })}>
			{children}
		</Text>
	);
}
