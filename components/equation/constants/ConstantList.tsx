import tw from "../../../styles/tailwind";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { EquationProps, EquationConstant, OperationSymbolMap } from "../../../types/EquationTypes";
import { useThemeContext } from "../../../providers/ThemeProvider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import LineBreak from "./LineBreak";

import { Constant, ConstantNumber, ConstantVariable, ConstantOperation } from "./Constants";

interface EquationConstantListProps {
	constants: Array<EquationConstant>;
	color?: string;
}

export default function EquationConstantList({ constants, color }: EquationConstantListProps) {
	const { theme } = useThemeContext();

	return (
		<View style={tw`flex-1 flex flex-row flex-wrap justify-end py-2 px-4`}>
			{constants.map((constant, index) => (
				<React.Fragment key={`equation-constant-${index}`}>
					{constant.value === "|" ? (
						<LineBreak index={index} numConstants={constants.length - 1} />
					) : (
						<View style={tw`flex flex-row max-w-full items-center`}>
							{constant.type === "EQ_VARIABLE" && <ConstantVariable constant={constant} />}
							{constant.type === "EQ_NUMBER" && (
								<ConstantNumber constant={constant} color={theme.colors.contrast} />
							)}
							{constant.type === "EQ_OPERATION" && (
								<ConstantOperation constant={constant} color={theme.colors.purple} />
							)}
							{(constant.type === "EQ_BRACKET_OPEN" || constant.type === "EQ_BRACKET_CLOSED") && (
								<Constant constant={constant} color={theme.colors.blue} />
							)}
							{constant.type === "EQ_PERCENT" && (
								<Constant constant={constant} color={theme.colors.yellow} />
							)}
						</View>
					)}
				</React.Fragment>
			))}
		</View>
	);
}
