import React from "react";
import tw from "../styles/tailwind";
import { FormulaScreenProps } from "../types/NavigatorTypes";
import { View, Text, Pressable, TextInput } from "react-native";
import { useFormulatorContext } from "../providers/FormulatorProvider";
import Equation from "../components/shared/Equation";
import Calculator from "../components/shared/Calculator";

export default function FormulatorScreen({ route, navigation }: FormulaScreenProps) {
	const { formula, formulaDispatch } = useFormulatorContext();

	React.useEffect(() => {
		formulaDispatch?.({
			type: "INIT",
			payload: route.params?.formula,
		});
	}, []);

	return (
		<>
			{formula && formulaDispatch && (
				<View style={tw`flex-1 flex-col items-center justify-center p-10`}>
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
				</View>
			)}
		</>
	);
}
