import React from "react";
import tw from "../styles/tailwind";
import { SafeAreaView, View, Text, TextInput, Pressable } from "react-native";
import { VariableScreenProps } from "../types/NavigatorTypes";
import { Variable, VariableAction } from "../types/VariableTypes";
import { useFormulatorContext } from "../providers/FormulatorProvider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Result from "../components/shared/Result";
import Equation from "../components/shared/Equation";
import Calculator from "../components/shared/Calculator";
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

const colors = ["yellow", "blue", "green", "purple", "pink", "red"];

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
	const { formula, formulaDispatch } = useFormulatorContext();

	const [variable, dispatch] = React.useReducer(variableReducer, defaultVariableState);
	const [nameIsInvalid, setNameIsInvalid] = React.useState<boolean>(false);

	const handleSave = () => {
		if (!variable.result) return;
		formulaDispatch?.({
			type: "CREATE_VARIABLE",
			payload: variable,
		});
		navigation.goBack();
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
				<View style={tw`flex-1 flex-col items-center bg-gray-800`}>
					<SafeAreaView style={tw`flex-1 flex-col items-center bg-${variable.color}-500 bg-opacity-20`}>
						<View style={tw`w-12 h-1 bg-${variable.color}-500 rounded-full mt-4 mb-3`}></View>
						{nameIsInvalid && <Text style={tw`px-2 pb-2`}>Name already exists</Text>}
						<View style={tw`h-14 w-full flex flex-row items-center justify-between px-5`}>
							<Pressable onPress={() => navigation.goBack()} style={tw`w-10 h-10`}>
								<FontAwesomeIcon
									icon={["fal", "chevron-left"]}
									size={20}
									style={tw`m-auto text-white`}
								/>
							</Pressable>

							<View style={tw`flex-1 mx-3 border border-${variable.color}-500`}>
								<TextInput
									selectTextOnFocus
									value={variable.name}
									placeholder={variable.name}
									style={tw`p-2 text-center text-white`}
									onChangeText={(n) => dispatch({ type: "CHANGE_NAME", payload: n })}
								/>
							</View>

							<Pressable onPress={handleSave} style={tw`flex flex-row w-10 h-10`}>
								<Text style={tw`text-sm m-auto text-white font-bold`}>Save</Text>
							</Pressable>
						</View>
						<Equation data={variable.equation} color={variable.color} dispatch={dispatch} />
						<Result data={variable.result} color={variable.color} />
						<Calculator dispatch={dispatch} />
						<View style={tw`flex flex-row justify-around px-5 pt-5 w-full`}>
							{colors.map((c) => (
								<Pressable
									key={`variable-color-${c}`}
									onPress={() => dispatch({ type: "CHANGE_COLOR", payload: c })}
									style={tw`w-8 h-8 p-1 bg-${c}-500 bg-opacity-25 rounded-full`}>
									<View style={tw`flex-1 bg-${c}-500 rounded-full`}>
										{c === variable.color && (
											<FontAwesomeIcon icon={["fal", "check"]} size={16} style={tw`text-white m-auto`} />
										)}
									</View>
								</Pressable>
							))}
						</View>
					</SafeAreaView>
				</View>
			)}
		</>
	);
}
