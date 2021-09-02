import React from "react";
import tw from "../../../styles/tailwind";
import { View, Text } from "react-native";
import { formatNumber } from "../../../logic/SharedLogic";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { EquationConstant, OperationSymbolMap } from "../../../types/EquationTypes";
import { useThemeContext } from "../../../providers/ThemeProvider";

interface ConstantProps {
	color?: string;
	constant: EquationConstant;
}

export function Constant({ constant, color }: ConstantProps) {
	return (
		<Text
			style={[
				tw`text-xl leading-8 px-px`,
				{
					color: color || "",
					fontFamily: "PTMono_400Regular",
				},
			]}>
			{constant.value.trim()}
		</Text>
	);
}

export function ConstantNumber({ constant, color }: ConstantProps) {
	return (
		<Text
			style={[
				tw`text-xl leading-8 px-px`,
				{
					color: color || "",
					fontFamily: "PTMono_400Regular",
				},
			]}>
			{formatNumber(constant.value.trim())}
		</Text>
	);
}

const operationSymbols: OperationSymbolMap = {
	"+": "plus",
	"-": "minus",
	"*": "times",
	"/": "divide",
};

export function ConstantOperation({ constant, color }: ConstantProps) {
	return (
		<View style={tw`flex-none flex flex-row items-center h-8 px-2`}>
			<FontAwesomeIcon
				icon={["fal", `${operationSymbols[constant.value]}`]}
				size={18}
				style={[
					{
						color: color || "",
					},
					tw`leading-9`,
				]}
			/>
		</View>
	);
}

export function ConstantVariable({ constant }: ConstantProps) {
	const { theme } = useThemeContext();

	const variableTextStyle = {
		fontFamily: "Poppins_600SemiBold",
	};

	const color = theme.colors[constant.color || "contrast"];

	return (
		<View style={tw`flex flex-row px-1.5 py-1 mx-1 rounded-md overflow-hidden`}>
			<View style={[{ backgroundColor: color }, tw`absolute inset-y-0 inset-x-0 opacity-10`]}></View>
			<Text style={[{ color: color }, variableTextStyle, tw`text-sm pr-1`]}>{`{`}</Text>
			<Text style={[{ color: theme.text.primary }, variableTextStyle, tw`text-sm capitalize`]}>
				{constant.value}
			</Text>
			<Text style={[{ color: color }, variableTextStyle, tw`text-sm pl-1`]}>{`}`}</Text>
		</View>
	);
}
