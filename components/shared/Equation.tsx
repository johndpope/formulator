import tw from "../../styles/tailwind";
import React from "react";
import { ScrollView, View, Text } from "react-native";
import { checkConstantType, formatNumber } from "../../logic/SharedLogic";
import { EquationProps, EquationConstant } from "../../types/EquationTypes";

export default function Equation({ data, variables }: EquationProps) {
	const [constants, setConstants] = React.useState<Array<EquationConstant>>([]);
	const [numLines, setNumLines] = React.useState<number>(0);
	const scrollViewRef = React.useRef<ScrollView>(null);
	const lineHeight = React.useRef<number>(0);

	function generateConstantsArray(data: string): Array<EquationConstant> {
		let eqSplit = data.match(/([-.0-9(?%)]+)|([\+|-|\/|\*|\(|\)])|(\{([^)]+?)\})/g);
		return eqSplit === null
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
	}

	const handleContentSizeChange = (w: number, h: number) => {
		scrollViewRef?.current?.scrollToEnd?.({ animated: true });
		if (Math.round(h) > lineHeight.current) {
			setNumLines((pnl) => pnl + 1);
		}
		if (Math.round(h) < lineHeight.current) {
			setNumLines((pnl) => pnl - 1);
		}
		if (h === 0) setNumLines(0);
	};

	React.useEffect(() => {
		setConstants(generateConstantsArray(data));
	}, [data]);

	return (
		<View style={tw`p-5`}>
			<View style={[tw`h-60 w-full flex flex-row border border-gray-300 py-2 pr-2`]}>
				<View style={tw`w-8 absolute left-0 inset-y-0 border-r border-gray-300 z-50`}></View>
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
								<View style={tw`flex flex-row max-w-full overflow-hidden`}>
									{/* <> */}
									{constant.type === "EQ_NUMBER" && (
										<Text style={tw`text-2xl leading-9`}>{formatNumber(constant.value)}</Text>
									)}
									{constant.type === "EQ_OPERATION" && (
										<Text style={tw`text-2xl leading-9 text-purple-500`}>{constant.value}</Text>
									)}
									{constant.type === "EQ_VARIABLE" && (
										<Text style={tw`text-2xl leading-9 text-${constant?.color || "gray"}-500`}>
											{constant.value}
										</Text>
									)}
									{(constant.type === "EQ_BRACKET_OPEN" || constant.type === "EQ_BRACKET_CLOSED") && (
										<Text style={tw`text-2xl leading-9 text-gray-500`}>{constant.value}</Text>
									)}
									{constant.type === "EQ_PERCENT" && (
										<Text style={tw`text-2xl leading-9 text-gray-500`}>{constant.value}</Text>
									)}
									{constant.type === "EQ_DECIMAL" && (
										<Text style={tw`text-2xl leading-9`}>{constant.value}</Text>
									)}
									{/* </> */}
								</View>
							)}
						</React.Fragment>
					))}
					<View
						onLayout={(e) => {
							lineHeight.current = e.nativeEvent.layout.height;
						}}
						key={`equation-lines`}
						style={tw`w-8 absolute left-0 top-0`}>
						{[...Array(numLines).keys()].map((lineNum) => (
							<View key={`equation-line-${lineNum}`} style={tw`w-8 h-9 flex flex-row flex-none`}>
								<Text style={tw`m-auto text-xs text-gray-400`}>{lineNum + 1}</Text>
							</View>
						))}
					</View>
				</ScrollView>
			</View>
		</View>
	);
}
