import _ from "lodash";
import React from "react";
import tw from "../styles/tailwind";
import Equation from "../components/shared/Equation";
import Calculator from "../components/shared/Calculator";
import { useAuthContext } from "../providers/AuthProvider";
import { FormulaScreenProps } from "../types/NavigatorTypes";
import { View, Text, Pressable, TextInput } from "react-native";
import { useFormulatorContext } from "../providers/FormulatorProvider";

const statusColors = ["red-500", "yellow-500", "green-500"];
const statusText = ["Unsaved", "Changed", "Saved"];

export default function FormulatorScreen({ route, navigation }: FormulaScreenProps) {
	const { user } = useAuthContext();
	const { formula, formulaDispatch } = useFormulatorContext();
	const [changeStatus, setChangeStatus] = React.useState<number>(2);

	React.useEffect(() => {
		formulaDispatch({
			type: "INIT",
			payload: route.params?.formula,
		});
	}, []);

	React.useEffect(() => {
		if (!formula?.fid) return;
		navigation.setParams({ formula });
	}, [formula?.fid]);

	React.useEffect(() => {
		if (!formula) return;

		const formulaHasFid = "fid" in formula;
		const formulaHasChanged = !_.isEqual(route.params?.formula, formula);

		// console.log(route.params?.formula, formula);

		if (!formulaHasFid && changeStatus !== 0) setChangeStatus(0);
		if (formulaHasFid && formulaHasChanged && changeStatus !== 1) setChangeStatus(1);
		if (formulaHasFid && !formulaHasChanged && changeStatus !== 2) setChangeStatus(2);
	}, [formula, route.params]);

	return (
		<>
			{formula && (
				<View style={tw`flex-1 flex-col items-center justify-center p-10`}>
					<Text style={tw`text-${statusColors[changeStatus]}`}>{statusText[changeStatus]}</Text>
					<TextInput
						selectTextOnFocus
						value={formula.name}
						placeholder={formula.name}
						style={tw`w-full border p-4`}
						onChangeText={(n) => formulaDispatch({ type: "CHANGE_NAME", payload: n })}
					/>
					<Equation data={formula.equation} />
					<Text>{formula.result}</Text>
					<Calculator dispatch={formulaDispatch} />
					<View style={tw`flex flex-row`}>
						<Pressable onPress={() => navigation.navigate("Variable")}>
							<Text>New Variable</Text>
						</Pressable>
					</View>
					<View style={tw`flex flex-row`}>
						{formula.variables.map((variable, index) => (
							<Pressable
								key={`variable-chip-${index}`}
								onPress={() =>
									formulaDispatch({
										type: "INSERT_CONSTANT",
										payload: { constantType: "EQ_VARIABLE", constantValue: `${variable.name}` },
									})
								}
								style={tw`p-5`}>
								<Text style={tw`text-${variable.color}-500`}>{variable.name}</Text>
							</Pressable>
						))}
					</View>
					<Pressable
						onPress={() => formulaDispatch({ type: "SAVE_FORMULA" })}
						style={tw`p-5 bg-purple-200`}>
						<Text>Save Formula</Text>
					</Pressable>
				</View>
			)}
		</>
	);
}
