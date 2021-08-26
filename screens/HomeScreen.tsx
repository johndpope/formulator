import React from "react";
import tw from "../styles/tailwind";
import { View, Text, Pressable } from "react-native";
import { HomeScreenProps } from "../types/NavigatorTypes";
import { useAuthContext } from "../providers/AuthProvider";
import { useFormulatorContext } from "../providers/FormulatorProvider";
import { useFormulas } from "../hooks/useFormulas";

export default function HomeScreen({ route, navigation }: HomeScreenProps) {
	const { user, signOut, signInWithGoogle } = useAuthContext();
	const { formula, formulaDispatch } = useFormulatorContext();
	const { formulas, error, loading } = useFormulas();

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
							user: user.uid,
							name: "Another Formula",
							equation: "10 + 20",
							result: "30",
							openBrackets: 0,
							lastConstantType: "",
							variables: [],
						},
					})
				}
				style={tw`p-5 bg-gray-200`}>
				<Text>Press Me</Text>
			</Pressable>
			<View style={tw`flex flex-col p-5 w-full`}>
				{!loading &&
					formulas.map((formula) => (
						<Pressable
							key={`formula-${formula.fid}`}
							style={tw`p-5 flex flex-col`}
							onPress={() =>
								navigation.navigate("Formulator", {
									formula: {
										user: user.uid,
										...formula,
									},
								})
							}>
							<Text style={tw`font-bold pb-2`}>{formula.name}</Text>
							<Text>{formula.equation}</Text>
						</Pressable>
					))}
			</View>
		</View>
	);
}
