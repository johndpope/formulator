import React from "react";
import tw from "../styles/tailwind";
import { View, Text, TextInput, Pressable, Animated } from "react-native";
import { VariableScreenProps } from "../types/NavigatorTypes";
import { Variable } from "../types/VariableTypes";
import { useFormulatorContext } from "../providers/FormulatorProvider";

import EquationResult from "../components/equation/EquationResult";
import Equation from "../components/equation/Equation";
import Calculator from "../components/calculator/Calculator";
import ColorPicker from "../components/variable/ColorPicker";
import { defaultVariableState, variableReducer } from "../logic/VariableLogic";
import { useThemeContext } from "../providers/ThemeProvider";

import { useAlert } from "../hooks/useAlert";
import { Button } from "../components/theme/buttons/Button";
import { IconButton } from "../components/theme/buttons/IconButton";
import { ScreenView } from "../components/theme/views/ScreenView";
import { Header } from "../components/theme/headers/Header";
import useKeyboardAnimations from "../hooks/useKeyboardAnimations";

export default function VariableScreen({ route, navigation }: VariableScreenProps) {
	const { theme } = useThemeContext();
	const { formula, formulaDispatch } = useFormulatorContext();
	const { Alert, showAlert, dismissAlert } = useAlert();
	const { dismissKeyboard, isKeyboardVisible, fadeOutOnKeyboard } = useKeyboardAnimations();

	const [variable, dispatch] = React.useReducer(variableReducer, defaultVariableState);
	const [nameIsInvalid, setNameIsInvalid] = React.useState<boolean>(false);
	const [colorPickerShown, setColorPickerShown] = React.useState<boolean>(false);

	const handleDelete = () => {
		showAlert({
			title: "NOTICE!",
			description: `All instances of this variable will be replaced with the result value ( ${variable.result} ).\nAre you sure you wish to proceed?`,
			buttons: [
				{
					text: "Cancel",
					onPress: dismissAlert,
				},
				{
					text: "Delete",
					color: theme.colors.error,
					onPress: () => {
						navigation.goBack();
						formulaDispatch({ type: "DELETE_VARIABLE", payload: variable });
					},
				},
			],
		});
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

	const handleSaveAndReplace = () => {
		if (!variable.result) return;
		if (nameIsInvalid) return;

		showAlert({
			title: "Replace All ?",
			description: "Would you like to replace all instances of this number, or just this one?",
			buttons: [
				{
					text: "Just this one",
					onPress: () => {
						formulaDispatch({
							type: "REPLACE_NUM_WITH_VARIABLE",
							payload: { variable, replacement: route.params?.replacements?.[0] || "" },
						});
						navigation.goBack();
					},
				},
				{
					text: "Replace All",
					color: theme.colors.green,
					onPress: () => {
						formulaDispatch({
							type: "REPLACE_NUM_WITH_VARIABLE",
							payload: { variable, replacement: route.params?.replacements?.[1] || "" },
						});
						navigation.goBack();
					},
				},
			],
		});
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
					<Alert />
					{isKeyboardVisible && (
						<Pressable
							onPress={() => dismissKeyboard()}
							style={tw.style(`absolute w-full h-full z-50`)}
						/>
					)}

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
					<Header style={tw`z-50 mb-1`}>
						{!colorPickerShown && (
							<IconButton icon={["fal", "chevron-down"]} onPress={() => navigation.goBack()} />
						)}

						{!colorPickerShown && (
							<View
								style={tw.style(
									theme.shape,
									{ borderColor: theme.colors[variable.color] },
									`h-9 mx-5 flex-1 flex flex-row items-center border px-2`
								)}>
								<View
									style={tw.style(
										theme.shape,
										{ backgroundColor: theme.colors[variable.color] },
										`absolute inset-x-0 inset-y-0 opacity-25`
									)}></View>
								<Text style={{ color: theme.colors[variable.color], fontFamily: "Poppins_600SemiBold" }}>
									{"{"}
								</Text>
								<TextInput
									selectTextOnFocus
									value={variable.name}
									placeholder={variable.name}
									keyboardAppearance="dark"
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
						{colorPickerShown && (
							<View style={tw`flex flex-row items-center flex-1 mr-4`}>
								<ColorPicker selected={variable.color} handleColorChange={handleColorChange} />
							</View>
						)}

						<IconButton
							icon={["fal", colorPickerShown ? "times" : "fill"]}
							color={colorPickerShown ? theme.text.primary : theme.background.primary}
							backgroundColor={colorPickerShown ? theme.button.secondary : theme.colors[variable.color]}
							onPress={() => setColorPickerShown((b) => !b)}
						/>
					</Header>
					<Animated.View style={[tw`flex-1`, { opacity: fadeOutOnKeyboard }]}>
						<Equation data={variable.equation} dispatch={dispatch} />
						<EquationResult data={variable.result} />
						<Calculator dispatch={dispatch} />
						<View
							style={[
								{ borderColor: theme.border, backgroundColor: theme.background.secondary },
								tw`border-t px-6 pb-8 pt-4 flex flex-row items-center justify-between`,
							]}>
							{"vid" in variable && (
								<View style={tw.style(`mr-4`)}>
									<Button
										size="md"
										text="Delete"
										onPress={handleDelete}
										backgroundColor={theme.colors.error}
									/>
								</View>
							)}
							<View style={tw.style(`flex-1`)}>
								<Button
									size="md"
									text="save"
									onPress={route.params?.replacements ? handleSaveAndReplace : handleSave}
									backgroundColor={theme.colors[variable.color]}
								/>
							</View>
						</View>
					</Animated.View>
				</ScreenView>
			)}
		</>
	);
}
