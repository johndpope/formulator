import React from "react";
import tw from "../styles/tailwind";
import { FormulaScreenProps } from "../types/NavigatorTypes";
import { View, Text, Pressable, TextInput } from "react-native";
import { useFormulatorContext } from "../providers/FormulatorProvider";
import Equation from "../components/shared/Equation";
import Calculator from "../components/shared/Calculator";

export default function FormulatorScreen({ route, navigation }: FormulaScreenProps) {
	const { formula, dispatch } = useFormulatorContext();

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("blur", () => {
			dispatch?.({
				type: "RESET",
				payload: route.params?.formula,
			});
		});
		return unsubscribe;
	}, [navigation]);

	return (
		<>
			{formula && dispatch && (
				<View style={tw`flex-1 flex-col items-center justify-center p-10`}>
					<TextInput
						selectTextOnFocus
						value={formula.name}
						placeholder={formula.name}
						style={tw`w-full border p-4`}
						onChangeText={(n) => dispatch({ type: "CHANGE_NAME", payload: n })}
					/>
					<Equation data={formula.equation} />
					<Text>{formula.result}</Text>
					<Calculator dispatch={dispatch} />
					<View style={tw`flex flex-row`}>
						<Pressable
							onPress={() =>
								dispatch({
									type: "CREATE_VARIABLE",
									payload: {
										name: "total",
										equation: "50",
										result: "50",
										openBrackets: 0,
										color: "red",
										lastConstantType: "EQ_NUMBER",
									},
								})
							}
							style={tw`p-5 bg-gray-300`}>
							<Text style={tw``}>New Variable</Text>
						</Pressable>
						<Pressable
							onPress={() =>
								dispatch({
									type: "UPDATE_VARIABLE",
									payload: {
										name: "total",
										equation: "100",
										result: "100",
										openBrackets: 0,
										color: "blue",
										lastConstantType: "EQ_NUMBER",
									},
								})
							}
							style={tw`p-5 bg-gray-200`}>
							<Text style={tw``}>Update Variable</Text>
						</Pressable>
						<Pressable
							onPress={() =>
								dispatch({
									type: "DELETE_VARIABLE",
									payload: {
										name: "total",
										equation: "100",
										result: "100",
										openBrackets: 0,
										color: "blue",
										lastConstantType: "EQ_NUMBER",
									},
								})
							}
							style={tw`p-5 bg-gray-200`}>
							<Text style={tw``}>Delete Variable</Text>
						</Pressable>
					</View>
					<View style={tw`flex flex-row`}>
						{formula.variables.map((variable, index) => (
							<Pressable
								key={`variable-chip-${index}`}
								onPress={() =>
									dispatch({
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
