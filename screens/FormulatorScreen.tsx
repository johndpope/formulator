import _ from "lodash";
import React from "react";
import tw from "../styles/tailwind";
import EquationResult from "../components/equation/EquationResult";
import Equation from "../components/equation/Equation";
import Calculator from "../components/calculator/Calculator";
import { FormulaScreenProps } from "../types/NavigatorTypes";
import { View, TextInput, Animated } from "react-native";
import { useFormulatorContext } from "../providers/FormulatorProvider";

import { useThemeContext } from "../providers/ThemeProvider";
import { Header } from "../components/theme/headers/Header";
import { ScreenView } from "../components/theme/views/ScreenView";
import { IconButton } from "../components/theme/buttons/IconButton";
import { DropDownMenu, DropDownItem } from "../components/theme/menus/DropDownMenu";
import { ViewWithBottomSheet } from "../components/theme/views/ViewWithBottomSheet";
import { VariableListCollapsed } from "../components/variable/VariableListCollapsed";
import { VariableListExpanded } from "../components/variable/VariableListExpanded";

export default function FormulatorScreen({ route, navigation }: FormulaScreenProps) {
	const { theme } = useThemeContext();
	const { formula, formulaDispatch } = useFormulatorContext();
	const [changeStatus, setChangeStatus] = React.useState<number>(2);

	const statusColors = ["red", "yellow", "green"];
	const statusText = ["Unsaved", "Changed", "Saved"];

	function handleSave() {
		if (!formula.result) return;
		formulaDispatch({ type: "SAVE_FORMULA" });
	}

	function handleDelete() {
		navigation.goBack();
		formulaDispatch({ type: "DELETE_FORMULA", payload: formula.fid });
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
		if (!formula?.fid) return;
		navigation.setParams({ formula });
	}, [formula?.fid, formula?.timestamp]);

	React.useEffect(() => {
		if (!formula) return;

		handleStatusChange();
	}, [formula, route.params]);

	return (
		<ScreenView>
			<View style={tw`z-50`}>
				<Header>
					<View style={tw`absolute inset-x-0 top-0 flex flex-row justify-center`}>
						<View
							style={[
								tw`w-2 h-2 rounded-full`,
								{ backgroundColor: theme.colors[statusColors[changeStatus]] },
							]}
						/>
					</View>
					<IconButton onPress={() => navigation.goBack()} icon={["fal", "chevron-left"]} />
					<TextInput
						selectTextOnFocus
						value={formula.name}
						placeholder={formula.name}
						style={[
							{
								color: theme.text.primary,
								fontFamily: "Poppins_400Regular",
							},
							tw`flex-1 p-1 mx-3 text-center text-base rounded-md`,
						]}
						onChangeText={(n) => formulaDispatch({ type: "CHANGE_NAME", payload: n })}
					/>

					<DropDownMenu
						toggle={({ opened, setOpened }) => (
							<IconButton
								icon={["fal", opened ? "times" : "ellipsis-v"]}
								onPress={() => setOpened((o) => !o)}
							/>
						)}>
						<DropDownItem text="Save" icon={["fal", "upload"]} onPress={handleSave} />
						<DropDownItem text="Delete" icon={["fal", "trash-alt"]} onPress={handleDelete} />
					</DropDownMenu>
				</Header>
			</View>

			<View style={tw`flex-1 z-10`}>
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
					<Calculator dispatch={formulaDispatch} />
				</ViewWithBottomSheet>
			</View>
		</ScreenView>
	);
}
