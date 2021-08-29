import React from "react";
import tw from "../styles/tailwind";
import Constants from "expo-constants";
import { useFormulas } from "../hooks/useFormulas";
import { useAuthContext } from "../providers/AuthProvider";
import { useFormulatorContext } from "../providers/FormulatorProvider";
import { HomeScreenProps } from "../types/NavigatorTypes";
import { SafeAreaView, View, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function HomeScreen({ route, navigation }: HomeScreenProps) {
	const { user, signOut, signInWithGoogle } = useAuthContext();
	const { formulaDispatch } = useFormulatorContext();
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
		<View style={[tw`flex-1 bg-warmGray-800 flex flex-col`, { paddingTop: Constants.statusBarHeight }]}>
			<View style={tw`bg-warmGray-900 h-14 w-full flex flex-row items-center justify-between px-5`}>
				<Pressable onPress={() => signOut()} style={tw`w-10 h-10`}>
					<FontAwesomeIcon icon={["fal", "sign-out-alt"]} size={24} style={tw`text-white m-auto`} />
				</Pressable>
				<Text style={tw`text-white`}>{user && user.displayName}</Text>
				<Pressable
					onPress={() =>
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
						})
					}
					style={tw`w-10 h-10`}>
					<FontAwesomeIcon icon={["fal", "plus-square"]} size={24} style={tw`text-white m-auto`} />
				</Pressable>
			</View>
			<View style={tw`flex flex-col w-full p-4`}>
				{!loading &&
					formulas.map((formula) => (
						<Pressable
							key={`formula-${formula.fid}`}
							style={tw`p-4 flex flex-row items-center`}
							onPress={() => {
								navigation.navigate("Formulator", {
									formula: {
										user: user.uid,
										...formula,
									},
								});
							}}>
							<Pressable
								onPress={() => formulaDispatch({ type: "DELETE_FORMULA", payload: formula.fid })}
								style={tw`mr-5`}>
								<FontAwesomeIcon icon={["fal", "trash-alt"]} size={20} />
							</Pressable>
							<View style={tw`flex flex-col`}>
								<Text style={tw`font-bold pb-2`}>{formula.name}</Text>
								<Text>{formula.equation.replaceAll("|", "")}</Text>
							</View>
						</Pressable>
					))}
			</View>
		</View>
	);
}
