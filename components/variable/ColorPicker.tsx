import React from "react";
import tw from "../../styles/tailwind";
import { View } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";
import { IconButton } from "../../components/theme/buttons/IconButton";

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
						<IconButton
							size="sm"
							key={`variable-color-${c}`}
							icon={["fal", "check"]}
							backgroundColor={theme.colors[c]}
							onPress={() => handleColorChange(c)}
							color={c === selected ? theme.background.primary : theme.colors[c]}
						/>
					)
			)}
		</View>
	);
}
