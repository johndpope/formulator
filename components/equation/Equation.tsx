import tw from "../../styles/tailwind";
import React from "react";
import { ScrollView, View, Text } from "react-native";
import { checkConstantType, generateConstantsArray } from "../../logic/SharedLogic";
import { EquationProps, EquationConstant, OperationSymbolMap } from "../../types/EquationTypes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useThemeContext } from "../../providers/ThemeProvider";
import EquationLines from "./Lines";
import EquationConstantList from "./constants/ConstantList";

export default function Equation({ data, color, variables, dispatch }: EquationProps) {
	const { theme } = useThemeContext();

	const [loaded, setLoaded] = React.useState<boolean>(false);
	const [constants, setConstants] = React.useState<Array<EquationConstant>>([]);
	const [numLines, setNumLines] = React.useState<number>(0);
	const scrollViewRef = React.useRef<ScrollView>(null);
	const lineHeight = React.useRef<number>(0);

	function generateLineBreaks(eq: string) {
		let lines = eq.match(/\|/g);
		return lines?.length || 0;
	}

	const handleContentSizeChange = (w: number, h: number) => {
		if (!loaded) return;
		if (Math.round(h) > lineHeight.current) {
			dispatch({ type: "INSERT_LINE_BREAK_BEFORE" });
		}

		scrollViewRef?.current?.scrollToEnd?.({ animated: true });
	};

	React.useEffect(() => {
		if (lineHeight.current > 0) setLoaded(true);
	}, [lineHeight.current]);

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
				tw`h-44 w-full flex flex-row border-t border-b`,
			]}>
			<View style={[{ borderColor: theme.border }, tw`absolute w-9 left-0 inset-y-0 border-r`]}></View>
			<ScrollView
				bounces={true}
				ref={scrollViewRef}
				showsVerticalScrollIndicator={false}
				onContentSizeChange={handleContentSizeChange}
				contentContainerStyle={[tw`flex flex-row`]}>
				<EquationLines numLines={numLines} lineHeight={lineHeight} />
				<EquationConstantList constants={constants} color={color} />
			</ScrollView>
		</View>
	);
}
