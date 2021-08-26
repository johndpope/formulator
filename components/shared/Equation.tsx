import tw from "../../styles/tailwind";
import React from "react";
import { ScrollView, View, Text } from "react-native";
import { checkConstantType } from "../../logic/SharedLogic";

export default function Equation({ data }: EquationProps) {
	const [constants, setConstants] = React.useState<Array<EquationConstant>>([]);

	function generateConstantsArray(data: string): Array<EquationConstant> {
		let eqSplit = data.match(/([-.0-9(?%)]+)|([\+|-|\/|\*|\(|\)])|(\{([^)]+?)\})/g);
		return eqSplit === null
			? []
			: eqSplit.map((constant) => {
					let constantType = checkConstantType(constant);
					let c: EquationConstant = {
						type: constantType,
						value: constant.replace(/\{|\}/g, ""),
					};
					return c;
			  });
	}

	React.useEffect(() => {
		setConstants(generateConstantsArray(data));
	}, [data]);

	return (
		<View style={tw`h-40 w-full`}>
			<ScrollView contentContainerStyle={tw`flex flex-row flex-wrap flex-1 px-5 py-4`}>
				{constants.map((constant, index) => (
					<Text key={`equation-constant-${index}`} style={tw`text-3xl`}>
						{constant.value}
					</Text>
				))}
			</ScrollView>
		</View>
	);
}
