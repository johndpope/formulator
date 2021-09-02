import React from "react";
import tw from "../styles/tailwind";
import { SafeAreaView, View, Text, TextInput, Pressable } from "react-native";
import { VariableScreenProps } from "../types/NavigatorTypes";
import { Variable, VariableAction } from "../types/VariableTypes";
import { useFormulatorContext } from "../providers/FormulatorProvider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Result from "../components/formula/Result";
import Equation from "../components/equation/Equation";
import Calculator from "../components/calculator/Calculator";
import ColorPicker from "../components/variable/ColorPicker";
import {
	calculateResult,
	clearVariableAll,
	clearVariableLast,
	insertVariableBracket,
	insertVariableDecimal,
	insertVariableNegative,
	insertVariableNumber,
	insertVariableOperation,
	insertVariablePercent,
	insertVariableLineBreak,
	insertVariableLineBreakBefore,
} from "../logic/VariableLogic";
import { ScreenView, IconButton, Header, ButtonPrimary } from "../components/ThemeComponents";
import { useThemeContext } from "../providers/ThemeProvider";

const defaultVariableState: Variable = {
	name: "New Variable",
	color: "yellow",
	equation: "",
	result: null,
	openBrackets: 0,
	lastConstantType: "",
};

const variableReducer = (state: Variable, action: VariableAction): Variable => {
	const { type, payload } = action;

	switch (type) {
		case "INIT":
			// Check if payload is an instance of Variable
			if (payload == null || typeof payload === "string" || !("color" in payload)) return state;
			return payload;
		case "RESET":
			return defaultVariableState;

		case "CHANGE_NAME":
			if (typeof payload !== "string") return state;
			return { ...state, name: payload };

		case "CHANGE_COLOR":
			if (typeof payload !== "string") return state;
			return { ...state, color: payload };

		case "CLEAR_LAST_CONSTANT":
			return clearVariableLast(state);

		case "CLEAR_ALL_CONSTANTS":
			return clearVariableAll(state);

		case "CALCULATE_RESULT":
			return calculateResult(state);

		case "INSERT_LINE_BREAK":
			return insertVariableLineBreak(state);

		case "INSERT_LINE_BREAK_BEFORE":
			return insertVariableLineBreakBefore(state);

		case "INSERT_CONSTANT":
			if (!payload || typeof payload === "string" || !("constantType" in payload)) return state;

			switch (payload?.constantType) {
				case "EQ_NUMBER":
					return insertVariableNumber(state, payload.constantValue);
				case "EQ_OPERATION":
					return insertVariableOperation(state, payload.constantValue);
				case "EQ_BRACKET":
					return insertVariableBracket(state, payload.constantValue);
				case "EQ_PERCENT":
					return insertVariablePercent(state);
				case "EQ_NEGATIVE":
					return insertVariableNegative(state);
				case "EQ_DECIMAL":
					return insertVariableDecimal(state);
				default:
					return state;
			}

		default:
			return state;
	}
};

export default function VariableScreen({ route, navigation }: VariableScreenProps) {
	const { theme } = useThemeContext();
	const { formula, formulaDispatch } = useFormulatorContext();

	const [variable, dispatch] = React.useReducer(variableReducer, defaultVariableState);
	const [nameIsInvalid, setNameIsInvalid] = React.useState<boolean>(false);

	const handleDelete = () => {
		navigation.goBack();
		formulaDispatch({ type: "DELETE_VARIABLE", payload: variable });
	};

	const handleSave = () => {
		if (!variable.result) return;

		const saveAction = "vid" in variable ? "UPDATE_VARIABLE" : "CREATE_VARIABLE";
		formulaDispatch({
			type: saveAction,
			payload: variable,
		});
		navigation.goBack();
	};

	const handleNameChange = (n: string) => {
		if (nameIsInvalid) return;
		dispatch({ type: "CHANGE_NAME", payload: n.replaceAll("|", "") });
	};

	const handleColorChange = (c: string) => {
		dispatch({ type: "CHANGE_COLOR", payload: c });
	};

	React.useEffect(() => {
		dispatch?.({
			type: "INIT",
			payload: route.params?.variable,
		});
	}, []);

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("blur", () => {
			dispatch?.({
				type: "RESET",
				payload: route.params?.variable,
			});
		});
		return unsubscribe;
	}, [navigation]);

	React.useEffect(() => {
		const existingIndex: number = formula.variables.findIndex((v: Variable) => v.name === variable.name);
		const nameAlreadyExists = existingIndex !== -1;

		if (!nameIsInvalid && nameAlreadyExists) setNameIsInvalid(true);
		if (nameIsInvalid && !nameAlreadyExists) setNameIsInvalid(false);
	}, [variable.name]);

	React.useEffect(() => {
		dispatch({ type: "CALCULATE_RESULT" });
	}, [variable.equation]);

	return (
		<>
			{variable && dispatch && (
				<ScreenView noPadding>
					<View
						style={[
							{ backgroundColor: theme.colors[variable.color] },
							tw`w-12 h-1 mx-auto rounded-full mt-4`,
						]}></View>
					{/* {nameIsInvalid && <Text style={tw`px-2 pb-2`}>Name already exists</Text>} */}
					<Header>
						{route.params?.variable ? (
							<IconButton onPress={handleDelete} icon={["fal", "trash-alt"]} />
						) : (
							<IconButton onPress={() => navigation.goBack()} icon={["fal", "chevron-down"]} />
						)}

						<TextInput
							selectTextOnFocus
							value={variable.name}
							placeholder={variable.name}
							style={[
								{
									color: theme.text.primary,
									borderColor: theme.border,
									fontFamily: "Poppins_400Regular",
									backgroundColor: theme.background.secondary,
								},
								tw`flex-1 p-1 mx-3 text-center text-base rounded-md border`,
							]}
							onChangeText={handleNameChange}
						/>
						<View style={tw``}>
							<ButtonPrimary
								small
								text="Save"
								onPress={handleSave}
								color={theme.background.primary}
								backgroundColor={theme.colors[variable.color]}
							/>
						</View>
					</Header>
					<Equation data={variable.equation} color={variable.color} dispatch={dispatch} />
					<Result data={variable.result} color={variable.color} />
					<Calculator dispatch={dispatch} color={theme.colors[variable.color]} />
					<View
						style={[
							{ borderColor: theme.border, backgroundColor: theme.background.secondary },
							tw`h-20 px-5 pt-4 w-full border-t`,
						]}>
						<ColorPicker selected={variable.color} handleColorChange={handleColorChange} />
					</View>
				</ScreenView>
			)}
		</>
	);
}
