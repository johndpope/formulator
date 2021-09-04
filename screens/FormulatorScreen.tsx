import _ from "lodash";
import React from "react";
import tw from "../styles/tailwind";
import EquationResult from "../components/equation/EquationResult";
import Equation from "../components/equation/Equation";
import Calculator from "../components/calculator/Calculator";
import { FormulaScreenProps } from "../types/NavigatorTypes";
import { View, TextInput } from "react-native";
import { useFormulatorContext } from "../providers/FormulatorProvider";

import { useThemeContext } from "../providers/ThemeProvider";
import { VariableListSmall } from "../components/variable/VariableChipList";

import { Button } from "../components/theme/buttons/Button";
import { IconButton } from "../components/theme/buttons/IconButton";
import { ScreenView } from "../components/theme/views/ScreenView";
import { Header } from "../components/theme/headers/Header";
import { DropDownMenu, DropDownItem } from "../components/theme/menus/DropDownMenu";

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
								// backgroundColor: theme.background.secondary,
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
				<Calculator dispatch={formulaDispatch} />
				<View
					style={[
						{ borderColor: theme.border },
						tw`flex flex-row px-6 pt-5 pb-10 items-center justify-end border-t`,
					]}>
					<VariableListSmall formula={formula} dispatch={formulaDispatch} />
					<Button size="sm" text="New" onPress={() => navigation.navigate("Variable")} />
				</View>
			</View>
		</ScreenView>
	);
}
