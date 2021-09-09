import tw from "../../../styles/tailwind";
import React from "react";
import { View, Pressable } from "react-native";
import { EquationConstant } from "../../../types/EquationTypes";
import { useThemeContext } from "../../../providers/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types/NavigatorTypes";

import {
	Constant,
	ConstantNumber,
	ConstantVariable,
	ConstantOperation,
	ConstantLineBreak,
} from "./EquationConstants";
import { defaultVariableState } from "../../../logic/VariableLogic";

interface EquationConstantListProps {
	constants: Array<EquationConstant>;
	color?: string;
}

export default function EquationConstantList({ constants, color }: EquationConstantListProps) {
	const { theme } = useThemeContext();
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

	function replaceNumWithVariable(index: number) {
		let before = 0;
		let after = 0;
		const reduced = constants?.reduce((a, c, idx) => {
			if (idx === index) {
				before = a.length;
				after = a.length + c.value.length + 1;
			}
			return c.type !== "EQ_VARIABLE" ? `${a} ${c.value}` : `${a} {${c.value}}`;
		}, "");
		const start = reduced?.slice(0, before) || "";
		const end = reduced?.slice(after, reduced.length) || "";

		const replacement = start + "{___REPLACEMENT___}" + end;

		navigation.navigate("Variable", {
			variable: {
				...defaultVariableState,
				lastConstantType: "EQ_NUMBER",
				equation: constants[index].value,
			},
			replacement: replacement,
		});
	}

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
								<Pressable onPress={() => replaceNumWithVariable(index)}>
									<ConstantNumber constant={constant} color={theme.text.secondary} />
								</Pressable>
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
