import mathString from "math-string";
import "firebase/firestore";
import firebase from "firebase";
import { Formula } from "../types/FormulatorTypes";
import { Variable } from "../types/VariableTypes";
import {
	clearAll,
	clearLast,
	insertNumber,
	insertOperation,
	insertBracket,
	insertVariable,
	insertPercent,
	insertDecimal,
	insertNegative,
	insertLineBreak,
	insertLineBreakBefore,
} from "./SharedLogic";

export function saveFormula(state: Formula) {
	if ("fid" in state) {
		return updateFormula(state);
	} else {
		return createFormula(state);
	}
}

export function createFormula(state: Formula) {
	const ref = firebase.firestore().collection("user_formulas").doc();

	const fid = ref.id;
	const timestamp = firebase.firestore.FieldValue.serverTimestamp();

	const formula = { ...state, fid, timestamp };

	ref
		.set(formula)
		.then(() => console.log("Successfully created formula"))
		.catch((err) => console.log(err));

	return formula;
}

export function updateFormula(state: Formula) {
	const ref = firebase.firestore().collection("user_formulas").doc(state.fid);

	const timestamp = firebase.firestore.FieldValue.serverTimestamp();
	const formula = { ...state, timestamp };

	ref
		.update(formula)
		.then(() => console.log("successfully updated formula"))
		.catch((err) => console.log(err));

	return formula;
}

export function createFormulaVariable(state: Formula, variable?: Variable) {
	if (!variable || !("variables" in state) || !Array.isArray(state.variables)) return state;
	let variables: Array<Variable> = [...state.variables];

	variables.push(variable);

	return { ...state, variables };
}

export function updateFormulaVariable(state: Formula, variable: Variable) {
	if (!variable || !("variables" in state) || !Array.isArray(state.variables)) return state;
	let variables: Array<Variable> = [...state.variables];
	let indexToUpdate: number = variables.findIndex((v: Variable) => v.name === variable.name);

	variables[indexToUpdate] = variable;

	return { ...state, variables };
}

export function deleteFormulaVariable(state: Formula, variable: Variable) {
	if (!variable || !("variables" in state) || !Array.isArray(state.variables)) return state;
	let equation = state.equation.replaceAll(`{${variable.name}}`, `${variable.result}`);

	let variables: Array<Variable> = [...state.variables];
	let indexToUpdate: number = variables.findIndex((v: Variable) => v.name === variable.name);

	variables.splice(indexToUpdate, 1);

	return { ...state, equation, variables };
}

export function insertFormulaNumber(state: Formula, value?: string) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertNumber({ equation, lastConstantType, openBrackets }, value);

	return { ...state, ...updated };
}

export function insertFormulaOperation(state: Formula, value?: string) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertOperation({ equation, lastConstantType, openBrackets }, value);

	return { ...state, ...updated };
}

export function insertFormulaBracket(state: Formula, value?: string) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertBracket({ equation, lastConstantType, openBrackets }, value);

	return { ...state, ...updated };
}

export function insertFormulaVariable(state: Formula, name?: string) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertVariable({ equation, lastConstantType, openBrackets }, name);

	return { ...state, ...updated };
}

export function insertFormulaDecimal(state: Formula) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertDecimal({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}

export function insertFormulaPercent(state: Formula) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertPercent({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}

export function insertFormulaNegative(state: Formula) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertNegative({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}

export function insertFormulaLineBreak(state: Formula) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertLineBreak({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}

export function insertFormulaLineBreakBefore(state: Formula) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = insertLineBreakBefore({ equation, lastConstantType, openBrackets });
	return { ...state, ...updated };
}

export function clearFormulaLast(state: Formula) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = clearLast({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}

export function clearFormulaAll(state: Formula) {
	const { equation, lastConstantType, openBrackets } = state;
	const updated = clearAll({ equation, lastConstantType, openBrackets });

	return { ...state, ...updated };
}

export function calculateResult(state: Formula) {
	let result;
	let equation = state.equation.replace(/\s|\|/g, "").replace(/[.0-9]+%/, (m) => `${parseInt(m) / 100}`);

	// Replace variables if state is an instance of Formula
	if (state?.variables.length) {
		equation = equation.replace(/\{([^)]+?)\}/g, (match) => {
			let variable = state.variables.find((v) => v.name === match.substring(1, match.length - 1));
			if (!variable) return "";
			return `${variable.result}`;
		});
	}

	try {
		result = mathString(equation);
	} catch {
		result = null;
	}

	return { ...state, result };
}
