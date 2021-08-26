import { Variable } from "./VariableTypes";

export type Constant = {
	constantType: string;
	constantValue?: string;
};

export type Formula = {
	fid?: string;
	user?: string;
	name: string;
	equation: string;
	result: string | null;
	openBrackets: number;
	lastConstantType: string;
	variables: Array<Variable>;
};

export type FormulaAction = {
	type: string;
	payload?: string | Constant | Formula | Variable;
};

export interface FormulatorProviderProps {
	data?: Formula;
	children: React.ReactNode | Array<React.ReactNode>;
}

export interface FormulatorContextProps {
	formula: Formula;
	formulaDispatch: React.Dispatch<FormulaAction>;
}
