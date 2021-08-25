import mathString from "math-string";
import { Variable } from "../types/VariableTypes";
import {
	insertNumber,
	insertOperation,
	insertBracket,
	insertPercent,
	insertDecimal,
	insertNegative,
	clearLast,
	clearAll,
} from "./SharedLogic";

export function calculateResult(state: Variable) {
	let result;
	let equation = state.equation.replace(/\s/g, "").replace(/[.0-9]+%/, (m) => `${parseInt(m) / 100}`);

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
