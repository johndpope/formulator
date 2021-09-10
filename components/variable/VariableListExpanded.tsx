import React from "react";
import tw from "../../styles/tailwind";
import { Pressable, Text, View, Animated, TouchableWithoutFeedback } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";
import { Formula, FormulaAction } from "../../types/FormulatorTypes";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../../types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { SheetAnimationsMap } from "../theme/views/BottomSheet";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Button } from "../../components/theme/buttons/Button";
import { IconButton } from "../theme/buttons/IconButton";

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
		<Pressable
			onPress={(e) => e.preventDefault()}
			style={tw.style(`flex-1`, {
				zIndex: 500,
				backgroundColor: theme.background.primary,
			})}>
			<Animated.View style={{ flex: 1, opacity: sheetAnimations.fadeIn }}>
				<FlatList
					data={formula.variables}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => `variable-chip-${item.name}`}
					renderItem={({ item }) => (
						<View style={tw.style(`px-5 py-2`)}>
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
									`w-full flex flex-row items-center px-4 py-2 overflow-hidden border`
								)}>
								<View
									style={tw.style(`absolute inset-y-0 inset-x-0 opacity-25`, {
										backgroundColor: theme.colors[item.color],
									})}></View>
								<View style={tw.style(`flex-1 flex flex-col`)}>
									<Text
										style={tw.style(`text-base`, {
											fontFamily: "Poppins_400Regular",
											color: theme.text.primary,
										})}>
										{item.name}
									</Text>
									<Text
										numberOfLines={1}
										style={tw.style(`text-sm`, {
											fontFamily: "Poppins_400Regular",
											color: theme.colors[item.color],
										})}>
										{item.equation.trim().replace(/\|/g, "")}
									</Text>
								</View>
								<IconButton
									size={"md"}
									icon={["fal", "cog"]}
									color={theme.colors[item.color]}
									onPress={() => navigation.navigate("Variable", { variable: item })}
								/>
							</Pressable>
						</View>
					)}
				/>
			</Animated.View>
		</Pressable>
	);
};
