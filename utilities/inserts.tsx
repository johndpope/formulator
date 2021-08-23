import { Formula } from "../types/FormulatorTypes";

const checkIfShouldInsertMultiple = (state: Formula) => {
	switch (state.lastConstantType) {
		case "EqNumber":
		case "EqVariable":
		case "EqBracketClosed":
			return true;
		default:
			break;
	}

	if (state.equation.slice(-1) === "%") return true;

	return false;
};

function checkConstantType(constant: string) {
	switch (constant) {
		case "+":
		case "-":
		case "/":
		case "*":
			return "EqOperation";
		case "(":
			return "EqBracketOpen";
		case ")":
			return "EqBracketClosed";
		default:
			return constant?.includes("}") ? "EqVariable" : "EqNumber";
	}
}

export function insertNumber(state: Formula, value?: string) {
	if (!value) return state;

	// Check if multiplication symbol should be auto inserted before number
	let isMultiplicable = checkIfShouldInsertMultiple(state);
	let multiplicationInsertion = state.equation.length && isMultiplicable ? " *" : "";

	let isPreceededByPercent = state.equation.slice(-1) === "%";
	let isPreceededByNumber = state.lastConstantType === "EqNumber";

	// Final return values for state
	const equation = (state.equation +=
		isPreceededByNumber && !isPreceededByPercent ? value : `${multiplicationInsertion} ${value}`);
	const lastConstantType = "EqNumber";

	return { ...state, equation, lastConstantType };
}

export function insertOperation(state: Formula, value?: string) {
	if (!value || state.lastConstantType === "EqBracketOpen") return state;

	let replacePrevious = state.lastConstantType === "EqOperation";

	// Final return values for state
	const equation = (replacePrevious ? state.equation.slice(0, -2) : state.equation) + ` ${value}`;
	const lastConstantType = "EqOperation";

	return { ...state, equation, lastConstantType };
}

export function insertBracket(state: Formula, value?: string) {
	if (!value) return state;

	// Written this way for readability
	if (value === ")") {
		if (!state.equation.length) return state;
		if (state.openBrackets === 0) return state;
		if (state.lastConstantType === "EqOperation") return state;
		if (state.lastConstantType === "EqBracketOpen") return state;
	}

	// Check if multiplication symbol should be auto inserted before bracket
	let isMultiplicable = checkIfShouldInsertMultiple(state);
	let multiplicationInsertion =
		value === "(" && state.equation.length && isMultiplicable ? " *" : "";

	// Final return values for state
	const openBrackets = state.openBrackets + value === "(" ? 1 : -1;
	const equation = state.equation + `${multiplicationInsertion} ${value}`;
	const lastConstantType = value === "(" ? "EqBracketOpen" : "EqBracketClosed";

	return { ...state, equation, lastConstantType, openBrackets };
}

export function insertVariable(state: Formula, name: string) {
	// Check if multiplication symbol should be added before variable
	let isMultiplicable = checkIfShouldInsertMultiple(state);
	let multiplicationInsertion = state.equation.length && isMultiplicable ? " *" : "";

	// Final values to return for state
	const lastConstantType = "EqVariable";
	const equation = (state.equation += `${multiplicationInsertion} {${name}}`);

	return { ...state, equation, lastConstantType };
}

export function insertDecimal(state: Formula) {
	if (!state.equation.length || state.lastConstantType !== "EqNumber") return state;

	let equation = state.equation;
	let isPreceededByDecimal = equation.slice(-1) === ".";
	equation = isPreceededByDecimal ? equation.slice(0, -1) : (equation += ".");

	return { ...state, equation };
}

export function insertPercent(state: Formula) {
	if (!state.equation.length || state.lastConstantType !== "EqNumber") return state;

	let isPercent = state.equation.slice(-1) === "%";

	// Finally return number with / without percentage
	const equation = isPercent ? state.equation.slice(0, -1) : (state.equation += "%");

	return { ...state, equation };
}

export function insertNegative(state: Formula) {
	if (!state.equation.length || state.lastConstantType !== "EqNumber") return state;

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

	if (state.lastConstantType === "EqVariable") {
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
			: state.lastConstantType === "EqBracketOpen"
			? (state.openBrackets -= 1)
			: state.lastConstantType === "EqBracketClosed"
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
