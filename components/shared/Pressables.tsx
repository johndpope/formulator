import React from "react";
import tw from "../../styles/tailwind";
import { View, Text, Pressable } from "react-native";
import { FormulaAction } from "../../types/FormulatorTypes";
import { VariableAction } from "../../types/VariableTypes";

type PressableProps = {
	value?: string;
	dispatch: React.Dispatch<FormulaAction> | React.Dispatch<VariableAction>;
};

const pressableStyle = tw`w-1/4 h-1/5 bg-gray-200 flex items-center justify-center`;

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
			<Text>{value}</Text>
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
			<Text>{value}</Text>
		</Pressable>
	);
}

export function PressableBracket({ value, dispatch }: PressableProps) {
	return (
		<Pressable
			style={pressableStyle}
			onPress={() =>
				dispatch({
					type: "INSERT_CONSTANT",
					payload: {
						constantType: "EQ_BRACKET",
						constantValue: value,
					},
				})
			}>
			<Text>{value}</Text>
		</Pressable>
	);
}

export function PressablePercent({ dispatch }: PressableProps) {
	return (
		<Pressable
			style={pressableStyle}
			onPress={() =>
				dispatch({
					type: "INSERT_CONSTANT",
					payload: { constantType: "EQ_PERCENT" },
				})
			}>
			<Text>%</Text>
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
			<Text>+/-</Text>
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
			<Text>.</Text>
		</Pressable>
	);
}

export function PressableClear({ dispatch }: PressableProps) {
	return (
		<Pressable
			style={pressableStyle}
			onPress={() => dispatch({ type: "CLEAR_LAST_CONSTANT" })}
			onLongPress={() => dispatch({ type: "CLEAR_ALL_CONSTANTS" })}>
			<Text>A/C</Text>
		</Pressable>
	);
}
