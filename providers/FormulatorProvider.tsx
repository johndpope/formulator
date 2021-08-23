import React from "react";

// FORMULA CONTEXT & USAGE HOOK
const FormulatorContext = React.createContext<Partial<FormulatorContextProps>>({});
export const useFormulatorContext = () => React.useContext(FormulatorContext);

// FORMULA REDUCER
const formulaReducer = (state: Formula, action: FormulaAction) => {
	const { type, payload } = action;
	if (payload == null) return state;

	switch (type) {
		case "CHANGE_NAME":
			return { ...state, name: payload.toString() };
		default:
			return state;
	}
};

// FORMULA CONTEXT PROVIDER
export default function FormulatorProvider({ data, children }: FormulatorProviderProps) {
	const [formula, dispatch] = React.useReducer(formulaReducer, {
		name: "New Formula",
		equation: "",
		result: null,
		openBrackets: 0,
		lastConstantType: "",
		variables: [],
	});

	return (
		<FormulatorContext.Provider value={{ formula, dispatch }}>
			{children}
		</FormulatorContext.Provider>
	);
}

type Variable = {
	[key: string]: string;
};

type Formula = {
	name: string;
	equation: string;
	result: string | null;
	openBrackets: number;
	lastConstantType: string;
	variables: Array<Variable>;
};

type FormulaAction = {
	type: string;
	payload: string | number;
};

interface FormulatorProviderProps {
	data?: Formula;
	children: React.ReactNode | Array<React.ReactNode>;
}

interface FormulatorContextProps {
	formula: Formula;
	dispatch: React.Dispatch<FormulaAction>;
}
