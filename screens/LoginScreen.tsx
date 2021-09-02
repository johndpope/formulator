import React from "react";
import tw from "../styles/tailwind";
import validator from "validator";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { SafeScreenView, ButtonPrimary, ButtonSecondary } from "../components/ThemeComponents";

import {
	View,
	Text,
	Keyboard,
	Animated,
	Pressable,
	TextInput,
	Platform,
	SafeAreaView,
	TouchableOpacity,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
} from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { HeaderText, LabelText, ButtonText, BodyText } from "../components/theme/Typography";
import { LoginScreenProps } from "../types/NavigatorTypes";
import { useAuthContext } from "../providers/AuthProvider";
import useKeyboardAnimations from "../hooks/useKeyboardAnimations";

export default function LoginScreen({ navigation }: LoginScreenProps) {
	const { signInWithEmail, signInWithGoogle, resetPassword, authError } = useAuthContext();
	const { fadeOutOnKeyboard, translateOutOnKeyboard, dismissKeyboard } = useKeyboardAnimations();

	const [email, onChangeEmail] = React.useState("");
	const [emailError, setEmailError] = React.useState("");

	const [password, onChangePassword] = React.useState("");
	const [passwordError, setPasswordError] = React.useState("");
	const [passwordHidden, setPasswordHidden] = React.useState(true);

	const handleSignIn = () => {
		if (!validate()) return;
		signInWithEmail?.({ email, password });
	};

	const handlePasswordReset = () => {
		if (!validator.isEmail(email)) {
			setEmailError("Please type a valid email");
			return;
		}
		resetPassword?.(email);
	};

	const validate = () => {
		if (!validator.isEmail(email)) {
			setEmailError("Please type a valid email");
			return false;
		}
		if (validator.isEmpty(password)) {
			setPasswordError("Password should not be blank");
			return false;
		}
		return true;
	};

	React.useEffect(() => {
		if (emailError !== "") {
			setTimeout(() => {
				setEmailError("");
			}, 3000);
		}
	}, [emailError]);

	React.useEffect(() => {
		if (passwordError !== "") {
			setTimeout(() => {
				setPasswordError("");
			}, 3000);
		}
	}, [passwordError]);

	return (
		<SafeScreenView>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<TouchableWithoutFeedback onPress={dismissKeyboard}>
					<View style={tw`flex flex-col justify-between px-8 h-full`}>
						<Animated.View
							style={[
								tw`absolute px-8 pt-5`,
								{ opacity: fadeOutOnKeyboard, transform: [{ translateY: translateOutOnKeyboard }] },
							]}>
							<HeaderText style={tw`text-3xl text-white`}>Login to your Account</HeaderText>
						</Animated.View>

						{/* LOGIN FORM */}
						<View style={tw`my-auto flex flex-col justify-center z-50`}>
							<View style={tw`w-full`}>
								{!emailError ? (
									<LabelText style={tw`text-white p-2 py-3`}>Email</LabelText>
								) : (
									<LabelText style={tw`text-red-500 p-2 py-3`}>{emailError}</LabelText>
								)}
								<TextInput
									value={email}
									onChangeText={onChangeEmail}
									style={[
										{ fontFamily: "Poppins_400Regular" },
										tw`px-4 py-2 rounded-md bg-gray-800 text-white text-base flex flex-row items-center`,
									]}
								/>
							</View>

							<View style={tw`w-full`}>
								<View style={tw`flex flex-row items-center`}>
									<LabelText style={tw`text-${passwordError ? "red-500" : "white"} p-2 py-3`}>
										{passwordError || "Password"}
									</LabelText>
									{!passwordError && (
										<TouchableOpacity onPress={handlePasswordReset} style={tw` ml-auto px-2 mr-16`}>
											<BodyText style={tw`text-gray-600 underline`}>Forgot?</BodyText>
										</TouchableOpacity>
									)}
								</View>
								<View style={tw`flex flex-row w-full `}>
									<TextInput
										value={password}
										onChangeText={onChangePassword}
										style={[
											{ fontFamily: "Poppins_400Regular" },
											tw`flex-1 px-4 py-2 rounded-md bg-gray-800 text-white text-base flex flex-row items-center`,
										]}
										secureTextEntry={passwordHidden}
									/>
									<Pressable
										style={tw`ml-2 flex flex-row items-center px-4 h-full rounded-md`}
										onPress={() => setPasswordHidden((p) => !p)}>
										<FontAwesomeIcon
											size={20}
											style={tw`text-gray-700`}
											icon={["fal", passwordHidden ? "eye-slash" : "eye"]}
										/>
									</Pressable>
								</View>
							</View>

							<View style={tw`w-full mt-8`}>
								<ButtonPrimary onPress={handleSignIn} text="Login" />
							</View>

							<View style={tw`absolute w-full top-full flex flex-col justify-center`}>
								<Animated.View style={[{ opacity: fadeOutOnKeyboard }]}>
									<>
										<View style={tw`flex flex-row h-20 items-center`}>
											<View style={tw`flex-1 border border-gray-700 border-opacity-50`}></View>
											<Text style={tw`mx-4 text-gray-700`}>OR</Text>
											<View style={tw`flex-1 border border-gray-700 border-opacity-50`}></View>
										</View>
										<ButtonSecondary
											onPress={signInWithGoogle}
											text="Signin with Google"
											icon={["fab", "google"]}
										/>
									</>
								</Animated.View>
							</View>
						</View>

						{authError ? (
							<View style={tw`flex flex-row items-center justify-center p-4`}>
								<FontAwesomeIcon
									size={20}
									style={tw`text-red-500 mr-2`}
									icon={["fal", "exclamation-square"]}
								/>
								<BodyText style={tw`text-base text-red-500 text-center`}>{authError}</BodyText>
							</View>
						) : (
							<TouchableOpacity style={tw`p-4`} onPress={() => navigation.navigate("Signup")}>
								<BodyText style={tw`underline text-center text-purple-700 text-sm`}>
									Don't have an account?
								</BodyText>
							</TouchableOpacity>
						)}
					</View>
				</TouchableWithoutFeedback>
				<StatusBar style="light" />
			</KeyboardAvoidingView>
		</SafeScreenView>
	);
}
