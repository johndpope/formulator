export type Variable = {
	[key: string]: string;
};

export type Formula = {
	name: string;
	equation: string;
	result: string | null;
	openBrackets: number;
	lastConstantType: string;
	variables: Array<Variable>;
};

export type FormulaAction = {
	type: string;
	payload: string | number;
};

export interface FormulatorProviderProps {
	data?: Formula;
	children: React.ReactNode | Array<React.ReactNode>;
}

export interface FormulatorContextProps {
	formula: Formula;
	dispatch: React.Dispatch<FormulaAction>;
}
