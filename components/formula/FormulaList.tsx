import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import tw from "../../styles/tailwind";
import { Formula } from "../../types/FormulatorTypes";
import { useThemeContext } from "../../providers/ThemeProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useFormulas } from "../../hooks/useFormulas";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";

import { ListTitle } from "../theme/titles/ListTitle";
import { ListSubtitle } from "../theme/titles/ListSubtitle";

interface FormulaListProps {}

interface FormulaListItemProps {
	formula: Formula;
	onPress?: () => void;
	onLongPress?: () => void;
}

export default function FormulaList(props: FormulaListProps) {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	const { user } = useAuthContext();
	const { formulas, error, loading } = useFormulas();

	return (
		<ScrollView>
			{!loading &&
				formulas.map((formula) => (
					<FormulaListItem
						key={`formula-${formula.fid}`}
						formula={formula}
						onPress={() => {
							navigation.navigate("Formulator", {
								formula: {
									...formula,
									user: user.uid,
								},
							});
						}}
					/>
				))}
		</ScrollView>
	);
}

function FormulaListItem({ formula, onPress, onLongPress }: FormulaListItemProps) {
	const { theme } = useThemeContext();
	return (
		<Pressable
			onPress={onPress}
			onLongPress={onLongPress}
			style={[
				tw`flex-1 flex flex-row px-4 py-4 mb-4 border rounded-md`,
				{ backgroundColor: theme.background.secondary, borderColor: theme.border },
			]}>
			<View style={tw`flex-1 flex flex-col`}>
				<ListTitle text={formula?.name} />
				<ListSubtitle text={formula?.equation.replaceAll("|", "")} />
			</View>
		</Pressable>
	);
}
