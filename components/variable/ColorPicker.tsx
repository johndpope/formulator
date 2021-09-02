import React from "react";
import tw from "../../styles/tailwind";
import { View, Pressable } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { VariableAction } from "../../types/VariableTypes";

interface ColorPickerProps {
	selected: string;
	handleColorChange: (c: string) => void;
}

export default function ColorPicker({ selected, handleColorChange }: ColorPickerProps) {
	const { theme } = useThemeContext();
	return (
		<View style={tw`flex flex-row justify-between flex-1`}>
			{Object.keys(theme.colors).map(
				(c) =>
					c !== "orange" &&
					c !== "error" &&
					c !== "gray" && (
						<Pressable
							key={`variable-color-${c}`}
							onPress={() => handleColorChange(c)}
							style={[tw`w-8 h-8 rounded-full`]}>
							<View
								style={[
									tw`flex-1 flex flex-row items-center justify-center rounded-full`,
									{ backgroundColor: theme.colors[c] },
								]}>
								{c === selected && (
									<FontAwesomeIcon
										size={20}
										icon={["fal", "check"]}
										style={{ color: theme.background.primary }}
									/>
								)}
							</View>
						</Pressable>
					)
			)}
		</View>
	);
}
