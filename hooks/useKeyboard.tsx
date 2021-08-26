import React from "react";
import { Platform, Keyboard, Animated } from "react-native";

export default function useKeyboardAnimations() {
	const fadeOut = React.useRef(new Animated.Value(1)).current;
	const fadeIn = React.useRef(new Animated.Value(0)).current;
	const [isKeyboardVisible, setKeyboardVibility] = React.useState(false);

	const keyboardDidShow = () => {
		Animated.timing(fadeOut, { toValue: 0.2, duration: 200, useNativeDriver: true }).start();
		setKeyboardVibility(true);
	};
	const keyboardDidHide = () => {
		Animated.timing(fadeOut, { toValue: 1, duration: 200, useNativeDriver: true }).start();
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
		fadeIn,
		fadeOut,
		isKeyboardVisible,
		dismissKeyboard,
	};
}
