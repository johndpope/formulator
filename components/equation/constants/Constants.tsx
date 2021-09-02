import React from "react";
import tw from "../../../styles/tailwind";
import { View, Text } from "react-native";
import { formatNumber } from "../../../logic/SharedLogic";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { EquationConstant, OperationSymbolMap } from "../../../types/EquationTypes";
import { useThemeContext } from "../../../providers/ThemeProvider";

interface ConstantProps {
	constant: EquationConstant;
	color?: string;
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
		color: theme.background.primary,
		fontFamily: "Poppins_700Bold",
	};

	return (
		<View style={tw`flex flex-row items-center h-8 px-px`}>
			<View
				style={[
					{ backgroundColor: theme.colors[constant?.color || "contrast"] },
					tw`flex flex-row items-center py-1 px-1 rounded-md`,
				]}>
				<Text style={[variableTextStyle, tw`text-xs pr-1`]}>{`{`}</Text>
				<Text style={[variableTextStyle, tw`text-xs capitalize`]}>{constant.value}</Text>
				<Text style={[variableTextStyle, tw`text-xs pl-1`]}>{`}`}</Text>
			</View>
		</View>
	);
}
