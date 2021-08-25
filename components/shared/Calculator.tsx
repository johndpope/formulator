import React from "react";
import tw from "../../styles/tailwind";
import { Pressable, View, Text } from "react-native";
import { FormulaAction } from "../../types/FormulatorTypes";
import { VariableAction } from "../../types/VariableTypes";

interface CalculatorProps {
	dispatch: React.Dispatch<FormulaAction> | React.Dispatch<VariableAction>;
}

export default function Calculator({ dispatch }: CalculatorProps) {
	return (
		<View style={tw`flex flex-row justify-center flex-wrap p-5`}>
			<Pressable
				onPress={() =>
					dispatch?.({
						type: "INSERT_CONSTANT",
						payload: { constantType: "EQ_NUMBER", constantValue: "1" },
					})
				}
				style={tw`w-10 h-10 bg-gray-200 flex items-center justify-center`}>
				<Text>1</Text>
			</Pressable>
			<Pressable
				onPress={() =>
					dispatch?.({
						type: "INSERT_CONSTANT",
						payload: { constantType: "EQ_OPERATION", constantValue: "*" },
					})
				}
				style={tw`w-10 h-10 bg-gray-200 flex items-center justify-center`}>
				<Text>*</Text>
			</Pressable>
			<Pressable
				onPress={() =>
					dispatch?.({
						type: "INSERT_CONSTANT",
						payload: { constantType: "EQ_NUMBER", constantValue: "2" },
					})
				}
				style={tw`w-10 h-10 bg-gray-200 flex items-center justify-center`}>
				<Text>2</Text>
			</Pressable>
		</View>
	);
}
