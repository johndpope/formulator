import React from "react";
import tw from "../../styles/tailwind";
import { Pressable, View, Text } from "react-native";
import { FormulaAction } from "../../types/FormulatorTypes";
import { VariableAction } from "../../types/VariableTypes";
import {
	PressableClear,
	PressableNumber,
	PressableOperation,
	PressableBracket,
	PressablePercent,
	PressableDecimal,
	PressableNegative,
} from "./Pressables";

interface CalculatorProps {
	dispatch: React.Dispatch<FormulaAction> | React.Dispatch<VariableAction>;
}

export default function Calculator({ dispatch }: CalculatorProps) {
	return (
		<View style={tw`flex flex-row justify-center flex-wrap p-5`}>
			<PressableClear dispatch={dispatch} />
			<PressableBracket value="(" dispatch={dispatch} />
			<PressableBracket value=")" dispatch={dispatch} />
			<PressablePercent dispatch={dispatch} />
			<PressableNumber value="1" dispatch={dispatch} />
			<PressableNumber value="2" dispatch={dispatch} />
			<PressableNumber value="3" dispatch={dispatch} />
			<PressableOperation value="+" dispatch={dispatch} />
			<PressableNumber value="4" dispatch={dispatch} />
			<PressableNumber value="5" dispatch={dispatch} />
			<PressableNumber value="6" dispatch={dispatch} />
			<PressableOperation value="-" dispatch={dispatch} />
			<PressableNumber value="7" dispatch={dispatch} />
			<PressableNumber value="8" dispatch={dispatch} />
			<PressableNumber value="9" dispatch={dispatch} />
			<PressableOperation value="*" dispatch={dispatch} />
			<PressableDecimal dispatch={dispatch} />
			<PressableNumber value="0" dispatch={dispatch} />
			<PressableNegative dispatch={dispatch} />
			<PressableOperation value="/" dispatch={dispatch} />
		</View>
	);
}
