import React from "react";
import tw from "../../styles/tailwind";
import { Pressable, View, Text } from "react-native";
import { FormulaAction } from "../../types/FormulatorTypes";

interface CalculatorProps {
	dispatch: React.Dispatch<FormulaAction>;
}

export default function Calculator({ dispatch }: CalculatorProps) {
	return (
		<View style={tw`flex flex-row p-5`}>
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
		</View>
	);
}
