import React from "react";
import tw from "../../styles/tailwind";
import { View, Text, Pressable } from "react-native";
import { FormulaAction } from "../../types/FormulatorTypes";
import { VariableAction } from "../../types/VariableTypes";
import { OperationSymbolMap } from "../../types/EquationTypes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useThemeContext } from "../../providers/ThemeProvider";

type PressableProps = {
	value?: string;
	color?: string;
	dispatch: React.Dispatch<FormulaAction> | React.Dispatch<VariableAction>;
};

const numberModifierStyle = tw`flex-1 flex items-center justify-center p-2`;
const numberModifierTextStyle = [{ fontFamily: "NovaMono_400Regular" }, tw`text-white text-xl`];

const pressableStyle = tw`flex-1 flex items-center justify-center p-2`;
const pressableTextStyle = [{ fontFamily: "NovaMono_400Regular" }, tw`text-white text-2xl`];

const operationSymbols: OperationSymbolMap = {
	"+": "plus",
	"-": "minus",
	"*": "times",
	"/": "divide",
};

export function PressableNumber({ value, dispatch }: PressableProps) {
	const { theme } = useThemeContext();
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
			<View
				style={[
					{
						borderColor: theme.button.secondary,
						// backgroundColor: theme.button.secondary,
					},
					tw`h-full w-full flex items-center justify-center border rounded-md`,
				]}>
				<Text style={pressableTextStyle}>{value}</Text>
			</View>
		</Pressable>
	);
}

export function PressableOperation({ value, color, dispatch }: PressableProps) {
	const { theme } = useThemeContext();

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
			<View
				style={[
					{
						borderColor: color || theme.brand,
						// backgroundColor: theme.button.secondary,
					},
					tw`h-full w-full flex items-center justify-center border rounded-md`,
				]}>
				{value && (
					<FontAwesomeIcon
						icon={["fal", operationSymbols[value]]}
						size={24}
						style={pressableTextStyle}
					/>
				)}
			</View>
		</Pressable>
	);
}

export function PressableBracket({ value, dispatch }: PressableProps) {
	const { theme } = useThemeContext();
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
			<View
				style={[
					{
						borderColor: theme.button.secondary,
						// backgroundColor: theme.button.secondary,
					},
					tw`w-full h-full flex items-center justify-center border rounded-md`,
				]}>
				<Text style={numberModifierTextStyle}>{value}</Text>
			</View>
		</Pressable>
	);
}

export function PressablePercent({ dispatch }: PressableProps) {
	const { theme } = useThemeContext();

	return (
		<Pressable
			style={numberModifierStyle}
			onPress={() =>
				dispatch({
					type: "INSERT_CONSTANT",
					payload: { constantType: "EQ_PERCENT" },
				})
			}>
			<View
				style={[
					{
						borderColor: theme.button.secondary,
					},
					tw`w-full h-full items-center justify-center border rounded-md`,
				]}>
				<Text style={numberModifierTextStyle}>%</Text>
			</View>
		</Pressable>
	);
}

export function PressableNegative({ dispatch }: PressableProps) {
	const { theme } = useThemeContext();

	return (
		<Pressable
			style={pressableStyle}
			onPress={() =>
				dispatch({
					type: "INSERT_CONSTANT",
					payload: { constantType: "EQ_NEGATIVE" },
				})
			}>
			<View
				style={[
					{
						borderColor: theme.button.secondary,
					},
					tw`w-full h-full items-center justify-center border rounded-md`,
				]}>
				<Text style={pressableTextStyle}>+/-</Text>
			</View>
		</Pressable>
	);
}

export function PressableDecimal({ dispatch }: PressableProps) {
	const { theme } = useThemeContext();

	return (
		<Pressable
			style={pressableStyle}
			onPress={() =>
				dispatch({
					type: "INSERT_CONSTANT",
					payload: { constantType: "EQ_DECIMAL" },
				})
			}>
			<View
				style={[
					{
						borderColor: theme.button.secondary,
					},
					tw`w-full h-full items-center justify-center border rounded-md`,
				]}>
				<Text style={pressableTextStyle}>.</Text>
			</View>
		</Pressable>
	);
}

export function PressableLineBreak({ dispatch }: PressableProps) {
	const { theme } = useThemeContext();

	return (
		<Pressable style={[numberModifierStyle]} onPress={() => dispatch({ type: "INSERT_LINE_BREAK" })}>
			<View
				style={[
					{
						borderColor: theme.button.secondary,
						backgroundColor: theme.button.secondary,
					},
					tw`w-full h-full flex flex-row items-center justify-center border rounded-md`,
				]}>
				<FontAwesomeIcon
					icon={["fal", "level-down"]}
					size={26}
					style={pressableTextStyle}
					transform={{ rotate: 90 }}
				/>
			</View>
		</Pressable>
	);
}

export function PressableClear({ dispatch }: PressableProps) {
	const { theme } = useThemeContext();

	return (
		<Pressable
			style={numberModifierStyle}
			onPress={() => dispatch({ type: "CLEAR_LAST_CONSTANT" })}
			onLongPress={() => dispatch({ type: "CLEAR_ALL_CONSTANTS" })}>
			<View
				style={[
					{
						borderColor: theme.button.secondary,
						backgroundColor: theme.button.secondary,
					},
					tw`h-full w-full items-center justify-center border rounded-md`,
				]}>
				<FontAwesomeIcon icon={["fal", "backspace"]} size={26} style={pressableTextStyle} />
			</View>
		</Pressable>
	);
}
