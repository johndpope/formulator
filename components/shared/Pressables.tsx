import React from "react";
import tw from "../../styles/tailwind";
import { View, Text, Pressable } from "react-native";
import { FormulaAction } from "../../types/FormulatorTypes";
import { VariableAction } from "../../types/VariableTypes";
import { OperationSymbolMap } from "../../types/EquationTypes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

type PressableProps = {
	value?: string;
	dispatch: React.Dispatch<FormulaAction> | React.Dispatch<VariableAction>;
};

const pressableStyle = tw`w-1/4 h-1/5 flex items-center justify-center`;
const pressableStyleSmall = tw`w-1/5 h-1/5 flex items-center justify-center`;

const pressableTextStyle = tw`text-white text-2xl`;

const operationSymbols: OperationSymbolMap = {
	"+": "plus",
	"-": "minus",
	"*": "times",
	"/": "divide",
};

export function PressableNumber({ value, dispatch }: PressableProps) {
	return (
		<Pressable
			style={pressableStyle}
			onPress={() =>
				dispatch({
					type: "INSERT_CONSTANT",
					payload: {
						constantType: "EQ_NUMBER",
						constantValue: value,
					},
				})
			}>
			<Text style={pressableTextStyle}>{value}</Text>
		</Pressable>
	);
}

export function PressableOperation({ value, dispatch }: PressableProps) {
	return (
		<Pressable
			style={pressableStyle}
			onPress={() =>
				dispatch({
					type: "INSERT_CONSTANT",
					payload: {
						constantType: "EQ_OPERATION",
						constantValue: value,
					},
				})
			}>
			{value && (
				<FontAwesomeIcon icon={["fal", operationSymbols[value]]} size={24} style={pressableTextStyle} />
			)}
		</Pressable>
	);
}

export function PressableBracket({ value, dispatch }: PressableProps) {
	return (
		<Pressable
			style={pressableStyleSmall}
			onPress={() =>
				dispatch({
					type: "INSERT_CONSTANT",
					payload: {
						constantType: "EQ_BRACKET",
						constantValue: value,
					},
				})
			}>
			<Text style={pressableTextStyle}>{value}</Text>
		</Pressable>
	);
}

export function PressablePercent({ dispatch }: PressableProps) {
	return (
		<Pressable
			style={pressableStyleSmall}
			onPress={() =>
				dispatch({
					type: "INSERT_CONSTANT",
					payload: { constantType: "EQ_PERCENT" },
				})
			}>
			<Text style={pressableTextStyle}>%</Text>
		</Pressable>
	);
}

export function PressableNegative({ dispatch }: PressableProps) {
	return (
		<Pressable
			style={pressableStyle}
			onPress={() =>
				dispatch({
					type: "INSERT_CONSTANT",
					payload: { constantType: "EQ_NEGATIVE" },
				})
			}>
			<Text style={pressableTextStyle}>+/-</Text>
		</Pressable>
	);
}

export function PressableDecimal({ dispatch }: PressableProps) {
	return (
		<Pressable
			style={pressableStyle}
			onPress={() =>
				dispatch({
					type: "INSERT_CONSTANT",
					payload: { constantType: "EQ_DECIMAL" },
				})
			}>
			<Text style={pressableTextStyle}>.</Text>
		</Pressable>
	);
}

export function PressableLineBreak({ dispatch }: PressableProps) {
	return (
		<Pressable style={[pressableStyleSmall]} onPress={() => dispatch({ type: "INSERT_LINE_BREAK" })}>
			<FontAwesomeIcon icon={["fal", "arrow-to-bottom"]} size={24} style={pressableTextStyle} />
		</Pressable>
	);
}

export function PressableClear({ dispatch }: PressableProps) {
	return (
		<Pressable
			style={pressableStyleSmall}
			onPress={() => dispatch({ type: "CLEAR_LAST_CONSTANT" })}
			onLongPress={() => dispatch({ type: "CLEAR_ALL_CONSTANTS" })}>
			<FontAwesomeIcon icon={["fal", "backspace"]} size={24} style={pressableTextStyle} />
		</Pressable>
	);
}
