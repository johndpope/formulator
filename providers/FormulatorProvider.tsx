import React from "react";
import {
	Formula,
	FormulaAction,
	FormulatorContextProps,
	FormulatorProviderProps,
} from "../types/FormulatorTypes";

import {
	clearAll,
	clearLast,
	insertBracket,
	insertDecimal,
	insertVariable,
	insertNegative,
	insertNumber,
	insertOperation,
	insertPercent,
	calculateResult,
} from "../utilities/inserts";

// FORMULA CONTEXT & USAGE HOOK
const FormulatorContext = React.createContext<Partial<FormulatorContextProps>>({});
export const useFormulatorContext = () => React.useContext(FormulatorContext);

// FORMULA REDUCER
const formulaReducer = (state: Formula, action: FormulaAction): Formula => {
	const { type, payload } = action;

	switch (type) {
		case "RESET":
			if (payload == null || typeof payload === "string" || !("name" in payload)) return state;
			return payload;

		case "CHANGE_NAME":
			if (typeof payload !== "string") return state;
			return { ...state, name: payload };

		case "CLEAR_LAST_CONSTANT":
			return clearLast(state);

		case "CLEAR_ALL_CONSTANTS":
			return clearAll(state);

		case "CALCULATE_RESULT":
			return calculateResult(state);

		case "INSERT_CONSTANT":
			if (!payload || typeof payload === "string" || !("constantType" in payload)) return state;

			switch (payload?.constantType) {
				case "EQ_NUMBER":
					return insertNumber(state, payload.constantValue);
				case "EQ_VARIABLE":
					return insertVariable(state, payload.constantValue);
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

		default:
			return state;
	}
};

// FORMULA CONTEXT PROVIDER
export default function FormulatorProvider({ children }: FormulatorProviderProps) {
	const [formula, dispatch] = React.useReducer(formulaReducer, {
		name: "New Formula",
		equation: "",
		result: null,
		openBrackets: 0,
		lastConstantType: "",
		variables: [],
	});

	React.useEffect(() => {
		dispatch({ type: "CALCULATE_RESULT" });
	}, [formula.equation]);

	return (
		<FormulatorContext.Provider value={{ formula, dispatch }}>
			{formula && children}
		</FormulatorContext.Provider>
	);
}
