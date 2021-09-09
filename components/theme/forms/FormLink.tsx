import React from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import tw from "../../../styles/tailwind";

interface FormLinkProps {
	color: string;
	onPress: (e: GestureResponderEvent) => void;
	children: React.ReactNode | React.ReactNodeArray;
}

export function FormLink({ color, children, onPress }: FormLinkProps) {
	return (
		<TouchableOpacity onPress={onPress}>
			<Text style={tw.style(`text-sm underline`, { color: color, fontFamily: "Poppins_400Regular" })}>
				{children}
			</Text>
		</TouchableOpacity>
	);
}
