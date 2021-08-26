import React from "react";
import tw from "../styles/tailwind";
import { View, Text, TextInput, Pressable } from "react-native";
import { VariableScreenProps } from "../types/NavigatorTypes";
import { Variable, VariableAction } from "../types/VariableTypes";
import { useFormulatorContext } from "../providers/FormulatorProvider";

import Equation from "../components/shared/Equation";
import Calculator from "../components/shared/Calculator";
import {
	clearVariableAll,
	clearVariableLast,
	insertVariableBracket,
	insertVariableDecimal,
	insertVariableNegative,
	insertVariableNumber,
	insertVariableOperation,
	insertVariablePercent,
	calculateResult,
} from "../logic/VariableLogic";

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

		case "CLEAR_LAST_CONSTANT":
			return clearVariableLast(state);

		case "CLEAR_ALL_CONSTANTS":
			return clearVariableAll(state);

		case "CALCULATE_RESULT":
			return calculateResult(state);

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
	const { formula, formulaDispatch } = useFormulatorContext();
	const [variable, dispatch] = React.useReducer(variableReducer, defaultVariableState);
	const [nameIsInvalid, setNameIsInvalid] = React.useState<boolean>(false);

	const handleSave = () => {};

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
				<View style={tw`flex-1 flex-col items-center justify-center p-10`}>
					<Text>{nameIsInvalid && "Name already exists"}</Text>
					<TextInput
						selectTextOnFocus
						value={variable.name}
						placeholder={variable.name}
						style={tw`w-full border p-4`}
						onChangeText={(n) => dispatch({ type: "CHANGE_NAME", payload: n })}
					/>
					<Equation data={variable.equation} />
					<Text>{variable.result}</Text>
					<Calculator dispatch={dispatch} />
					<Pressable
						onPress={() => {
							formulaDispatch?.({
								type: "CREATE_VARIABLE",
								payload: variable,
							});
							navigation.goBack();
						}}>
						<Text>Create Variable</Text>
					</Pressable>
				</View>
			)}
		</>
	);
}
