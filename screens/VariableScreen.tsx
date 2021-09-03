import React from "react";
import tw from "../styles/tailwind";
import { View, Text, TextInput } from "react-native";
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
import {
	ScreenView,
	IconButton,
	Header,
	ButtonPrimary,
	ButtonSecondary,
	TitleButton,
} from "../components/ThemeComponents";
import { useThemeContext } from "../providers/ThemeProvider";

const defaultVariableState: Variable = {
	name: "New Variable",
	color: "green",
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
	const [colorPickerShown, setColorPickerShown] = React.useState<boolean>(false);

	const handleDelete = () => {
		navigation.goBack();
		formulaDispatch({ type: "DELETE_VARIABLE", payload: variable });
	};

	const handleSave = () => {
		if (!variable.result) return;
		if (nameIsInvalid) return;

		const saveAction = "vid" in variable ? "UPDATE_VARIABLE" : "CREATE_VARIABLE";
		formulaDispatch({
			type: saveAction,
			payload: variable,
		});
		navigation.goBack();
	};

	const handleNameChange = (n: string) => {
		dispatch({ type: "CHANGE_NAME", payload: n.replaceAll("|", "") });
	};

	const handleColorChange = (c: string) => {
		setColorPickerShown(false);
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
		const nameAlreadyExists = route.params?.variable.name !== variable.name && existingIndex !== -1;

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
							{ backgroundColor: theme.border },
							tw`w-12 h-1 mx-auto rounded-full mt-3 mb-1`,
						]}></View>
					{nameIsInvalid && (
						<Text style={[{ color: theme.colors.error }, tw`px-2 pb-1 text-xs mx-auto`]}>
							! A variable with this name already exists
						</Text>
					)}
					<Header>
						<View
							style={[
								{
									backgroundColor: colorPickerShown
										? theme.background.secondary
										: theme.colors[variable.color],
								},
								tw`h-8 w-12 rounded-full flex flex-row items-center justify-center`,
							]}>
							<IconButton
								size={18}
								onPress={() => setColorPickerShown((b) => !b)}
								icon={["fal", colorPickerShown ? "times" : "fill"]}
								color={colorPickerShown ? theme.text.primary : theme.background.primary}
							/>
						</View>
						{colorPickerShown && (
							<View style={tw`flex flex-row items-center flex-1 ml-4`}>
								<ColorPicker selected={variable.color} handleColorChange={handleColorChange} />
							</View>
						)}
						{!colorPickerShown && (
							<View
								style={[
									{ borderColor: theme.colors[variable.color] },
									tw`h-9 mx-5 flex-1 flex flex-row items-center border rounded-md px-4`,
								]}>
								<View
									style={[
										{ backgroundColor: theme.colors[variable.color] },
										tw`absolute inset-x-0 inset-y-0 rounded-md opacity-25`,
									]}></View>
								<Text style={{ color: theme.colors[variable.color], fontFamily: "Poppins_600SemiBold" }}>
									{"{"}
								</Text>
								<TextInput
									selectTextOnFocus
									value={variable.name}
									placeholder={variable.name}
									style={[
										{
											color: theme.text.primary,
											fontFamily: "Poppins_400Regular",
										},
										tw`flex-1 p-1 px-3 text-center text-base rounded-md`,
									]}
									onChangeText={handleNameChange}
								/>
								<Text style={{ color: theme.colors[variable.color], fontFamily: "Poppins_600SemiBold" }}>
									{"}"}
								</Text>
							</View>
						)}
						{!colorPickerShown && (
							<TitleButton text="Save" onPress={handleSave} backgroundColor={theme.background.primary} />
						)}
					</Header>
					<View style={tw`mt-1`}></View>
					<Equation data={variable.equation} dispatch={dispatch} />
					<Result data={variable.result} />
					<Calculator dispatch={dispatch} />
					<View
						style={[
							{ borderColor: theme.border, backgroundColor: theme.background.secondary },
							tw`border-t px-6 pb-8 pt-4 flex flex-row items-center justify-between`,
						]}>
						<ButtonSecondary
							small
							text="Delete"
							onPress={handleDelete}
							backgroundColor={theme.colors.error}
						/>
						<Text
							style={[{ color: theme.text.secondary, fontFamily: "Poppins_400Regular" }, tw`text-sm`]}>
							Delete and replace all instances?
						</Text>
					</View>
				</ScreenView>
			)}
		</>
	);
}
