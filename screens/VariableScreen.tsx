import React from "react";
import tw from "../styles/tailwind";
import { View, Text, TextInput } from "react-native";
import { VariableScreenProps } from "../types/NavigatorTypes";
import { Variable } from "../types/VariableTypes";
import { useFormulatorContext } from "../providers/FormulatorProvider";

import EquationResult from "../components/equation/EquationResult";
import Equation from "../components/equation/Equation";
import Calculator from "../components/calculator/Calculator";
import ColorPicker from "../components/variable/ColorPicker";
import { defaultVariableState, variableReducer } from "../logic/VariableLogic";
import { useThemeContext } from "../providers/ThemeProvider";

import { Button } from "../components/theme/buttons/Button";
import { IconButton } from "../components/theme/buttons/IconButton";
import { ScreenView } from "../components/theme/views/ScreenView";
import { Header } from "../components/theme/headers/Header";

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
				<ScreenView padded={false}>
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
						<IconButton
							icon={["fal", colorPickerShown ? "times" : "fill"]}
							color={colorPickerShown ? theme.text.primary : theme.background.primary}
							backgroundColor={colorPickerShown ? theme.button.secondary : theme.colors[variable.color]}
							onPress={() => setColorPickerShown((b) => !b)}
						/>

						{colorPickerShown && (
							<View style={tw`flex flex-row items-center flex-1 ml-4`}>
								<ColorPicker selected={variable.color} handleColorChange={handleColorChange} />
							</View>
						)}
						{!colorPickerShown && (
							<View
								style={tw.style(
									theme.shape,
									{ borderColor: theme.colors[variable.color] },
									`h-9 ml-11 mr-5 flex-1 flex flex-row items-center border px-2`
								)}>
								<View
									style={tw.style(
										theme.shape,
										{ backgroundColor: theme.colors[variable.color] },
										`absolute inset-x-0 inset-y-0 rounded-md opacity-25`
									)}></View>
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
										tw`flex-1 p-1 text-center text-base rounded-md`,
									]}
									onChangeText={handleNameChange}
								/>
								<Text style={{ color: theme.colors[variable.color], fontFamily: "Poppins_600SemiBold" }}>
									{"}"}
								</Text>
							</View>
						)}
						{!colorPickerShown && (
							<Button
								size="sm"
								text="save"
								onPress={handleSave}
								backgroundColor={theme.button.secondary}
							/>
						)}
					</Header>
					<View style={tw`mt-1`}></View>
					<Equation data={variable.equation} dispatch={dispatch} />
					<EquationResult data={variable.result} />
					<Calculator dispatch={dispatch} />
					<View
						style={[
							{ borderColor: theme.border, backgroundColor: theme.background.secondary },
							tw`border-t px-6 pb-8 pt-4 flex flex-row items-center justify-between`,
						]}>
						{route.params?.variable && (
							<>
								<Button
									size="sm"
									text="Delete"
									onPress={handleDelete}
									backgroundColor={theme.colors.error}
								/>
								<Text
									style={[
										{ color: theme.text.secondary, fontFamily: "Poppins_400Regular" },
										tw`text-sm mx-auto`,
									]}>
									Delete and replace all instances?
								</Text>
							</>
						)}
					</View>
				</ScreenView>
			)}
		</>
	);
}
