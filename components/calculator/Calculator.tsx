import React from "react";
import tw from "../../styles/tailwind";
import { View } from "react-native";
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
	PressableLineBreak,
} from "./Pressables";

interface CalculatorProps {
	dispatch: React.Dispatch<FormulaAction> | React.Dispatch<VariableAction>;
}

export default function Calculator({ dispatch }: CalculatorProps) {
	return (
		<View style={tw`flex-1 flex flex-col justify-center items-end flex-wrap p-2.5`}>
			<View style={tw`flex flex-row w-full h-14`}>
				<PressableBracket value="(" dispatch={dispatch} />
				<PressableBracket value=")" dispatch={dispatch} />
				<PressablePercent dispatch={dispatch} />
				<PressableClear dispatch={dispatch} />
			</View>
			<View style={tw`flex-1 flex flex-row w-full`}>
				<PressableNumber value="1" dispatch={dispatch} />
				<PressableNumber value="2" dispatch={dispatch} />
				<PressableNumber value="3" dispatch={dispatch} />
				<PressableOperation value="+" dispatch={dispatch} />
			</View>
			<View style={tw`flex-1 flex flex-row w-full`}>
				<PressableNumber value="4" dispatch={dispatch} />
				<PressableNumber value="5" dispatch={dispatch} />
				<PressableNumber value="6" dispatch={dispatch} />
				<PressableOperation value="-" dispatch={dispatch} />
			</View>
			<View style={tw`flex-1 flex flex-row w-full`}>
				<PressableNumber value="7" dispatch={dispatch} />
				<PressableNumber value="8" dispatch={dispatch} />
				<PressableNumber value="9" dispatch={dispatch} />
				<PressableOperation value="*" dispatch={dispatch} />
			</View>
			<View style={tw`flex-1 flex flex-row w-full`}>
				<PressableNegative dispatch={dispatch} />
				<PressableNumber value="0" dispatch={dispatch} />
				<PressableDecimal dispatch={dispatch} />
				<PressableOperation value="/" dispatch={dispatch} />
			</View>
			<View style={tw`flex flex-row w-full h-14 w-1/2`}>
				<PressableLineBreak dispatch={dispatch} />
			</View>
		</View>
	);
}
