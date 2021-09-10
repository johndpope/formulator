import React from "react";
import tw from "../styles/tailwind";
import validator from "validator";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { Button } from "../components/theme/buttons/Button";
import { IconButton } from "../components/theme/buttons/IconButton";
import { FormLabel } from "../components/theme/forms/FormLabel";
import { FormHeader } from "../components/theme/forms/FormHeader";
import { FormLink } from "../components/theme/forms/FormLink";
import { FormText } from "../components/theme/forms/FormText";

import {
	View,
	Animated,
	TextInput,
	Platform,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
} from "react-native";

import useKeyboardAnimations from "../hooks/useKeyboardAnimations";
import { SafeScreenView } from "../components/theme/views/SafeScreenView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LoginScreenProps } from "../types/NavigatorTypes";
import { useAuthContext } from "../providers/AuthProvider";
import { useThemeContext } from "../providers/ThemeProvider";

export default function LoginScreen({ navigation }: LoginScreenProps) {
	const { theme } = useThemeContext();
	const { signInWithEmail, signInWithGoogle, resetPassword, authError } = useAuthContext();
	const { isKeyboardVisible, fadeOutOnKeyboard, translateOutOnKeyboard, dismissKeyboard } =
		useKeyboardAnimations();

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
							<FormHeader color={theme.text.primary}>Login to your account</FormHeader>
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
											backgroundColor: theme.background.secondary,
											fontFamily: "Poppins_400Regular",
										},
										tw`px-4 py-2 rounded-md text-base flex flex-row items-center border`,
									]}
								/>
							</View>

							<View style={tw`w-full`}>
								<View style={tw`flex flex-row items-center justify-between`}>
									<FormLabel color={passwordError ? theme.colors.error : theme.text.primary}>
										{passwordError || "Password"}
									</FormLabel>
									{!passwordError && (
										<FormLink color={theme.text.secondary} onPress={handlePasswordReset}>
											Forgot?
										</FormLink>
									)}
								</View>
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
												backgroundColor: theme.background.secondary,
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
								<Button onPress={handleSignIn} text="Login" />
							</View>

							{!isKeyboardVisible && (
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
										text="Signin with Google"
										icon={["fab", "google"]}
										backgroundColor={theme.button.secondary}
									/>
								</Animated.View>
							)}
						</View>

						{authError ? (
							<View style={tw`flex flex-row items-center justify-center p-4`}>
								<FontAwesomeIcon
									size={20}
									color={theme.colors.error}
									style={tw.style(`mr-2`)}
									icon={["fal", "exclamation-square"]}
								/>
								<FormText color={theme.colors.error}>{authError}</FormText>
							</View>
						) : (
							<View style={tw.style(`flex flex-row justify-center p-4`)}>
								<FormLink color={theme.brand} onPress={() => navigation.navigate("Signup")}>
									Don't have an account?
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
