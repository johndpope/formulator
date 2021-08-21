import React from "react";
import tw from "../styles/tailwind";
import { View, Text } from "react-native";
import { useFormulatorContext } from "../providers/FormulatorProvider";

export default function FormulatorScreen() {
	const { formula, setFormula } = useFormulatorContext();

	return (
		<View style={tw`flex-1 items-center justify-center`}>
			{formula && <Text>{formula.name}</Text>}
		</View>
	);
}
