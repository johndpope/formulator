import React from "react";
import tw from "../../styles/tailwind";
import { Pressable, Text, View, Animated } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";
import { Formula, FormulaAction } from "../../types/FormulatorTypes";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../../types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { SheetAnimationsMap } from "../theme/views/BottomSheet";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Button } from "../../components/theme/buttons/Button";

interface VariableListExpandedProps {
	formula: Formula;
	dispatch: React.Dispatch<FormulaAction>;
	sheetAnimations: SheetAnimationsMap;
}

export const VariableListExpanded = ({
	formula,
	dispatch,
	sheetAnimations,
}: VariableListExpandedProps) => {
	const { theme } = useThemeContext();
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	return (
		<View
			style={tw.style(`flex-1 px-5`, {
				backgroundColor: theme.background.primary,
			})}>
			<Animated.View style={{ flex: 1, opacity: sheetAnimations.fadeIn }}>
				<FlatList
					data={formula.variables}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => `variable-chip-${item.name}`}
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
								`w-full flex flex-col items-start px-5 py-3 mb-4 overflow-hidden border`
							)}>
							<View
								style={tw.style(`absolute inset-y-0 inset-x-0 opacity-25`, {
									backgroundColor: theme.colors[item.color],
								})}></View>
							<Text
								style={tw.style(`text-lg`, {
									fontFamily: "Poppins_400Regular",
									color: theme.text.primary,
								})}>
								{item.name}
							</Text>
							<Text
								style={tw.style(`text-sm`, {
									fontFamily: "Poppins_400Regular",
									color: theme.colors[item.color],
								})}>
								{item.equation.trim().replaceAll("|", "")}
							</Text>
						</Pressable>
					)}
				/>
			</Animated.View>
		</View>
	);
};
