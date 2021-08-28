import { FormulaAction } from "./FormulatorTypes";
import { Variable, VariableAction } from "./VariableTypes";
import { IconName } from "@fortawesome/fontawesome-svg-core";

export interface EquationProps {
	data: string;
	color?: string;
	variables?: Array<Variable>;
	dispatch: React.Dispatch<FormulaAction> | React.Dispatch<VariableAction>;
}

export type OperationSymbolMap = {
	[key: string]: IconName;
};

export type EquationConstant = { type: string; value: string; color?: string };
