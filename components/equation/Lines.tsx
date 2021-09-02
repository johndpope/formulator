import React from "react";
import tw from "../../styles/tailwind";
import { Text, View } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";

interface EquationLinesProps {
	numLines: number;
	lineHeight: React.MutableRefObject<number>;
}

export default function EquationsLines({ numLines, lineHeight }: EquationLinesProps) {
	const { theme } = useThemeContext();
	return (
		<View
			key={`equation-lines`}
			style={tw`absolute left-0 top-0 py-2 w-9`}
			onLayout={(e) => {
				lineHeight.current = e.nativeEvent.layout.height;
			}}>
			{[...Array(numLines + 1).keys()].map((lineNum) => (
				<View key={`equation-line-${lineNum}`} style={tw`h-8 flex flex-row flex-none`}>
					<Text
						style={[
							tw`m-auto text-sm`,
							{ color: theme.text.secondary, fontFamily: "NovaMono_400Regular" },
						]}>
						{lineNum + 1}
					</Text>
				</View>
			))}
		</View>
	);
}
