import React from "react";
import tw from "../../styles/tailwind";
import { View, Text, Pressable } from "react-native";
import { Formula, FormulaAction } from "../../types/FormulatorTypes";
import { VariableAction } from "../../types/VariableTypes";
import { OperationSymbolMap } from "../../types/EquationTypes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useThemeContext } from "../../providers/ThemeProvider";
import { useFormulatorContext } from "../../providers/FormulatorProvider";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../../types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { defaultVariableState } from "../../logic/VariableLogic";

type PressableProps = {
	value?: string;
	disabled?: boolean;
	dispatch: React.Dispatch<FormulaAction> | React.Dispatch<VariableAction>;
};

const numberModifierStyle = tw`flex-1 flex items-center justify-center p-1.5`;
const numberModifierTextStyle = [{ fontFamily: "NovaMono_400Regular" }, tw`text-white text-xl`];

const pressableStyle = tw`flex-1 flex items-center justify-center p-1.5`;
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
				style={tw.style(
					theme.shape,
					{ borderColor: theme.button.secondary },
					`h-full w-full flex items-center justify-center border`
				)}>
				<Text style={pressableTextStyle}>{value}</Text>
			</View>
		</Pressable>
	);
}

export function PressableOperation({ value, dispatch }: PressableProps) {
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
				style={tw.style(
					theme.shape,
					{ borderColor: theme.button.secondary },
					`h-full w-full flex items-center justify-center border`
				)}>
				{value && (
					<FontAwesomeIcon icon={["fal", operationSymbols[value]]} size={24} color={theme.brand} />
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
				style={tw.style(
					theme.shape,
					{ borderColor: theme.button.secondary },
					`h-full w-full flex items-center justify-center border`
				)}>
				<Text style={[numberModifierTextStyle, { color: theme.brand }]}>{value}</Text>
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
				style={tw.style(
					theme.shape,
					{ borderColor: theme.button.secondary },
					`h-full w-full flex items-center justify-center border`
				)}>
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
				style={tw.style(
					theme.shape,
					{ borderColor: theme.button.secondary },
					`h-full w-full flex items-center justify-center border`
				)}>
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
				style={tw.style(
					theme.shape,
					{ borderColor: theme.button.secondary },
					`h-full w-full flex items-center justify-center border`
				)}>
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
				style={tw.style(
					theme.shape,
					{
						borderColor: theme.button.secondary,
						backgroundColor: theme.button.secondary,
					},
					`h-full w-full flex flex-row items-center justify-center border`
				)}>
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
				style={tw.style(
					theme.shape,
					{
						borderColor: theme.button.secondary,
						backgroundColor: theme.button.secondary,
					},
					`h-full w-full flex flex-row items-center justify-center border`
				)}>
				<FontAwesomeIcon icon={["fal", "backspace"]} size={26} style={pressableTextStyle} />
			</View>
		</Pressable>
	);
}

export function PressableSaveAsVariable() {
	const { theme } = useThemeContext();
	const { formula } = useFormulatorContext();
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

	const [disabled, setDisabled] = React.useState<boolean>(false);

	React.useEffect(() => {
		const shouldDisable = !formula.equation.length;
		if (shouldDisable !== disabled) setDisabled(shouldDisable);
	}, [formula.equation]);

	function compressFormulaToVariable() {
		// Replace variables with their result values
		let equation = formula.equation;
		if (formula?.variables.length) {
			equation = formula.equation.replace(/\{.+?\}/g, (match) => {
				let variable = formula.variables.find((v) => {
					return v.name === match.substring(1, match.length - 1);
				});
				if (!variable) return "";
				return `${variable.result}`;
			});
		}
		navigation.navigate("Variable", { variable: { ...defaultVariableState, equation } });
	}

	return (
		<Pressable disabled={disabled} style={numberModifierStyle} onPress={compressFormulaToVariable}>
			<View
				style={tw.style(
					theme.shape,
					{
						opacity: disabled ? 0.1 : 1,
						borderColor: theme.button.secondary,
					},
					`h-full w-full flex flex-row items-center justify-center border`
				)}>
				<Text
					style={tw.style(`text-sm`, {
						color: theme.brand,
						fontFamily: "Poppins_400Regular",
					})}>
					Save as Variable
				</Text>
			</View>
		</Pressable>
	);
}
