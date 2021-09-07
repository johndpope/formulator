import React from "react";
import tw from "../../styles/tailwind";
import { Animated, View, Text } from "react-native";
import { VariableChipList } from "../../components/variable/VariableChipList";
import { Button } from "../../components/theme/buttons/Button";
import { useThemeContext } from "../../providers/ThemeProvider";
import { Formula, FormulaAction } from "../../types/FormulatorTypes";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../../types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { SheetAnimationsMap } from "../theme/views/BottomSheet";
import { IconButton } from "../theme/buttons/IconButton";

interface VariableListCollapsedProps {
	formula: Formula;
	sheetAnimations: SheetAnimationsMap;
	dispatch: React.Dispatch<FormulaAction>;
}

export const VariableListCollapsed = ({
	formula,
	dispatch,
	sheetAnimations,
}: VariableListCollapsedProps) => {
	const { theme } = useThemeContext();
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	return (
		<View
			style={[
				{
					borderColor: theme.border,
					backgroundColor: theme.background.primary,
				},
				tw`flex flex-col items-center justify-start border-t overflow-hidden px-5`,
			]}>
			<View
				style={tw.style(`h-1 w-10 mt-3 rounded-full`, {
					backgroundColor: theme.button.secondary,
				})}></View>
			<View style={tw.style(`flex flex-row mt-6 mb-8`)}>
				<View style={tw.style(`flex-1 flex flex-col justify-center`)}>
					<Animated.View
						style={[
							tw.style(`absolute top-0 flex-1 overflow-hidden mr-4`, theme.shape),
							{
								opacity: sheetAnimations.fadeOut,
								transform: [{ translateY: sheetAnimations.translateOut }],
							},
						]}>
						<VariableChipList formula={formula} dispatch={dispatch} />
					</Animated.View>
					<Animated.View style={{ transform: [{ translateY: sheetAnimations.translateIn }] }}>
						<Text
							style={tw.style(`text-lg`, {
								color: theme.text.primary,
								fontFamily: "Poppins_600SemiBold",
							})}>
							All Variables
						</Text>
					</Animated.View>
				</View>
				<Button size="sm" text="New" onPress={() => navigation.navigate("Variable")} />
			</View>
		</View>
	);
};
