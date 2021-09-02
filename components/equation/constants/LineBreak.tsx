import React from "react";
import tw from "../../../styles/tailwind";
import { View } from "react-native";

interface ConstantLineBreakProps {
	index: number;
	numConstants: number;
}

export default function ConstantLineBreak({ index, numConstants }: ConstantLineBreakProps) {
	return <View style={[tw`w-full h-${index === numConstants ? "9" : "0"}`]}></View>;
}
