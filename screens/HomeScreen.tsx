import React from "react";
import tw from "../styles/tailwind";
import { View, Text, Pressable } from "react-native";
import { HomeScreenProps } from "../types/NavigatorTypes";
import { useAuthContext } from "../providers/AuthProvider";
import { useFormulatorContext } from "../providers/FormulatorProvider";

export default function HomeScreen({ route, navigation }: HomeScreenProps) {
	const { formula, formulaDispatch } = useFormulatorContext();
	const { user, signOut, signInWithGoogle } = useAuthContext();

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			formulaDispatch?.({
				type: "RESET",
			});
		});
		return unsubscribe;
	}, [navigation]);

	return (
		<View style={tw`flex-1 bg-gray-100 flex flex-col items-center justify-center`}>
			<Text>{user && user.displayName}</Text>
			<Pressable onPress={() => signOut?.()} style={tw`p-5 bg-red-200`}>
				<Text>Signin out</Text>
			</Pressable>
			<Pressable onPress={() => signInWithGoogle?.()} style={tw`p-5 bg-purple-200`}>
				<Text>Signin with Google</Text>
			</Pressable>
			<Pressable
				onPress={() =>
					navigation.navigate("Formulator", {
						formula: {
							name: "Custom Name",
							equation: "",
							result: null,
							openBrackets: 0,
							lastConstantType: "",
							variables: [],
						},
					})
				}
				style={tw`p-5 bg-gray-200`}>
				<Text>Press Me</Text>
			</Pressable>
		</View>
	);
}
