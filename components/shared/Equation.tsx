import tw from "../../styles/tailwind";
import React from "react";
import { View, Text } from "react-native";
import { checkConstantType } from "../../utilities/inserts";

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
		if (!data) return;
		setConstants(generateConstantsArray(data));
	}, [data]);

	return (
		<View style={tw`flex flex-row p-5`}>
			{constants.map((constant, index) => (
				<Text key={`equation-constant-${index}`}>{constant.value}</Text>
			))}
		</View>
	);
}
