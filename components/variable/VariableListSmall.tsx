import React from "react";
import tw from "../../styles/tailwind";
import { Pressable, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../../types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useThemeContext } from "../../providers/ThemeProvider";

import { Formula, FormulaAction } from "../../types/FormulatorTypes";
import { theme } from "../../tailwind.config";

interface VariableListSmallProps {
	formula: Formula;
	dispatch: React.Dispatch<FormulaAction>;
}

export function VariableListSmall({ formula, dispatch }: VariableListSmallProps) {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	const { theme } = useThemeContext();

	const variableTextStyle = {
		color: theme.background.primary,
		fontFamily: "Poppins_700Bold",
	};

	return (
		<FlatList
			horizontal
			data={formula.variables}
			keyExtractor={(item) => `variable-chip-${item.name}`}
			contentContainerStyle={tw`flex flex-row items-center`}
			renderItem={({ item }) => (
				<Pressable
					onPress={() =>
						dispatch({
							type: "INSERT_CONSTANT",
							payload: { constantType: "EQ_VARIABLE", constantValue: `${item.name}` },
						})
					}
					onLongPress={() => navigation.navigate("Variable", { variable: item })}
					style={[
						{ backgroundColor: theme.colors[item.color] },
						tw`flex flex-row px-1 py-1 mr-3 rounded-md`,
					]}>
					<Text style={[variableTextStyle, tw`text-sm pr-1`]}>{`{`}</Text>
					<Text style={[variableTextStyle, tw`text-sm capitalize`]}>{item.name}</Text>
					<Text style={[variableTextStyle, tw`text-sm pl-1`]}>{`}`}</Text>
				</Pressable>
			)}
		/>
	);
}
