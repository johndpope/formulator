import React from "react";
import { Platform, Keyboard, Animated } from "react-native";

export default function useKeyboardAnimations() {
	const fadeOutOnKeyboard = React.useRef(new Animated.Value(1)).current;
	const translateOutOnKeyboard = React.useRef(new Animated.Value(0)).current;
	const [isKeyboardVisible, setKeyboardVibility] = React.useState(false);

	const keyboardDidShow = () => {
		Animated.timing(fadeOutOnKeyboard, { toValue: 0, duration: 200, useNativeDriver: true }).start();
		Animated.timing(translateOutOnKeyboard, {
			toValue: -100,
			duration: 200,
			useNativeDriver: true,
		}).start();

		setKeyboardVibility(true);
	};
	const keyboardDidHide = () => {
		Animated.timing(fadeOutOnKeyboard, { toValue: 1, duration: 200, useNativeDriver: true }).start();
		Animated.timing(translateOutOnKeyboard, {
			toValue: 0,
			duration: 200,
			useNativeDriver: true,
		}).start();
		setKeyboardVibility(false);
	};
	const dismissKeyboard = () => Keyboard.dismiss();

	React.useEffect(() => {
		const showKeyboard = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
			keyboardDidShow
		);
		const hideKeyboard = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
			keyboardDidHide
		);

		return () => {
			showKeyboard.remove();
			hideKeyboard.remove();
		};
	}, []);

	return {
		fadeOutOnKeyboard,
		translateOutOnKeyboard,
		isKeyboardVisible,
		dismissKeyboard,
	};
}
