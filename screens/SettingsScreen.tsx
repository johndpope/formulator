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
import "firebase/firestore";
import firebase from "firebase";

export default function HomeScreen({ route, navigation }: HomeScreenProps) {
	const { theme } = useThemeContext();
	const { settings, settingsDispatch } = useSettingsContext();
	const { user, signOut } = useAuthContext();

	const handleThemePress = (t: string) => {
		settingsDispatch({ type: "SET_THEME", payload: t });
	};
	const handleShapePress = (s: string) => {
		settingsDispatch({ type: "SET_SHAPE", payload: s });
	};

	return (
		<ScreenView>
			<Header>
				<IconButton onPress={() => navigation.goBack()} icon={["fal", "chevron-left"]} />
				<Title padded text="Settings" align="right" />
			</Header>
			<ScrollView>
				<SettingsTitle text="Theme" />
				{Object.entries(themes).map(([t, v]) => (
					<SettingsAction key={`theme-${t}`} text={t} onPress={() => handleThemePress(t)}>
						{settings?.theme === t && <FontAwesomeIcon icon={["fal", "check"]} color={theme.brand} />}
					</SettingsAction>
				))}
				<SettingsTitle text="Button Shape" />
				<SettingsAction
					text={"Square"}
					icon={["fal", "square-full"]}
					onPress={() => handleShapePress("square")}>
					{settings?.shape === "square" && (
						<FontAwesomeIcon icon={["fal", "check"]} color={theme.brand} />
					)}
				</SettingsAction>
				<SettingsAction
					text={"Rounded"}
					icon={["fal", "square"]}
					onPress={() => handleShapePress("rounded")}>
					{settings?.shape === "rounded" && (
						<FontAwesomeIcon icon={["fal", "check"]} color={theme.brand} />
					)}
				</SettingsAction>
				<SettingsAction
					text={"Circular"}
					icon={["fal", "circle"]}
					onPress={() => handleShapePress("circular")}>
					{settings?.shape === "circular" && (
						<FontAwesomeIcon icon={["fal", "check"]} color={theme.brand} />
					)}
				</SettingsAction>
			</ScrollView>
		</ScreenView>
	);
}
