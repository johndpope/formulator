import { v4 as uuid } from "uuid";
import mathString from "math-string";
import "firebase/firestore";
import firebase from "firebase";
import { Formula, FormulaAction, VariableWithReplacement } from "../types/FormulatorTypes";
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

export const defaultFormulaState = {
	name: "New Formula",
	equation: "",
	result: null,
	openBrackets: 0,
	lastConstantType: "",
	variables: [],
};

export const formulaReducer = (state: Formula, action: FormulaAction): Formula => {
	const { type, payload } = action;

	switch (type) {
		case "INIT":
			// Check if payload is an instance of Formula
			if (payload == null || typeof payload === "string" || !("variables" in payload)) return state;
			return payload;

		case "RESET":
			return defaultFormulaState;

		case "CHANGE_NAME":
			if (typeof payload !== "string") return state;
			return { ...state, name: payload };

		case "SAVE_FORMULA":
			return saveFormula(state);

		case "DELETE_FORMULA":
			if (typeof payload !== "string") return state;
			return deleteFormula(state, payload);

		case "CREATE_VARIABLE":
			// Check if payload is an instance of Variable
			if (payload == null || typeof payload === "string" || !("color" in payload)) return state;
			return createFormulaVariable(state, payload);

		case "UPDATE_VARIABLE":
			// Check if payload is an instance of Variable
			if (payload == null || typeof payload === "string" || !("color" in payload)) return state;
			return updateFormulaVariable(state, payload);

		case "DELETE_VARIABLE":
			// Check if payload is an instance of Variable
			if (payload == null || typeof payload === "string" || !("color" in payload)) return state;
			return deleteFormulaVariable(state, payload);

		case "REPLACE_NUM_WITH_VARIABLE":
			// Check if payload is an instance of VariableReplacement
			if (payload == null || typeof payload === "string" || !("replacement" in payload)) return state;
			return replaceNumWithVariable(state, payload);

		case "CALCULATE_RESULT":
			return calculateResult(state);

		case "CLEAR_LAST_CONSTANT":
			return clearFormulaLast(state);

		case "CLEAR_ALL_CONSTANTS":
			return clearFormulaAll(state);

		case "INSERT_LINE_BREAK":
			return insertFormulaLineBreak(state);

		case "INSERT_LINE_BREAK_BEFORE":
			return insertFormulaLineBreakBefore(state);

		case "INSERT_CONSTANT":
			if (!payload || typeof payload === "string" || !("constantType" in payload)) return state;

			switch (payload?.constantType) {
				case "EQ_NUMBER":
					return insertFormulaNumber(state, payload.constantValue);
				case "EQ_VARIABLE":
					return insertFormulaVariable(state, payload.constantValue);
				case "EQ_OPERATION":
					return insertFormulaOperation(state, payload.constantValue);
				case "EQ_BRACKET":
					return insertFormulaBracket(state, payload.constantValue);
				case "EQ_PERCENT":
					return insertFormulaPercent(state);
				case "EQ_NEGATIVE":
					return insertFormulaNegative(state);
				case "EQ_DECIMAL":
					return insertFormulaDecimal(state);
				default:
					return state;
			}

		default:
			return state;
	}
};

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

export function deleteFormula(state: Formula, fid: string) {
	const ref = firebase.firestore().collection("user_formulas").doc(fid);

	ref
		.delete()
		.then(() => console.log("Document successfully deleted!"))
		.catch((error) => console.error("Error removing document: ", error));

	return state;
}

export function createFormulaVariable(state: Formula, variable?: Variable) {
	if (!variable || !("variables" in state) || !Array.isArray(state.variables)) return state;
	const variables: Array<Variable> = [...state.variables];
	const vid = uuid();
	variables.push({ ...variable, vid });

	return { ...state, variables };
}

export function updateFormulaVariable(state: Formula, variable: Variable) {
	if (!variable || !("variables" in state) || !Array.isArray(state.variables)) return state;
	let variables: Array<Variable> = [...state.variables];
	let indexToUpdate: number = variables.findIndex((v: Variable) => v.vid === variable.vid);

	const equation = state.equation.replaceAll(`${variables[indexToUpdate].name}`, variable.name);
	variables[indexToUpdate] = variable;

	return { ...state, equation, variables };
}

export function deleteFormulaVariable(state: Formula, variable: Variable) {
	if (!variable || !("variables" in state) || !Array.isArray(state.variables)) return state;
	let equation = state.equation.replaceAll(`{${variable.name}}`, `${variable.result}`);

	let variables: Array<Variable> = [...state.variables];
	let indexToUpdate: number = variables.findIndex((v: Variable) => v.name === variable.name);

	variables.splice(indexToUpdate, 1);

	return { ...state, equation, variables };
}

export function replaceNumWithVariable(state: Formula, variableReplacement: VariableWithReplacement) {
	const { variable, replacement } = variableReplacement;
	if (!variable || !("variables" in state) || !Array.isArray(state.variables)) return state;
	const equation = replacement.replaceAll("{___REPLACEMENT___}", ` {${variable.name}}`);
	const variables: Array<Variable> = [...state.variables];
	const vid = uuid();
	variables.push({ ...variable, vid });

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
	let equation = state.equation;
	// Replace variables if state is an instance of Formula
	if (state?.variables.length) {
		equation = equation.replace(/\{.+?\}/g, (match) => {
			let variable = state.variables.find((v) => {
				return v.name === match.substring(1, match.length - 1);
			});
			if (!variable) return "";
			return `${variable.result}`;
		});
	}

	// Remove spaces / linebreaks, and replace percentage values
	equation = equation.replaceAll(/\s|\|/g, "").replaceAll(/[.0-9]+%/g, (m) => `${parseInt(m) / 100}`);

	try {
		result = mathString(equation);
	} catch {
		result = null;
	}

	return { ...state, result };
}
