import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Formula } from "./FormulatorTypes";
import { Variable } from "./VariableTypes";

type RootStackParamList = {
	Home: undefined;
	Formulator: { formula: Formula } | undefined;
	Variable: { variable: Variable } | undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type FormulaScreenProps = NativeStackScreenProps<RootStackParamList, "Formulator">;
export type VariableScreenProps = NativeStackScreenProps<RootStackParamList, "Variable">;
