import React from "react";
import tw from "../../styles/tailwind";
import EquationLines from "./EquationLines";
import { ScrollView, View } from "react-native";
import { generateConstantsArray } from "../../logic/SharedLogic";
import { useThemeContext } from "../../providers/ThemeProvider";
import EquationConstantList from "./constants/EquationConstantList";
import { EquationProps, EquationConstant } from "../../types/EquationTypes";

export default function Equation({ data, variables, dispatch }: EquationProps) {
	const { theme } = useThemeContext();

	const [loaded, setLoaded] = React.useState<boolean>(false);
	const [constants, setConstants] = React.useState<Array<EquationConstant>>([]);
	const [numLines, setNumLines] = React.useState<number>(0);
	const scrollViewRef = React.useRef<ScrollView>(null);
	const initialLineHeight = React.useRef<number>(0);

	function generateLineBreaks(eq: string) {
		let lines = eq.match(/\|/g);
		return lines?.length || 0;
	}

	const handleContentSizeChange = (w: number, h: number) => {
		if (!loaded) return;
		if (Math.round(h) > initialLineHeight.current) {
			dispatch({ type: "INSERT_LINE_BREAK_BEFORE" });
		}

		scrollViewRef?.current?.scrollToEnd?.({ animated: true });
	};

	React.useEffect(() => {
		if (initialLineHeight.current > 0) setLoaded(true);
	}, [initialLineHeight.current]);

	React.useEffect(() => {
		setConstants(generateConstantsArray(data, variables));
		setNumLines(generateLineBreaks(data));
	}, [data, variables]);

	return (
		<View
			style={[
				{
					borderColor: theme.border,
					backgroundColor: theme.background.secondary,
				},
				tw`h-52 w-full flex flex-row border-t border-b`,
			]}>
			<View style={[{ borderColor: theme.border }, tw`absolute w-9 left-0 inset-y-0 border-r`]}></View>
			<ScrollView
				bounces={true}
				ref={scrollViewRef}
				showsVerticalScrollIndicator={false}
				onContentSizeChange={handleContentSizeChange}
				contentContainerStyle={[tw`flex flex-row`]}>
				<EquationLines numLines={numLines} initialLineHeight={initialLineHeight} />
				<EquationConstantList constants={constants} />
			</ScrollView>
		</View>
	);
}
