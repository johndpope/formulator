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
				</View>
			)}
		</>
	);
}
