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

import { FormLabel } from "../components/theme/forms/FormLabel";
import { FormHeader } from "../components/theme/forms/FormHeader";
import { FormLink } from "../components/theme/forms/FormLink";
import { FormText } from "../components/theme/forms/FormText";
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
		<SafeScreenView backgroundColor={theme.background.secondary}>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<TouchableWithoutFeedback onPress={dismissKeyboard}>
					<View style={tw`flex flex-col justify-between px-8 h-full`}>
						<Animated.View
							style={[
								tw`absolute px-8 pt-5`,
								{ opacity: fadeOutOnKeyboard, transform: [{ translateY: translateOutOnKeyboard }] },
							]}>
							<FormHeader color={theme.text.primary}>Signup for an Account</FormHeader>
						</Animated.View>

						{/* LOGIN FORM */}
						<View style={tw`my-auto flex flex-col justify-center z-50`}>
							<View style={tw`w-full`}>
								<FormLabel color={emailError ? theme.colors.error : theme.text.primary}>
									{emailError || "Email"}
								</FormLabel>
								<TextInput
									value={email}
									onChangeText={onChangeEmail}
									keyboardAppearance="dark"
									style={[
										{
											color: theme.text.primary,
											borderColor: theme.border,
											backgroundColor: theme.background.primary,
											fontFamily: "Poppins_400Regular",
										},
										tw`px-4 py-2 rounded-md text-base flex flex-row items-center border`,
									]}
								/>
							</View>

							<View style={tw`w-full`}>
								<FormLabel color={passwordError ? theme.colors.error : theme.text.primary}>
									{passwordError || "Password"}
								</FormLabel>
								<View style={tw`flex flex-row w-full `}>
									<TextInput
										value={password}
										onChangeText={onChangePassword}
										secureTextEntry={passwordHidden}
										keyboardAppearance="dark"
										style={[
											{
												color: theme.text.primary,
												borderColor: theme.border,
												backgroundColor: theme.background.primary,
												fontFamily: "Poppins_400Regular",
											},
											tw`flex-1 px-4 py-2 mr-2  rounded-md text-base flex flex-row items-center border`,
										]}
									/>
									<IconButton
										size="lg"
										color={theme.brand}
										icon={["fal", passwordHidden ? "eye-slash" : "eye"]}
										onPress={() => setPasswordHidden((p) => !p)}
									/>
								</View>
							</View>

							<View style={tw`w-full mt-8`}>
								<Button onPress={handleSignUp} text="Create Account" />
							</View>

							<View style={tw`absolute w-full top-full flex flex-col justify-center`}>
								<Animated.View style={[{ opacity: fadeOutOnKeyboard }]}>
									<View style={tw`flex flex-row h-20 items-center`}>
										<View style={tw.style(`flex-1 border`, { borderColor: theme.border })} />
										<View style={tw.style(`mx-4`)}>
											<FormText color={theme.text.secondary}>OR</FormText>
										</View>
										<View style={tw.style(`flex-1 border`, { borderColor: theme.border })} />
									</View>

									<Button
										onPress={signInWithGoogle}
										text="Signup with Google"
										icon={["fab", "google"]}
										backgroundColor={theme.background.primary}
									/>
								</Animated.View>
							</View>
						</View>

						{authError ? (
							<View style={tw`flex flex-row items-center justify-center p-4 rounded-md`}>
								<FontAwesomeIcon
									size={24}
									style={tw`text-white mr-2`}
									icon={["fal", "exclamation-square"]}
								/>
								<FormText color={theme.colors.error}>{authError}</FormText>
							</View>
						) : (
							<View style={tw`flex flex-row justify-center p-4`}>
								<FormLink onPress={() => navigation.navigate("Login")} color={theme.brand}>
									Already signed up? Sign in here.
								</FormLink>
							</View>
						)}
					</View>
				</TouchableWithoutFeedback>
				<StatusBar style="light" />
			</KeyboardAvoidingView>
		</SafeScreenView>
	);
}
