import React from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import tw from "../../../styles/tailwind";

interface FormTextProps {
	color: string;
	children: React.ReactNode | React.ReactNodeArray;
}

export function FormText({ color, children }: FormTextProps) {
	return (
		<Text style={tw.style(`text-sm`, { color: color, fontFamily: "Poppins_400Regular" })}>
			{children}
		</Text>
	);
}
