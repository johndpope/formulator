import tw from "../../styles/tailwind";
import React from "react";
import { ScrollView, View, Text } from "react-native";
import { checkConstantType, formatNumber } from "../../logic/SharedLogic";
import { EquationProps, EquationConstant, OperationSymbolMap } from "../../types/EquationTypes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const operationSymbols: OperationSymbolMap = {
	"+": "plus",
	"-": "minus",
	"*": "times",
	"/": "divide",
};

export default function Equation({ data, color, variables, dispatch }: EquationProps) {
	const [loaded, setLoaded] = React.useState<boolean>(false);
	const [constants, setConstants] = React.useState<Array<EquationConstant>>([]);
	const [numLines, setNumLines] = React.useState<number>(0);
	const scrollViewRef = React.useRef<ScrollView>(null);
	const lineHeight = React.useRef<number>(0);

	function generateConstantsArray(eq: string): Array<EquationConstant> {
		let eqSplit = eq.match(/([-.0-9(?%)]+)|([\+|-|\/|\*|\(|\)])|(\{([^)]+?)\})/g);

		const constantsArray =
			eqSplit === null
				? []
				: eqSplit.map((constant) => {
						const constantType = checkConstantType(constant);
						let c: EquationConstant = {
							type: constantType,
							value: constant.replace(/\{|\}/g, ""),
						};
						if (variables && constantType === "EQ_VARIABLE") {
							let match = variables.find((v) => v.name === c.value);
							c.color = match?.color;
						}
						return c;
				  });
		return constantsArray;
	}

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
		setConstants(generateConstantsArray(data));
		setNumLines(generateLineBreaks(data));
	}, [data]);

	return (
		<View style={tw`px-5 py-1`}>
			<View style={[tw`h-52 w-full flex flex-row border border-${color || "gray"}-500 py-3 pr-3`]}>
				<View
					style={tw`w-8 absolute left-0 inset-y-0 border-r border-${color || "gray"}-500 z-50`}></View>
				<ScrollView
					bounces={false}
					ref={scrollViewRef}
					showsVerticalScrollIndicator={false}
					onContentSizeChange={handleContentSizeChange}
					contentContainerStyle={[tw`flex flex-row flex-wrap justify-end pl-12`]}>
					{constants.map((constant, index) => (
						<React.Fragment key={`equation-constant-${index}`}>
							{constant.type === "EQ_LINE_BREAK" ? (
								<View style={tw`w-full h-${index === constants.length - 1 ? "9" : "0"}`}></View>
							) : (
								<View style={tw`flex flex-row max-w-full items-center px-1`}>
									{constant.type === "EQ_NUMBER" && (
										<Text style={tw`text-white text-2xl leading-9`}>{formatNumber(constant.value)}</Text>
									)}
									{constant.type === "EQ_DECIMAL" && (
										<Text style={tw`text-white text-2xl leading-9`}>{constant.value}</Text>
									)}
									{constant.type === "EQ_PERCENT" && (
										<Text style={tw`text-2xl leading-9 text-gray-500`}>{constant.value}</Text>
									)}
									{constant.type === "EQ_OPERATION" && (
										<View style={tw`flex flex-row items-center h-9`}>
											<FontAwesomeIcon
												icon={["fal", `${operationSymbols[constant.value]}`]}
												size={20}
												style={tw`text-${color || "gray"}-500 leading-9`}
											/>
										</View>
									)}
									{(constant.type === "EQ_BRACKET_OPEN" || constant.type === "EQ_BRACKET_CLOSED") && (
										<Text style={tw`text-2xl leading-9 text-${color || "gray"}-500`}>
											{constant.value}
										</Text>
									)}
									{constant.type === "EQ_VARIABLE" && (
										<View style={tw`flex flex-row items-center h-9`}>
											<View
												style={tw`flex flex-row items-center py-1 px-2 rounded-sm bg-${
													constant?.color || "gray"
												}-500 bg-opacity-25`}>
												<Text style={tw`text-sm pr-1 text-${constant?.color || "gray"}-500`}>{`{`}</Text>
												<Text style={tw`text-sm text-white capitalize`}>{constant.value}</Text>
												<Text style={tw`text-sm pl-1 text-${constant?.color || "gray"}-500`}>{`}`}</Text>
											</View>
										</View>
									)}
								</View>
							)}
						</React.Fragment>
					))}
					<View
						key={`equation-lines`}
						style={tw`w-8 absolute left-0 top-0`}
						onLayout={(e) => {
							lineHeight.current = e.nativeEvent.layout.height;
						}}>
						{[...Array(numLines + 1).keys()].map((lineNum) => (
							<View key={`equation-line-${lineNum}`} style={tw`w-8 h-9 flex flex-row flex-none`}>
								<Text style={tw`m-auto text-sm ${color ? `text-${color}-500` : `text-gray-600`}`}>
									{lineNum + 1}
								</Text>
							</View>
						))}
					</View>
				</ScrollView>
			</View>
		</View>
	);
}
