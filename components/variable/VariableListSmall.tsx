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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface VariableListSmallProps {
	formula: Formula;
	dispatch: React.Dispatch<FormulaAction>;
}

export function VariableListSmall({ formula, dispatch }: VariableListSmallProps) {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	const { theme } = useThemeContext();

	const variableTextStyle = {
		fontFamily: "Poppins_400Regular",
	};

	return (
		<>
			{formula.variables.length ? (
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
								{ borderColor: theme.colors[item.color] },
								tw`flex flex-row px-2 py-1.5 mr-3 rounded-md overflow-hidden border`,
							]}>
							<View
								style={[
									{ backgroundColor: theme.colors[item.color] },
									tw`absolute inset-y-0 inset-x-0 opacity-10`,
								]}></View>
							<Text
								style={[
									{ color: theme.colors[item.color] },
									variableTextStyle,
									tw`text-sm pr-1`,
								]}>{`{`}</Text>
							<Text style={[{ color: theme.text.primary }, variableTextStyle, tw`text-sm capitalize`]}>
								{item.name}
							</Text>
							<Text
								style={[
									{ color: theme.colors[item.color] },
									variableTextStyle,
									tw`text-sm pl-1`,
								]}>{`}`}</Text>
						</Pressable>
					)}
				/>
			) : (
				<View style={tw`flex-1 flex flex-row items-center justify-center`}>
					<Text style={[{ color: theme.text.secondary, fontFamily: "Poppins_400Regular" }, tw`mr-2`]}>
						Click "New" to add a new variable
					</Text>
					<FontAwesomeIcon icon={["fal", "arrow-right"]} size={12} color={theme.text.secondary} />
				</View>
			)}
		</>
	);
}
