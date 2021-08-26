import React from "react";
import {
	Formula,
	FormulaAction,
	FormulatorContextProps,
	FormulatorProviderProps,
} from "../types/FormulatorTypes";

import {
	saveFormula,
	clearFormulaAll,
	clearFormulaLast,
	insertFormulaBracket,
	insertFormulaDecimal,
	insertFormulaNegative,
	insertFormulaNumber,
	insertFormulaOperation,
	insertFormulaPercent,
	insertFormulaVariable,
	createFormulaVariable,
	updateFormulaVariable,
	deleteFormulaVariable,
	calculateResult,
} from "../utilities/FormulatorLogic";
import { useAuthContext } from "./AuthProvider";

// FORMULA CONTEXT & USAGE HOOK
const FormulatorContext = React.createContext<FormulatorContextProps>(undefined!);
export const useFormulatorContext = () => React.useContext(FormulatorContext);

const defaultFormulaState = {
	name: "New Formula",
	equation: "",
	result: null,
	openBrackets: 0,
	lastConstantType: "",
	variables: [],
};

// FORMULA REDUCER
const formulaReducer = (state: Formula, action: FormulaAction): Formula => {
	const { type, payload } = action;

	switch (type) {
		case "INIT":
			// Check if payload is an instance of Formula
			if (payload == null || typeof payload === "string" || !("variables" in payload)) return state;
			return payload;

		case "RESET":
			return defaultFormulaState;

		case "CHANGE_NAME":
			if (typeof payload !== "string") return state;
			return { ...state, name: payload };

		case "SAVE_FORMULA":
			return saveFormula(state);

		case "CREATE_VARIABLE":
			// Check if payload is an instance of Variable
			if (payload == null || typeof payload === "string" || !("color" in payload)) return state;
			return createFormulaVariable(state, payload);

		case "UPDATE_VARIABLE":
			// Check if payload is an instance of Variable
			if (payload == null || typeof payload === "string" || !("color" in payload)) return state;
			return updateFormulaVariable(state, payload);

		case "DELETE_VARIABLE":
			// Check if payload is an instance of Variable
			if (payload == null || typeof payload === "string" || !("color" in payload)) return state;
			return deleteFormulaVariable(state, payload);

		case "CLEAR_LAST_CONSTANT":
			return clearFormulaLast(state);

		case "CLEAR_ALL_CONSTANTS":
			return clearFormulaAll(state);

		case "CALCULATE_RESULT":
			return calculateResult(state);

		case "INSERT_CONSTANT":
			if (!payload || typeof payload === "string" || !("constantType" in payload)) return state;

			switch (payload?.constantType) {
				case "EQ_NUMBER":
					return insertFormulaNumber(state, payload.constantValue);
				case "EQ_VARIABLE":
					return insertFormulaVariable(state, payload.constantValue);
				case "EQ_OPERATION":
					return insertFormulaOperation(state, payload.constantValue);
				case "EQ_BRACKET":
					return insertFormulaBracket(state, payload.constantValue);
				case "EQ_PERCENTAGE":
					return insertFormulaPercent(state);
				case "EQ_NEGATIVE":
					return insertFormulaNegative(state);
				case "EQ_DECIMAL":
					return insertFormulaDecimal(state);
				default:
					return state;
			}

		default:
			return state;
	}
};

// FORMULA CONTEXT PROVIDER
export default function FormulatorProvider({ children }: FormulatorProviderProps) {
	const [formula, formulaDispatch] = React.useReducer(formulaReducer, defaultFormulaState);

	React.useEffect(() => {
		formulaDispatch({ type: "CALCULATE_RESULT" });
	}, [formula.equation, formula.variables]);

	return (
		<FormulatorContext.Provider value={{ formula, formulaDispatch }}>
			{formula && children}
		</FormulatorContext.Provider>
	);
}
