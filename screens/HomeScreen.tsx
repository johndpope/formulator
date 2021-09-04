import React from "react";
import tw from "../styles/tailwind";
import FormulaList from "../components/formula/FormulaList";
import { useAuthContext } from "../providers/AuthProvider";
import { useFormulatorContext } from "../providers/FormulatorProvider";
import { HomeScreenProps } from "../types/NavigatorTypes";
import { View, Image, Text } from "react-native";
import { useThemeContext } from "../providers/ThemeProvider";

import { Title } from "../components/theme/titles/Title";
import { IconButton } from "../components/theme/buttons/IconButton";
import { ScreenView } from "../components/theme/views/ScreenView";
import { Button } from "../components/theme/buttons/Button";
import { Header } from "../components/theme/headers/Header";

export default function HomeScreen({ route, navigation }: HomeScreenProps) {
	const { theme } = useThemeContext();
	const { user, signOut } = useAuthContext();
	const { formulaDispatch } = useFormulatorContext();

	function navigateToFormula() {
		navigation.navigate("Formulator", {
			formula: {
				user: user.uid,
				name: "Another Formula",
				equation: "",
				result: null,
				openBrackets: 0,
				lastConstantType: "",
				variables: [],
			},
		});
	}

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			formulaDispatch?.({
				type: "RESET",
			});
		});
		return unsubscribe;
	}, [navigation]);

	return (
		<ScreenView>
			<Header>
				<IconButton onPress={signOut} icon={["fal", "sign-out"]} flip />
				<Image source={require("../assets/FormulatorLogo.png")} style={{ width: 45, height: 45 }} />
				<IconButton onPress={() => navigation.navigate("Settings")} icon={["fal", "user-circle"]} />
			</Header>
			<Header style={tw`mt-5 mb-2 z-50`}>
				<Title text="My Formulas" />
			</Header>

			<View style={tw`flex-1 px-5`}>
				<FormulaList />
			</View>

			<View style={[tw`p-8 pb-10`, { backgroundColor: theme.background.secondary }]}>
				<Button text="New Formula" size={"md"} onPress={navigateToFormula} />
			</View>
		</ScreenView>
	);
}
