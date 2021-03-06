import React from "react";
import tw from "../../styles/tailwind";
import { Pressable, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../../types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useThemeContext } from "../../providers/ThemeProvider";

import { Formula, FormulaAction } from "../../types/FormulatorTypes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface VariableChipListProps {
	formula: Formula;
	dispatch: React.Dispatch<FormulaAction>;
}

export function VariableChipList({ formula, dispatch }: VariableChipListProps) {
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
					showsHorizontalScrollIndicator={false}
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
							style={tw.style(
								theme.shape,
								{ borderColor: theme.colors[item.color] },
								`flex flex-row px-2 py-1.5 mr-2 overflow-hidden border`
							)}>
							<View
								style={[
									{ backgroundColor: theme.colors[item.color] },
									tw`absolute inset-y-0 inset-x-0 opacity-10`,
								]}></View>
							<Text
								style={[
									{ color: theme.colors[item.color] },
									variableTextStyle,
									tw`text-xs pr-1`,
								]}>{`{`}</Text>
							<Text style={[{ color: theme.text.primary }, variableTextStyle, tw`text-xs capitalize`]}>
								{item.name}
							</Text>
							<Text
								style={[
									{ color: theme.colors[item.color] },
									variableTextStyle,
									tw`text-xs pl-1`,
								]}>{`}`}</Text>
						</Pressable>
					)}
				/>
			) : (
				<View style={tw`flex-1 flex flex-row items-center justify-center`}>
					<Text
						style={[
							{ color: theme.text.secondary, fontFamily: "Poppins_400Regular" },
							tw`mr-2 text-xs`,
						]}>
						Click "New" to add a new variable
					</Text>
					<FontAwesomeIcon icon={["fal", "arrow-right"]} size={12} color={theme.text.secondary} />
				</View>
			)}
		</>
	);
}
