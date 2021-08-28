type Calculable = { equation: string; lastConstantType: string; openBrackets: number };

export const checkIfShouldInsertMultiple = (equation: string, lastConstantType: string): boolean => {
	switch (lastConstantType) {
		case "EQ_NUMBER":
		case "EQ_VARIABLE":
		case "EQ_BRACKET_CLOSED":
			return true;
		default:
			break;
	}

	if (equation.slice(-1) === "%") return true;

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
		case "|":
			return "EQ_LINE_BREAK";
		default:
			return constant?.includes("}") ? "EQ_VARIABLE" : "EQ_NUMBER";
	}
}

export function formatNumber(value: string) {
	return value.includes(".")
		? value.replace(/(.*)\./, (match) => match.replace(/\B(?=(\d{3})+(?!\d))/g, ","))
		: value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function insertNumber(state: Calculable, value?: string) {
	if (!value) return state;

	// Check if multiplication symbol should be auto inserted before number
	const isMultiplicable = checkIfShouldInsertMultiple(state.equation, state.lastConstantType);
	const multiplicationInsertion = state.equation.length && isMultiplicable ? " *" : "";

	const isPreceededByPercent = state.equation.slice(-1) === "%";
	const isPreceededByLineBreak = state.equation.slice(-1) === "|";
	const isPreceededByNumber = state.lastConstantType === "EQ_NUMBER";

	if (isPreceededByNumber) {
		const lastNumber: RegExpMatchArray | null = state.equation.match(/(\d|\.)+$/g);
		if (lastNumber && lastNumber[0].length >= 13) return state;
	}

	// Final return values for state
	const equation = (state.equation +=
		isPreceededByNumber && !(isPreceededByPercent || isPreceededByLineBreak)
			? value
			: `${multiplicationInsertion} ${value}`);
	const lastConstantType = "EQ_NUMBER";

	return { equation, lastConstantType };
}

export function insertOperation(state: Calculable, value?: string) {
	if (!value || state.lastConstantType === "EQ_BRACKET_OPEN") return state;

	let replacePrevious = state.lastConstantType === "EQ_OPERATION";

	// Final return values for state
	const equation = (replacePrevious ? state.equation.slice(0, -2) : state.equation) + ` ${value}`;
	const lastConstantType = "EQ_OPERATION";

	return { equation, lastConstantType };
}

export function insertBracket(state: Calculable, value?: string) {
	if (!value) return state;

	// Written this way for readability
	if (value === ")") {
		if (!state.equation.length) return state;
		if (state.openBrackets === 0) return state;
		if (state.lastConstantType === "EQ_OPERATION") return state;
		if (state.lastConstantType === "EQ_BRACKET_OPEN") return state;
	}

	// Check if multiplication symbol should be auto inserted before bracket
	const isMultiplicable = checkIfShouldInsertMultiple(state.equation, state.lastConstantType);
	const multiplicationInsertion = value === "(" && state.equation.length && isMultiplicable ? " *" : "";

	// Final return values for state
	const openBrackets = state.openBrackets + value === "(" ? 1 : -1;
	const equation = state.equation + `${multiplicationInsertion} ${value}`;
	const lastConstantType = value === "(" ? "EQ_BRACKET_OPEN" : "EQ_BRACKET_CLOSED";

	return { equation, lastConstantType, openBrackets };
}

export function insertVariable(state: Calculable, name?: string) {
	if (!name) return state;
	// Check if multiplication symbol should be added before variable
	const isMultiplicable = checkIfShouldInsertMultiple(state.equation, state.lastConstantType);
	const multiplicationInsertion = state.equation.length && isMultiplicable ? " *" : "";

	// Final values to return for state
	const lastConstantType = "EQ_VARIABLE";
	const equation = (state.equation += `${multiplicationInsertion} {${name}}`);

	return { equation, lastConstantType };
}

export function insertDecimal(state: Calculable) {
	if (!state.equation.length || state.lastConstantType !== "EQ_NUMBER") return state;
	const existingDecimal = state.equation.match(/(\d\.).+$/g);
	if (existingDecimal) return state;

	let equation = state.equation;
	const isPreceededByDecimal = equation.slice(-1) === ".";
	equation = isPreceededByDecimal ? equation.slice(0, -1) : (equation += ".");
	console.log(equation.match(/\d\.+$/g));

	return { equation };
}

export function insertPercent(state: Calculable) {
	if (!state.equation.length || state.lastConstantType !== "EQ_NUMBER") return state;

	const isPercent = state.equation.slice(-1) === "%";

	// Finally return number with / without percentage
	const equation = isPercent ? state.equation.slice(0, -1) : (state.equation += "%");

	return { equation };
}

export function insertNegative(state: Calculable) {
	if (!state.equation.length || state.lastConstantType !== "EQ_NUMBER") return state;

	let equation = state.equation;
	const isNegativeNumber = state.equation.match(/-(\d|\.|%)+$/i) !== null;

	if (isNegativeNumber) {
		// Remove existing minus symbol
		equation = equation.replace(/-(\d|\.|%)+$/i, (m) => `${m.substring(1)}`);
	} else {
		// Insert new minus symbol before number
		equation = equation.replace(/(\d|\.|%)+$/i, (m) => `-${m}`);
	}

	return { equation };
}

export function insertLineBreak(state: Calculable) {
	if (!state.equation.length || state.equation.slice(-1) === "|") return state;
	let equation = state.equation;
	equation += "|";
	return { equation };
}

export function insertLineBreakBefore(state: Calculable) {
	let isPreceededByLineBreak = state.equation.slice(-1) === "|";
	if (isPreceededByLineBreak) return state;

	const equation = state.equation.replace(/\s+\S*$/g, (match) => `|${match}`);

	return { equation };
}

export function clearLast(state: Calculable) {
	if (!state.equation.length) return state;

	let equation = state.equation;

	if (state.lastConstantType === "EQ_VARIABLE") {
		// If last type is variable, replace {variable_name} with an empty string
		equation = equation.trim().replace(/ ?\{(\w|\s|\d)+\}$/, "");
	} else {
		const preceedingCharacter = equation.charAt(equation.length - 2);
		const isPreceededByMinus = preceedingCharacter === "-";
		const isPreceededBySpace = preceedingCharacter === " ";

		// If preceeding is (' -' minus) remove 3 characters,
		// If (' ' space) remove 2 characters,
		// Else remove 1 character
		let numCharactersToRemove = isPreceededByMinus ? -3 : isPreceededBySpace ? -2 : -1;
		equation = state.equation.slice(0, numCharactersToRemove);
	}

	const openBrackets =
		equation.length <= 1
			? 0
			: state.lastConstantType === "EQ_BRACKET_OPEN"
			? (state.openBrackets -= 1)
			: state.lastConstantType === "EQ_BRACKET_CLOSED"
			? (state.openBrackets += 1)
			: state.openBrackets;
	const lastConstantType = checkConstantType(equation.slice(-1));

	return { equation, lastConstantType, openBrackets };
}

export function clearAll(state: Calculable) {
	if (!state.equation.length) return state;

	const equation = "";
	const openBrackets = 0;
	const lastConstantType = "";

	return { equation, lastConstantType, openBrackets };
}
