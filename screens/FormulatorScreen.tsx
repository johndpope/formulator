import _ from "lodash";
import React from "react";
import tw from "../styles/tailwind";
import Constants from "expo-constants";
import Result from "../components/shared/Result";
import Equation from "../components/shared/Equation";
import Calculator from "../components/shared/Calculator";
import { useAuthContext } from "../providers/AuthProvider";
import { FormulaScreenProps } from "../types/NavigatorTypes";
import { View, Text, Pressable, TextInput } from "react-native";
import { useFormulatorContext } from "../providers/FormulatorProvider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FlatList } from "react-native-gesture-handler";

const statusColors = ["red-500", "yellow-500", "green-500"];
const statusText = ["Unsaved", "Changed", "Saved"];

export default function FormulatorScreen({ route, navigation }: FormulaScreenProps) {
	const { user } = useAuthContext();
	const { formula, formulaDispatch } = useFormulatorContext();
	const [changeStatus, setChangeStatus] = React.useState<number>(2);

	React.useEffect(() => {
		formulaDispatch({ type: "INIT", payload: route.params?.formula });
	}, []);

	React.useEffect(() => {
		if (!formula?.fid) return;
		navigation.setParams({ formula });
	}, [formula?.fid]);

	React.useEffect(() => {
		if (!formula) return;

		const formulaHasFid = "fid" in formula;
		const formulaHasChanged = !_.isEqual(route.params?.formula, formula);

		// If changeStatus is not already set, check for FID and data changes, then set status
		if (changeStatus !== 0 && !formulaHasFid) setChangeStatus(0);
		if (changeStatus !== 1 && formulaHasFid && formulaHasChanged) setChangeStatus(1);
		if (changeStatus !== 2 && formulaHasFid && !formulaHasChanged) setChangeStatus(2);
	}, [formula, route.params]);

	return (
		<>
			{formula && (
				<View style={[tw`flex-1 flex-col items-center`, { paddingTop: Constants.statusBarHeight }]}>
					<View style={tw`h-14 w-full flex flex-row items-center justify-between px-5`}>
						<Pressable onPress={() => navigation.goBack()} style={tw`w-12 h-10 bg-gray-200`}>
							<FontAwesomeIcon icon={["fal", "chevron-left"]} size={24} style={tw`m-auto`} />
						</Pressable>

						<TextInput
							selectTextOnFocus
							value={formula.name}
							placeholder={formula.name}
							style={tw`flex-1 mx-3 border p-3 text-center`}
							onChangeText={(n) => formulaDispatch({ type: "CHANGE_NAME", payload: n })}
						/>
						<Pressable
							onPress={() => formulaDispatch({ type: "SAVE_FORMULA" })}
							style={tw`flex flex-row w-12 h-10 bg-gray-200`}>
							<Text style={tw`m-auto`}>Save</Text>
						</Pressable>
					</View>
					<Equation data={formula.equation} variables={formula.variables} />
					<Result data={formula.result} />
					<Calculator dispatch={formulaDispatch} />
					<View style={tw`flex flex-row px-5 items-center mt-auto mb-10`}>
						<FlatList
							horizontal
							data={formula.variables}
							keyExtractor={(item) => `variable-chip-${item.name}`}
							contentContainerStyle={tw`flex flex-row items-center`}
							renderItem={({ item }) => (
								<Pressable
									onPress={() =>
										formulaDispatch({
											type: "INSERT_CONSTANT",
											payload: { constantType: "EQ_VARIABLE", constantValue: `${item.name}` },
										})
									}
									style={tw`px-4 py-2 bg-${item.color}-500 mr-2`}>
									<Text style={tw`text-white`}>{item.name}</Text>
								</Pressable>
							)}
						/>
						<Pressable onPress={() => navigation.navigate("Variable")} style={tw`w-10 h-10 bg-gray-200`}>
							<FontAwesomeIcon icon={["fal", "plus-circle"]} size={24} style={tw`m-auto`} />
						</Pressable>
					</View>
				</View>
			)}
		</>
	);
}
