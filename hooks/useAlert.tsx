import React from "react";
import tw from "../styles/tailwind";
import { View, Text, Pressable, Animated, Dimensions, InteractionManager } from "react-native";
import { useThemeContext } from "../providers/ThemeProvider";

interface AlertButtonProps {
	index: number;
	text: string;
	color?: string;
	onPress: () => void;
}

interface AlertStateButtonProps {
	text: string;
	color?: string;
	onPress: () => void;
}

interface AlertState {
	title: string;
	description?: string;
	buttons: Array<AlertStateButtonProps>;
}

export function useAlert() {
	const { theme } = useThemeContext();
	const viewRef = React.useRef<View>(null);
	const [isShown, setIsShown] = React.useState<boolean>(false);
	const [state, setState] = React.useState<AlertState>();

	const fade = React.useRef(new Animated.Value(0)).current;

	const showAlert = (alertState?: AlertState) => {
		setState(alertState);
		setIsShown(true);
		Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
	};

	const dismissAlert = () => {
		setIsShown(false);
		Animated.timing(fade, { toValue: 0, duration: 200, useNativeDriver: true }).start();
	};

	const AlertButton = ({ index, text, color, onPress }: AlertButtonProps) => {
		return (
			<Pressable
				onPress={() => {
					dismissAlert();
					onPress();
				}}
				style={({ pressed }) =>
					tw.style(`p-4 flex-1 flex flex-row justify-center`, {
						backgroundColor: pressed ? theme.background.secondary : "transparent",
						borderRightWidth: state && index < state?.buttons?.length - 1 ? 1 : 0,
						borderColor: theme.border,
					})
				}>
				<Text style={{ color: color || theme.text.secondary, fontFamily: "Poppins_600SemiBold" }}>
					{text}
				</Text>
			</Pressable>
		);
	};

	const Alert = () => {
		return (
			<>
				{state != null && isShown && (
					<Animated.View
						ref={viewRef}
						style={[
							{ opacity: fade, zIndex: 60 },
							tw.style(`absolute inset-y-0 inset-x-0 flex flex-row`),
						]}>
						<View
							style={[
								{
									backgroundColor: theme.background.secondary,
									opacity: 0.8,
								},
								tw.style(`absolute inset-y-0 inset-x-0`),
							]}></View>
						<Pressable onPress={dismissAlert} style={tw.style(`flex-1 p-10`)}>
							<View
								style={tw.style(`m-auto w-full shadow-2xl overflow-hidden`, theme.shape, {
									backgroundColor: theme.background.primary,
								})}>
								<View style={tw.style(`p-4 flex flex-col`)}>
									<Text
										style={tw.style(`text-base text-center`, {
											fontFamily: "Poppins_600SemiBold",
											color: theme.text.primary,
										})}>
										{state.title}
									</Text>
									<Text
										style={tw.style(`text-sm leading-6 text-center mt-2`, {
											fontFamily: "Poppins_400Regular",
											color: theme.text.secondary,
										})}>
										{state.description}
									</Text>
								</View>
								<View
									style={tw.style(`flex flex-row border-t`, {
										borderColor: theme.border,
									})}>
									{state.buttons.map((button, buttonIndex) => (
										<AlertButton
											key={`alert-button-${buttonIndex}`}
											index={buttonIndex}
											text={button.text}
											color={button.color}
											onPress={button.onPress}
										/>
									))}
								</View>
							</View>
						</Pressable>
					</Animated.View>
				)}
			</>
		);
	};

	return { Alert, showAlert, dismissAlert };
}
