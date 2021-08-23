import React from "react";
import tw from "../styles/tailwind";
import { FormulaScreenProps } from "../types/NavigatorTypes";
import { View, Text, Pressable, TextInput } from "react-native";
import { useFormulatorContext } from "../providers/FormulatorProvider";

export default function FormulatorScreen({ route, navigation }: FormulaScreenProps) {
	const { formula, dispatch } = useFormulatorContext();

	React.useEffect(() => {
		if (!route.params) return;
		const unsubscribe = navigation.addListener("focus", () => {
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
					<Text style={tw`py-2 mt-5`}>{formula.equation}</Text>
				</View>
			)}
		</>
	);
}
