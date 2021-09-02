import React from "react";
import tw from "../styles/tailwind";
import Constants from "expo-constants";
import FormulaList from "../components/formula/FormulaList";
import { useAuthContext } from "../providers/AuthProvider";
import { useFormulatorContext } from "../providers/FormulatorProvider";
import { HomeScreenProps } from "../types/NavigatorTypes";
import { SafeAreaView, View, Text, Pressable, Image, ScrollView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useThemeContext } from "../providers/ThemeProvider";
import {
	Title,
	Header,
	IconButton,
	ButtonPrimary,
	ButtonSecondary,
	ScreenView,
} from "../components/ThemeComponents";

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
				<IconButton onPress={navigateToFormula} icon={["fal", "user-circle"]} />
			</Header>

			<Header style={tw`mt-5 mb-2`}>
				<Title text="My Formulas" />
				<IconButton onPress={navigateToFormula} icon={["fal", "ellipsis-v-alt"]} />
			</Header>

			<View style={tw`flex-1 px-5`}>
				<FormulaList />
			</View>

			<View style={[tw`p-8 pb-10`, { backgroundColor: theme.background.secondary }]}>
				<ButtonPrimary text="New Formula" onPress={navigateToFormula} />
			</View>
		</ScreenView>
	);
}
