import tw from "../../../styles/tailwind";
import React from "react";
import { View } from "react-native";
import { EquationConstant } from "../../../types/EquationTypes";
import { useThemeContext } from "../../../providers/ThemeProvider";

import {
	Constant,
	ConstantNumber,
	ConstantVariable,
	ConstantOperation,
	ConstantLineBreak,
} from "./EquationConstants";

interface EquationConstantListProps {
	constants: Array<EquationConstant>;
	color?: string;
}

export default function EquationConstantList({ constants, color }: EquationConstantListProps) {
	const { theme } = useThemeContext();

	return (
		<View style={tw`flex-1 flex flex-row flex-wrap justify-end pt-2 mr-4 ml-12`}>
			{constants.map((constant, index) => (
				<React.Fragment key={`equation-constant-${index}`}>
					{constant.value === "|" ? (
						<ConstantLineBreak index={index} numConstants={constants.length - 1} />
					) : (
						<View style={tw`flex flex-row max-w-full items-center`}>
							{constant.type === "EQ_VARIABLE" && <ConstantVariable constant={constant} />}
							{constant.type === "EQ_NUMBER" && (
								<ConstantNumber constant={constant} color={theme.text.secondary} />
							)}
							{constant.type === "EQ_OPERATION" && (
								<ConstantOperation constant={constant} color={theme.brand} />
							)}
							{(constant.type === "EQ_BRACKET_OPEN" || constant.type === "EQ_BRACKET_CLOSED") && (
								<Constant constant={constant} color={theme.brand} />
							)}
						</View>
					)}
				</React.Fragment>
			))}
		</View>
	);
}
