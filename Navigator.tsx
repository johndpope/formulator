import React from "react";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import VariableScreen from "./screens/VariableScreen";
import FormulatorScreen from "./screens/FormulatorScreen";
import { useAuthContext } from "./providers/AuthProvider";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function Navigator() {
	const { user } = useAuthContext();
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={({ navigation }) => ({
					// Prevents white flash when transfering between screens
					detachPreviousScreen: !navigation.isFocused(),
				})}>
				{user ? (
					<>
						<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
						<Stack.Screen
							name="Formulator"
							component={FormulatorScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="Variable"
							component={VariableScreen}
							options={{ headerShown: false, presentation: "modal" }}
						/>
					</>
				) : (
					<>
						<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
						<Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
