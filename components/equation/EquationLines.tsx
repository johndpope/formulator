import React from "react";
import tw from "../../styles/tailwind";
import { Text, View } from "react-native";
import { useThemeContext } from "../../providers/ThemeProvider";

interface EquationLinesProps {
	numLines: number;
	initialLineHeight: React.MutableRefObject<number>;
}

const lineHeight = 10;

export default function EquationsLines({ numLines, initialLineHeight }: EquationLinesProps) {
	const { theme } = useThemeContext();
	return (
		<View
			key={`equation-lines`}
			style={tw`absolute left-0 top-0 w-9 pt-2`}
			onLayout={(e) => {
				initialLineHeight.current = e.nativeEvent.layout.height;
			}}>
			{[...Array(numLines + 1).keys()].map((lineNum) => (
				<View key={`equation-line-${lineNum}`} style={tw`h-${lineHeight} flex flex-row flex-none`}>
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
