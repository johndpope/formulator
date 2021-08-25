export type Constant = {
	constantType: string;
	constantValue?: string;
};

export type Variable = {
	color: string;
	name: string;
	equation: string;
	result: string | null;
	openBrackets: number;
	lastConstantType: string;
};

export type VariableAction = {
	type: string;
	payload?: string | Constant | Variable;
};
