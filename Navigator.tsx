import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import VariableScreen from "./screens/VariableScreen";
import FormulatorScreen from "./screens/FormulatorScreen";

const Stack = createStackNavigator();

export default function Navigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Formulator" component={FormulatorScreen} options={{ headerShown: false }} />
				<Stack.Screen
					name="Variable"
					component={VariableScreen}
					options={{ headerShown: false, presentation: "modal" }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
