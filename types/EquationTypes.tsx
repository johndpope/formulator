import { Variable } from "./VariableTypes";

export interface EquationProps {
	data: string;
	variables?: Array<Variable>;
}

export type EquationConstant = { type: string; value: string; color?: string };
