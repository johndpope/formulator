import mathString from "math-string";
import { Formula, Variable } from "../types/FormulatorTypes";

const checkIfShouldInsertMultiple = (state: Formula) => {
	switch (state.lastConstantType) {
		case "EQ_NUMBER":
		case "EQ_VARIABLE":
		case "EQ_BRACKET_CLOSED":
			return true;
		default:
			break;
	}

	if (state.equation.slice(-1) === "%") return true;

	return false;
};

export function checkConstantType(constant: string) {
	switch (constant) {
		case "+":
		case "-":
		case "/":
		case "*":
			return "EQ_OPERATION";
		case "(":
			return "EQ_BRACKET_OPEN";
		case ")":
			return "EQ_BRACKET_CLOSED";
		default:
			return constant?.includes("}") ? "EQ_VARIABLE" : "EQ_NUMBER";
	}
}

export function calculateResult(state: Formula) {
	let result;
	let equation = state.equation
		.replace(/\s/g, "")
		.replace(/[.0-9]+%/, (m) => `${parseInt(m) / 100}`)
		.replace(/\{([^)]+?)\}/g, (match) => {
			let variable = state.variables.find((v) => v.name === match.substring(1, match.length - 1));
			if (!variable) return "";
			return `${variable.result}`;
		});

	try {
		result = mathString(equation);
	} catch {
		result = null;
	}

	return { ...state, result };
}

export function createVariable(state: Formula, variable?: Variable) {
	if (!variable) return state;
	let variables: Array<Variable> = [...state.variables];

	variables.push(variable);

	return { ...state, variables };
}

export function updateVariable(state: Formula, variable: Variable) {
	let variables: Array<Variable> = [...state.variables];
	let indexToUpdate: number = variables.findIndex((v: Variable) => v.name === variable.name);

	variables[indexToUpdate] = variable;

	return { ...state, variables };
}

export function deleteVariable(state: Formula, variable: Variable) {
	let equation = state.equation.replaceAll(`{${variable.name}}`, `${variable.result}`);

	let variables: Array<Variable> = [...state.variables];
	let indexToUpdate: number = variables.findIndex((v: Variable) => v.name === variable.name);

	variables.splice(indexToUpdate, 1);

	return { ...state, equation, variables };
}

export function insertNumber(state: Formula, value?: string) {
	if (!value) return state;

	// Check if multiplication symbol should be auto inserted before number
	let isMultiplicable = checkIfShouldInsertMultiple(state);
	let multiplicationInsertion = state.equation.length && isMultiplicable ? " *" : "";

	let isPreceededByPercent = state.equation.slice(-1) === "%";
	let isPreceededByNumber = state.lastConstantType === "EQ_NUMBER";

	// Final return values for state
	const equation = (state.equation +=
		isPreceededByNumber && !isPreceededByPercent ? value : `${multiplicationInsertion} ${value}`);
	const lastConstantType = "EQ_NUMBER";

	return { ...state, equation, lastConstantType };
}

export function insertOperation(state: Formula, value?: string) {
	if (!value || state.lastConstantType === "EQ_BRACKET_OPEN") return state;

	let replacePrevious = state.lastConstantType === "EQ_OPERATION";

	// Final return values for state
	const equation = (replacePrevious ? state.equation.slice(0, -2) : state.equation) + ` ${value}`;
	const lastConstantType = "EQ_OPERATION";

	return { ...state, equation, lastConstantType };
}

export function insertBracket(state: Formula, value?: string) {
	if (!value) return state;

	// Written this way for readability
	if (value === ")") {
		if (!state.equation.length) return state;
		if (state.openBrackets === 0) return state;
		if (state.lastConstantType === "EQ_OPERATION") return state;
		if (state.lastConstantType === "EQ_BRACKET_OPEN") return state;
	}

	// Check if multiplication symbol should be auto inserted before bracket
	let isMultiplicable = checkIfShouldInsertMultiple(state);
	let multiplicationInsertion =
		value === "(" && state.equation.length && isMultiplicable ? " *" : "";

	// Final return values for state
	const openBrackets = state.openBrackets + value === "(" ? 1 : -1;
	const equation = state.equation + `${multiplicationInsertion} ${value}`;
	const lastConstantType = value === "(" ? "EQ_BRACKET_OPEN" : "EQ_BRACKET_CLOSED";

	return { ...state, equation, lastConstantType, openBrackets };
}

export function insertVariable(state: Formula, name?: string) {
	if (!name) return state;
	// Check if multiplication symbol should be added before variable
	let isMultiplicable = checkIfShouldInsertMultiple(state);
	let multiplicationInsertion = state.equation.length && isMultiplicable ? " *" : "";

	// Final values to return for state
	const lastConstantType = "EQ_VARIABLE";
	const equation = (state.equation += `${multiplicationInsertion} {${name}}`);

	return { ...state, equation, lastConstantType };
}

export function insertDecimal(state: Formula) {
	if (!state.equation.length || state.lastConstantType !== "EQ_NUMBER") return state;

	let equation = state.equation;
	let isPreceededByDecimal = equation.slice(-1) === ".";
	equation = isPreceededByDecimal ? equation.slice(0, -1) : (equation += ".");

	return { ...state, equation };
}

export function insertPercent(state: Formula) {
	if (!state.equation.length || state.lastConstantType !== "EQ_NUMBER") return state;

	let isPercent = state.equation.slice(-1) === "%";

	// Finally return number with / without percentage
	const equation = isPercent ? state.equation.slice(0, -1) : (state.equation += "%");

	return { ...state, equation };
}

export function insertNegative(state: Formula) {
	if (!state.equation.length || state.lastConstantType !== "EQ_NUMBER") return state;

	let equation = state.equation;
	let isNegativeNumber = state.equation.match(/-(\d|%)+$/i) !== null;

	if (isNegativeNumber) {
		equation = equation.replace(/-(\d|%)+$/i, (m) => `${m.substring(1)}`);
	} else {
		equation = equation.replace(/(\d|%)+$/i, (m) => `-${m}`);
	}
	return { ...state, equation };
}

export function clearLast(state: Formula) {
	if (!state.equation.length) return state;

	let equation = state.equation;

	if (state.lastConstantType === "EQ_VARIABLE") {
		// If last type is variable, replace {variable_name} with an empty string
		equation = equation.trim().replace(/ ?\{(\w|\s|\d)+\}$/, "");
	} else {
		let preceedingCharacter = equation.charAt(equation.length - 2);
		let isPreceededByMinus = preceedingCharacter === "-";
		let isPreceededBySpace = preceedingCharacter === " ";

		// If preceeding is (' -' minus) remove 3 characters,
		// If (' ' space) remove 2 characters,
		// Else remove 1 character
		let numCharactersToRemove = isPreceededByMinus ? -3 : isPreceededBySpace ? -2 : -1;
		equation = state.equation.slice(0, numCharactersToRemove);
	}

	let openBrackets =
		equation.length <= 1
			? 0
			: state.lastConstantType === "EQ_BRACKET_OPEN"
			? (state.openBrackets -= 1)
			: state.lastConstantType === "EQ_BRACKET_CLOSED"
			? (state.openBrackets += 1)
			: state.openBrackets;
	let lastConstantType = checkConstantType(equation.slice(-1));

	return { ...state, equation, lastConstantType, openBrackets };
}

export function clearAll(state: Formula) {
	if (!state.equation.length) return state;

	const equation = "";
	const openBrackets = 0;
	const lastConstantType = "";

	return { ...state, equation, lastConstantType, openBrackets };
}
