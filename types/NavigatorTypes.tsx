import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Formula } from "./FormulatorTypes";
import { Variable } from "./VariableTypes";

type RootStackParamList = {
	Home: undefined;
	Login: undefined;
	Signup: undefined;
	Formulator: { formula: Formula } | undefined;
	Variable: { variable: Variable } | undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;
export type SignupScreenProps = NativeStackScreenProps<RootStackParamList, "Signup">;
export type VariableScreenProps = NativeStackScreenProps<RootStackParamList, "Variable">;
export type FormulaScreenProps = NativeStackScreenProps<RootStackParamList, "Formulator">;
