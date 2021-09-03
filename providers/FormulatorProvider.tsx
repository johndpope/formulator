import React from "react";
import { defaultFormulaState, formulaReducer } from "../logic/FormulatorLogic";
import { FormulatorContextProps, FormulatorProviderProps } from "../types/FormulatorTypes";
// FORMULA CONTEXT & USAGE HOOK
const FormulatorContext = React.createContext<FormulatorContextProps>(undefined!);
export const useFormulatorContext = () => React.useContext(FormulatorContext);

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
