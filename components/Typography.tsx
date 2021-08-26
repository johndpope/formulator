import { Text } from "react-native";
import React from "react";

type TextProps = {
	style: object;
	children: React.ReactNode | React.ReactNodeArray;
};

export function HeaderText({ style, children }: TextProps) {
	return <Text style={{ fontFamily: "Poppins_700Bold", ...style }}>{children}</Text>;
}

export function BodyText({ style, children }: TextProps) {
	return <Text style={{ fontFamily: "Poppins_400Regular", ...style }}>{children}</Text>;
}

export function ButtonText({ style, children }: TextProps) {
	return <Text style={{ fontFamily: "Poppins_600SemiBold", ...style }}>{children}</Text>;
}

export function LabelText({ style, children }: TextProps) {
	return <Text style={{ fontFamily: "Poppins_600SemiBold", ...style }}>{children}</Text>;
}
