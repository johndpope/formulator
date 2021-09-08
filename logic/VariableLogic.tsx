import mathString from "math-string";
import { Variable, VariableAction } from "../types/VariableTypes";
import {
	clearAll,
	clearLast,
	insertNumber,
	insertOperation,
	insertBracket,
	insertPercent,
	insertDecimal,
	insertNegative,
	insertLineBreak,
	insertLineBreakBefore,
} from "./SharedLogic";

export const defaultVariableState: Variable = {
	name: "New Variable",
	color: "purple",
	equation: "",
	result: null,
	openBrackets: 0,
	lastConstantType: "",
};

export const variableReducer = (state: Variable, action: VariableAction): Variable => {
	const { type, payload } = action;

	switch (type) {
		case "INIT":
			// Check if payload is an instance of Variable
			if (payload == null || typeof payload === "string" || !("color" in payload)) return state;
			return payload;
		case "RESET":
			return defaultVariableState;

		case "CHANGE_NAME":
			if (typeof payload !== "string") return state;
			return { ...state, name: payload };

		case "CHANGE_COLOR":
			if (typeof payload !== "string") return state;
			return { ...state, color: payload };

		case "CLEAR_LAST_CONSTANT":
			return clearVariableLast(state);

		case "CLEAR_ALL_CONSTANTS":
			return clearVariableAll(state);

		case "CALCULATE_RESULT":
			return calculateResult(state);

		case "INSERT_LINE_BREAK":
			return insertVariableLineBreak(state);

		case "INSERT_LINE_BREAK_BEFORE":
			return insertVariableLineBreakBefore(state);

		case "INSERT_CONSTANT":
			if (!payload || typeof payload === "string" || !("constantType" in payload)) return state;

			switch (payload?.constantType) {
				case "EQ_NUMBER":
					return insertVariableNumber(state, payload.constantValue);
				case "EQ_OPERATION":
					return insertVariableOperation(state, payload.constantValue);
				case "EQ_BRACKET":
					return insertVariableBracket(state, payload.constantValue);
				case "EQ_PERCENT":
					return insertVariablePercent(state);
				case "EQ_NEGATIVE":
					return insertVariableNegative(state);
				case "EQ_DECIMAL":
					return insertVariableDecimal(state);
				default:
					return state;
			}

		default:
			return state;
	}
};

export function calculateResult(state: Variable) {
	let result;
	let equation = state.equation
		.replaceAll(/\s|\|/g, "")
		.replaceAll(/[.0-9]+%/g, (m) => `${parseInt(m) / 100}`);

	try {
		result = mathString(equation);
	} catch {
		result = null;
	}

	return { ...state, result };
}

export function insertVariableNumber(state: Variable, value?: string) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertNumber({ equation, lastConstantType, openBrackets }, value);

	return { ...state, ...updated };
}

export function insertVariableOperation(state: Variable, value?: string) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertOperation({ equation, lastConstantType, openBrackets }, value);

	return { ...state, ...updated };
}

export function insertVariableBracket(state: Variable, value?: string) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertBracket({ equation, lastConstantType, openBrackets }, value);

	return { ...state, ...updated };
}

export function insertVariableDecimal(state: Variable) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertDecimal({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}

export function insertVariablePercent(state: Variable) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertPercent({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}

export function insertVariableNegative(state: Variable) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertNegative({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}

export function insertVariableLineBreak(state: Variable) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertLineBreak({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}

export function insertVariableLineBreakBefore(state: Variable) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertLineBreakBefore({ equation, lastConstantType, openBrackets });
	return { ...state, ...updated };
}

export function clearVariableLast(state: Variable) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = clearLast({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}

export function clearVariableAll(state: Variable) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = clearAll({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}
