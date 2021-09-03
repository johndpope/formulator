import React from "react";
import tw from "../styles/tailwind";
import validator from "validator";
import { StatusBar } from "expo-status-bar";
import {
	Text,
	View,
	Animated,
	Platform,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
} from "react-native";
import { useAuthContext } from "../providers/AuthProvider";
import { useThemeContext } from "../providers/ThemeProvider";

import { fab } from "@fortawesome/free-brands-svg-icons";
import { fal } from "@fortawesome/pro-light-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { HeaderText, ButtonText, LabelText, BodyText } from "../components/theme/Typography";
import { SignupScreenProps } from "../types/NavigatorTypes";
import useKeyboardAnimations from "../hooks/useKeyboardAnimations";

import { Button } from "../components/theme/buttons/Button";
import { IconButton } from "../components/theme/buttons/IconButton";
import { SafeScreenView } from "../components/theme/views/SafeScreenView";

library.add(fab, fal);

export default function SignUp({ navigation }: SignupScreenProps) {
	const { theme } = useThemeContext();
	const { signInWithGoogle, signUpWithEmail, authError } = useAuthContext();
	const { fadeOutOnKeyboard, translateOutOnKeyboard, dismissKeyboard } = useKeyboardAnimations();

	const [emailError, setEmailError] = React.useState("");
	const [email, onChangeEmail] = React.useState("");

	const [passwordHidden, setPasswordHidden] = React.useState(true);
	const [passwordError, setPasswordError] = React.useState("");
	const [password, onChangePassword] = React.useState("");

	const handleSignUp = () => {
		if (!validate()) return;
		signUpWithEmail?.({ email, password });
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
							<HeaderText style={tw`text-3xl text-white`}>Signup for an Account</HeaderText>
						</Animated.View>

						{/* LOGIN FORM */}
						<View style={tw`my-auto flex flex-col justify-center z-50`}>
							<View style={tw`w-full`}>
								{!emailError ? (
									<LabelText style={tw`text-white p-2 py-3`}>Email</LabelText>
								) : (
									<LabelText style={tw`text-yellow-400 p-2 py-3`}>! {emailError}</LabelText>
								)}
								<TextInput
									value={email}
									onChangeText={onChangeEmail}
									style={[
										{ fontFamily: "Poppins_400Regular" },
										tw`px-4 py-2 rounded-md bg-gray-900 bg-opacity-20 text-white text-base flex flex-row items-center`,
									]}
								/>
							</View>

							<View style={tw`w-full`}>
								{!passwordError ? (
									<LabelText style={tw`text-white p-2 py-3`}>Password</LabelText>
								) : (
									<LabelText style={tw`text-yellow-400 p-2 py-3`}>! {passwordError}</LabelText>
								)}
								<View style={tw`flex flex-row w-full `}>
									<TextInput
										value={password}
										onChangeText={onChangePassword}
										style={[
											{ fontFamily: "Poppins_400Regular" },
											tw`flex-1 px-4 py-2 mr-2 rounded-md bg-gray-900 bg-opacity-20 text-white text-base flex flex-row items-center`,
										]}
										secureTextEntry={passwordHidden}
									/>
									<IconButton
										color={theme.brand}
										icon={["fal", passwordHidden ? "eye-slash" : "eye"]}
										onPress={() => setPasswordHidden((p) => !p)}
									/>
								</View>
							</View>

							<View style={tw`w-full mt-8`}>
								<Button
									onPress={handleSignUp}
									text="Create Account"
									textColor={theme.brand}
									backgroundColor={theme.text.primary}
								/>

								{/* <Pressable
									style={tw`flex flex-row items-center px-4 py-3 rounded-full border border-white bg-white`}
									onPress={handleSignUp}>
									<ButtonText style={tw`text-purple-700 text-base mx-auto`}>Create Account</ButtonText>
								</Pressable> */}
							</View>

							<View style={tw`absolute w-full top-full flex flex-col justify-center`}>
								<Animated.View style={[{ opacity: fadeOutOnKeyboard }]}>
									<View style={tw`flex flex-row h-20 items-center`}>
										<View style={tw`flex-1 border border-white border-opacity-10`}></View>
										<Text style={tw`mx-4 text-white`}>OR</Text>
										<View style={tw`flex-1 border border-white border-opacity-10`}></View>
									</View>

									<Button
										onPress={signInWithGoogle}
										text="Signup with Google"
										icon={["fab", "google"]}
										backgroundColor={theme.button.secondary}
									/>
								</Animated.View>
							</View>
						</View>

						{authError ? (
							<View style={tw`flex flex-row items-center justify-center p-4 rounded-md bg-red-500`}>
								<FontAwesomeIcon
									size={24}
									style={tw`text-white mr-2`}
									icon={["fal", "exclamation-square"]}
								/>
								<BodyText style={tw`text-base text-yellow-400 text-center mx-auto`}>
									{authError}
								</BodyText>
							</View>
						) : (
							<TouchableOpacity style={tw`p-4`} onPress={() => navigation.navigate("Login")}>
								<BodyText style={tw`underline text-center text-white text-sm`}>
									Already signed up? Sign in here.
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
