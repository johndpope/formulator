import _ from "lodash";
import React from "react";
import tw from "../styles/tailwind";
import EquationResult from "../components/equation/EquationResult";
import Equation from "../components/equation/Equation";
import Calculator from "../components/calculator/Calculator";
import { FormulaScreenProps } from "../types/NavigatorTypes";
import { View, TextInput, Animated, Pressable, Alert } from "react-native";
import { useFormulatorContext } from "../providers/FormulatorProvider";

import { useAlert } from "../hooks/useAlert";
import { useThemeContext } from "../providers/ThemeProvider";
import { Header } from "../components/theme/headers/Header";
import { ScreenView } from "../components/theme/views/ScreenView";
import { IconButton } from "../components/theme/buttons/IconButton";
import { DropDownMenu, DropDownItem } from "../components/theme/menus/DropDownMenu";
import { ViewWithBottomSheet } from "../components/theme/views/ViewWithBottomSheet";
import { VariableListCollapsed } from "../components/variable/VariableListCollapsed";
import { VariableListExpanded } from "../components/variable/VariableListExpanded";
import useKeyboardAnimations from "../hooks/useKeyboardAnimations";

export default function FormulatorScreen({ route, navigation }: FormulaScreenProps) {
	const { theme } = useThemeContext();
	const { formula, formulaDispatch } = useFormulatorContext();
	const { Alert, showAlert, dismissAlert } = useAlert();
	const { dismissKeyboard, isKeyboardVisible, fadeOutOnKeyboard } = useKeyboardAnimations();

	const [changeStatus, setChangeStatus] = React.useState<number>(2);

	const statusColors = ["red", "yellow", "green"];
	const statusText = ["Unsaved", "Changed", "Saved"];

	function handleSave() {
		if (!formula.result) return;
		formulaDispatch({ type: "SAVE_FORMULA" });
	}

	function handleDelete() {
		showAlert({
			title: "Hold up!",
			description:
				"Are you sure you want to delete this formula and all variables? \n This cannot be undone.",
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
						formulaDispatch({ type: "DELETE_FORMULA", payload: formula.fid });
					},
				},
			],
		});
	}

	function handleStatusChange() {
		let formulaHasFid = "fid" in formula;
		let formulaHasChanged = !_.isEqual(route.params?.formula, formula);

		// If changeStatus is not already set, check for FID and data changes, then set status
		if (changeStatus !== 0 && !formulaHasFid) setChangeStatus(0);
		if (changeStatus !== 1 && formulaHasFid && formulaHasChanged) setChangeStatus(1);
		if (changeStatus !== 2 && formulaHasFid && !formulaHasChanged) setChangeStatus(2);
	}

	React.useEffect(() => {
		formulaDispatch({ type: "INIT", payload: route.params?.formula });
	}, []);

	React.useEffect(() => {
		if (!formula.fid) return;
		navigation.setParams({ formula });
	}, [formula.fid, formula.timestamp]);

	React.useEffect(() => {
		if (!formula) return;
		handleStatusChange();
	}, [formula, route.params]);

	return (
		<ScreenView>
			<Alert />
			{isKeyboardVisible && (
				<Pressable onPress={() => dismissKeyboard()} style={tw.style(`absolute w-full h-full z-50`)} />
			)}
			<View style={tw`z-50`}>
				<Header>
					<View style={tw`absolute inset-x-0 top-0 flex flex-row justify-center`}>
						<Animated.View
							style={[
								tw`w-1.5 h-1.5 rounded-full`,
								{
									opacity: fadeOutOnKeyboard,
									backgroundColor: theme.colors[statusColors[changeStatus]],
								},
							]}
						/>
					</View>
					<IconButton onPress={() => navigation.goBack()} icon={["fal", "chevron-left"]} />
					<View
						style={tw.style(
							theme.shape,
							{
								backgroundColor: isKeyboardVisible
									? theme.background.secondary
									: theme.background.primary,
							},
							`flex-1 flex flex-row items-center mx-5 h-10`
						)}>
						<TextInput
							selectTextOnFocus
							value={formula.name}
							placeholder={formula.name}
							keyboardAppearance="dark"
							style={[
								{
									color: theme.text.primary,
									fontFamily: "Poppins_400Regular",
								},
								tw`w-full p-1 text-center text-base rounded-md`,
							]}
							onChangeText={(n) => formulaDispatch({ type: "CHANGE_NAME", payload: n })}
						/>
					</View>

					<DropDownMenu
						toggle={({ opened, setOpened }) => (
							<IconButton
								icon={["fal", opened ? "times" : "ellipsis-v"]}
								onPress={() => setOpened((o) => !o)}
							/>
						)}>
						<DropDownItem text="Save" icon={["fal", "upload"]} onPress={handleSave} />
						{"fid" in formula && (
							<DropDownItem text="Delete" icon={["fal", "trash-alt"]} onPress={handleDelete} />
						)}
					</DropDownMenu>
				</Header>
			</View>

			<Animated.View style={[tw`flex-1 z-10`, { opacity: fadeOutOnKeyboard }]}>
				<Equation data={formula.equation} variables={formula.variables} dispatch={formulaDispatch} />
				<EquationResult data={formula.result} />
				<ViewWithBottomSheet
					bottomSheetCollapsedHeight={110}
					bottomSheetHeader={({ sheetAnimations }) => (
						<VariableListCollapsed
							formula={formula}
							dispatch={formulaDispatch}
							sheetAnimations={sheetAnimations}
						/>
					)}
					bottomSheetContent={({ sheetAnimations }) => (
						<VariableListExpanded
							formula={formula}
							dispatch={formulaDispatch}
							sheetAnimations={sheetAnimations}
						/>
					)}>
					<Calculator isFormula dispatch={formulaDispatch} />
				</ViewWithBottomSheet>
			</Animated.View>
		</ScreenView>
	);
}
