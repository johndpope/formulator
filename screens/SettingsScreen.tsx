import React from "react";
import tw from "../styles/tailwind";
import FormulaList from "../components/formula/FormulaList";
import { useAuthContext } from "../providers/AuthProvider";
import { useFormulatorContext } from "../providers/FormulatorProvider";
import { HomeScreenProps } from "../types/NavigatorTypes";
import { View, Image, ScrollView } from "react-native";
import { useThemeContext } from "../providers/ThemeProvider";

import { Title } from "../components/theme/titles/Title";
import { SettingsTitle } from "../components/settings/SettingsTitle";
import { SettingsAction } from "../components/settings/SettingsAction";
import { ScreenView } from "../components/theme/views/ScreenView";
import { Button } from "../components/theme/buttons/Button";
import { IconButton } from "../components/theme/buttons/IconButton";
import { Header } from "../components/theme/headers/Header";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { themes } from "../styles/Themes";
import { useSettingsContext } from "../providers/SettingsProvider";

export default function HomeScreen({ route, navigation }: HomeScreenProps) {
	const { theme } = useThemeContext();
	const { settings, settingsDispatch } = useSettingsContext();
	const { user, signOut } = useAuthContext();

	const handleThemePress = (t: string) => {
		settingsDispatch({ type: "SET_THEME", payload: t });
	};

	return (
		<ScreenView>
			<Header>
				<IconButton onPress={() => navigation.goBack()} icon={["fal", "chevron-left"]} />
				<Title padded text="Settings" align="right" />
			</Header>
			<ScrollView>
				<SettingsTitle text="theme" />
				{Object.entries(themes).map(([t, v]) => (
					<SettingsAction text={t} onPress={() => handleThemePress(t)}>
						{settings.theme === t && <FontAwesomeIcon icon={["fal", "check"]} color={theme.brand} />}
					</SettingsAction>
				))}
			</ScrollView>
		</ScreenView>
	);
}
