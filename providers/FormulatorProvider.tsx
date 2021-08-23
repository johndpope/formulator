import React from "react";
import {
	Formula,
	FormulaAction,
	FormulatorContextProps,
	FormulatorProviderProps,
} from "../FormulatorTypes";

import {
	clearAll,
	clearLast,
	insertBracket,
	insertDecimal,
	insertNegative,
	insertNumber,
	insertOperation,
	insertPercent,
} from "../utilities/inserts";

// FORMULA CONTEXT & USAGE HOOK
const FormulatorContext = React.createContext<Partial<FormulatorContextProps>>({});
export const useFormulatorContext = () => React.useContext(FormulatorContext);

// FORMULA REDUCER
const formulaReducer = (state: Formula, action: FormulaAction): Formula => {
	const { type, payload } = action;

	switch (type) {
		case "CHANGE_NAME":
			if (typeof payload !== "string" || typeof payload !== "number") return state;
			return { ...state, name: payload };
		case "INSERT":
			if (typeof payload === "string" || typeof payload === "number") return state;
			switch (payload?.constantType) {
				case "EQ_NUMBER":
					return insertNumber(state, payload.constantValue);
				case "EQ_OPERATION":
					return insertOperation(state, payload.constantValue);
				case "EQ_BRACKET":
					return insertBracket(state, payload.constantValue);
				case "EQ_PERCENTAGE":
					return insertPercent(state);
				case "EQ_NEGATIVE":
					return insertNegative(state);
				case "EQ_DECIMAL":
					return insertDecimal(state);
				default:
					return state;
			}
		case "CLEAR_LAST":
			return clearLast(state);
		case "CLEAR_ALL":
			return clearAll(state);
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
