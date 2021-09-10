import { Variable } from "../types/VariableTypes";
import { EquationConstant } from "../types/EquationTypes";

type Calculable = { equation: string; lastConstantType: string; openBrackets: number };

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

export function generateConstantsArray(eq: string, variables?: Variable[]): Array<EquationConstant> {
	let eqSplit = eq.match(/([-.0-9%]+)|(\+|\/|\*|\(|\)|\|)|(\{([^)]+?)\})/g);

	const constantsArray =
		eqSplit === null
			? []
			: eqSplit.map((constant) => {
					const constantType = checkConstantType(constant);
					let c: EquationConstant = {
						type: constantType,
						value: constant.replace(/\{|\}/g, ""),
					};
					if (variables && constantType === "EQ_VARIABLE") {
						let match = variables.find((v) => v.name === c.value);
						c.color = match?.color;
					}
					return c;
			  });
	return constantsArray;
}

export function generateConstantReplacements(constants: Array<EquationConstant>, index: number) {
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
	const singleReplacement = start + "{___REPLACEMENT___}" + end;
	const fullReplacement = reduced.replaceAll(constants[index].value, "{___REPLACEMENT___}");

	return [singleReplacement, fullReplacement];
}

export function formatNumber(value: string) {
	return value.includes(".")
		? value.replace(/(.*)\./, (match) => match.replace(/\B(?=(\d{3})+(?!\d))/g, ","))
		: value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function checkIfNumberShouldBeMultiplied(equation: string) {
	const preceededByMultiplicable = /(\}|\)|%)+(\s\|)?$/g.test(equation);
	const preceededByNumberBeforeLineBreak = /(\d|\.)+(\s\|)$/g.test(equation);

	return preceededByMultiplicable || preceededByNumberBeforeLineBreak;
}

export function insertNumber(state: Calculable, value?: string) {
	// Don't execute if value is empty
	if (!value) return state;

	// Don't execute if preceeding number is longer than 14 characters
	const isNumberTooLong = /\s((\d{12})|(\d+\.\d{6}))$/g.test(state.equation);
	if (isNumberTooLong) return state;

	let equation = state.equation;

	// Check if number should be multiplied, and append multiplication symbol
	const shouldMultiply = checkIfNumberShouldBeMultiplied(equation);
	equation += shouldMultiply ? " *" : "";

	// Check if previous character is number, and if so, add this number to it
	// else create a new number
	const isPreceededByNumber = state.lastConstantType === "EQ_NUMBER";
	equation += isPreceededByNumber ? value : ` ${value}`;

	const lastConstantType = "EQ_NUMBER";

	return { equation, lastConstantType };
}

export function insertOperation(state: Calculable, value?: string) {
	// Don't execute if no value, equation is empty, or previous character is an open bracket
	if (!value || !state.equation.length || state.lastConstantType === "EQ_BRACKET_OPEN") return state;

	let equation = state.equation;

	// If preceeded by trailing decimal point then add 0
	const isPreceededByDecimal = equation.slice(-1) === ".";
	if (isPreceededByDecimal) equation += "0";

	// If preceeded by previous operation, then remove it
	const shouldReplaceOpeartion = /(\+|-|\*|\/)$/g.test(state.equation);
	if (shouldReplaceOpeartion) equation = equation.slice(0, -2);

	// If preceeded by previous operation and line break, then remove them both
	const shouldReplaceWithLineBreak = /(\+|-|\*|\/)+(\s\|)$/g.test(state.equation);
	if (shouldReplaceWithLineBreak) equation = equation.slice(0, -4);

	// Add new operation value, and trailing line break if it was previously removed
	equation += ` ${value}`;
	equation += shouldReplaceWithLineBreak ? " |" : "";
	const lastConstantType = "EQ_OPERATION";

	return { equation, lastConstantType };
}

export function insertBracket(state: Calculable, value?: string) {
	if (!value) return state;

	// Written this way for readability
	if (value === ")") {
		if (!state.equation.length) return state;
		if (state.openBrackets === 0) return state;
		if (/(\+|-|\*|\/|\()+(\s\|)?$/g.test(state.equation)) return state;
	}

	let equation = state.equation;

	// If preceeded by trailing decimal point then add 0
	const isPreceededByDecimal = equation.slice(-1) === ".";
	if (isPreceededByDecimal) equation += "0";

	// Check if multiplication symbol should be auto inserted before bracket
	const shouldMultiply = /(\d|\}|\)|%)+(\s\|)?$/g.test(equation);
	const multiplicationInsertion = value === "(" && equation.length && shouldMultiply ? " *" : "";

	// Final return values for state
	equation = equation + `${multiplicationInsertion} ${value}`;
	const lastConstantType = value === "(" ? "EQ_BRACKET_OPEN" : "EQ_BRACKET_CLOSED";
	const openBrackets = state.openBrackets + (value === "(" ? 1 : -1);

	return { equation, lastConstantType, openBrackets };
}

export function insertVariable(state: Calculable, name?: string) {
	if (!name) return state;

	let equation = state.equation;

	// If preceeded by trailing decimal point then add 0
	const isPreceededByDecimal = equation.slice(-1) === ".";
	if (isPreceededByDecimal) equation += "0";

	// Check if multiplication symbol should be added before variable
	const shouldMultiply = /(\d|\}|\)|%)+(\s\|)?$/g.test(state.equation);
	const multiplicationInsertion = state.equation.length && shouldMultiply ? " *" : "";

	// Final values to return for state
	const lastConstantType = "EQ_VARIABLE";
	equation += `${multiplicationInsertion} {${name}}`;

	return { equation, lastConstantType };
}

export function insertDecimal(state: Calculable) {
	let equation = state.equation;

	// If equation is empty or previous character is +, -, *, /, (, followed by posisble linebreak;
	// then add prepending 0 before decimal
	if (!equation.length || equation.match(/(\+|-|\*|\/|\()+(\s\|)?$/g)) equation += " 0";

	// Don't execute if preceeded by percent or number which is already a decimal (#.###)
	const isPercentage = equation.slice(-1) === "%";
	const alreadyHasDecimal = equation.match(/(\d+\.\d+)$/g);
	if (alreadyHasDecimal || isPercentage) return state;

	// If previous character is decimal, then remove it
	const isPreceededByDecimal = equation.slice(-1) === ".";
	if (isPreceededByDecimal) equation = equation.slice(0, -1);

	// If should be multiplied, then add multiplication symbol and a preceeding 0 before decimal
	const shouldMultiply = checkIfNumberShouldBeMultiplied(equation);
	equation += shouldMultiply ? " * 0" : "";

	// Finally add new decimal after all cases are taken care of
	equation += isPreceededByDecimal ? "" : ".";
	const lastConstantType = "EQ_NUMBER";

	return { equation, lastConstantType };
}

export function insertPercent(state: Calculable) {
	// Don't execute if empty or if previous charcter is not a number or linebreak
	const isLinebreak = state.equation.slice(-1) === "|";
	const isNotNumber = state.lastConstantType !== "EQ_NUMBER";
	if (!state.equation.length || isNotNumber || isLinebreak) return state;

	let equation = state.equation;

	// If preceeded decimal point then add 0
	const isPreceededByDecimal = equation.slice(-1) === ".";
	if (isPreceededByDecimal) equation += "0";

	// If previous character is already percent symbol, then remove it
	const isAlreadyPercent = equation.slice(-1) === "%";
	if (isAlreadyPercent) equation = equation.slice(0, -1);

	// Finally return number with / without percentage
	equation += isAlreadyPercent ? "" : "%";

	return { equation };
}

export function insertNegative(state: Calculable) {
	// Don't execute if empty or if previous charcter is not a number or linebreak
	const isLinebreak = state.equation.slice(-1) === "|";
	const isNotNumber = state.lastConstantType !== "EQ_NUMBER";
	if (!state.equation.length || isNotNumber || isLinebreak) return state;

	let equation = state.equation;

	// Check if number is already negative
	const isNegativeNumber = state.equation.match(/-(\d|\.|%)+$/g) !== null;

	if (isNegativeNumber) {
		// Remove existing minus symbol
		equation = equation.replace(/-(\d|\.|%)+$/g, (m) => `${m.substring(1)}`);
	} else {
		// Insert new minus symbol before number
		equation = equation.replace(/(\d|\.|%)+$/g, (m) => `-${m}`);
	}

	return { equation };
}

export function insertLineBreak(state: Calculable) {
	// Don't execute if empty or preceeding character is already line break
	const isAlreadyLineBreak = state.equation.slice(-1) === "|";
	if (!state.equation.length || isAlreadyLineBreak) return state;

	let equation = state.equation;

	// If preceeded by trailing decimal point then add 0
	const isPreceededByDecimal = equation.slice(-1) === ".";
	if (isPreceededByDecimal) equation += "0";

	equation += " |";

	return { equation };
}

export function insertLineBreakBefore(state: Calculable) {
	// console.log(state.equation);

	// Don't execute if previous chracter is already line break
	const isAlreadyLineBreak = state.equation.slice(-1) === "|";
	if (isAlreadyLineBreak) return state;

	const equation = state.equation.replace(
		/\s([*\s]+)?(\w|\+|-|\/|\*|\(|\)|\{([^{}]+)\})+$/g,
		(match) => ` |${match}`
	);

	return { equation };
}

export function clearLast(state: Calculable) {
	if (!state.equation.length) return state;

	let equation = state.equation;

	// Replace any variables, operations, numbers, decimals, percentages, and linebreaks
	// at the end of the equation
	equation = equation.replace(/\s?(-?)(\{([^{}]+)\}|\+|-|\*|\/|\(|\)|\d|0?\.|%|\|)$/g, "");

	// Calculate number of open brackets if a bracket is deleted
	const decrementBracket = state.lastConstantType === "EQ_BRACKET_OPEN";
	const incrementBracket = state.lastConstantType === "EQ_BRACKET_CLOSED";
	const bracketDifference = decrementBracket ? -1 : incrementBracket ? 1 : 0;
	const openBrackets = equation.length <= 1 ? 0 : state.openBrackets + bracketDifference;

	// Check the new last characters constant type and set state.lastConstantType to that type
	const lastConstantType = checkConstantType(equation.charAt(equation.length - 1));

	return { equation, lastConstantType, openBrackets };
}

export function clearAll(state: Calculable) {
	if (!state.equation.length) return state;

	// Reset all equation, openBrackets, and lastConstantType
	const equation = "";
	const openBrackets = 0;
	const lastConstantType = "";

	return { equation, lastConstantType, openBrackets };
}
