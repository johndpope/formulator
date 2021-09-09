import { Variable } from "./VariableTypes";
import "firebase/firestore";
import firebase from "firebase";

export type Constant = {
	constantType: string;
	constantValue?: string;
};

export type VariableWithReplacement = {
	variable: Variable;
	replacement: string;
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
	timestamp?: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
};

export type FormulaAction = {
	type: string;
	payload?: string | Constant | Formula | Variable | VariableWithReplacement;
};

export interface FormulatorProviderProps {
	data?: Formula;
	children: React.ReactNode | Array<React.ReactNode>;
}

export interface FormulatorContextProps {
	formula: Formula;
	formulaDispatch: React.Dispatch<FormulaAction>;
}
