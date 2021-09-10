import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Formula } from "./FormulatorTypes";
import { Variable } from "./VariableTypes";

export type RootStackParamList = {
	Home: undefined;
	Login: undefined;
	Signup: undefined;
	Settings: undefined;
	Formulator: { formula: Formula } | undefined;
	Variable: { variable: Variable; replacements?: Array<string> } | undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;
export type SignupScreenProps = NativeStackScreenProps<RootStackParamList, "Signup">;
export type SettingScreenprops = NativeStackScreenProps<RootStackParamList, "Settings">;
export type VariableScreenProps = NativeStackScreenProps<RootStackParamList, "Variable">;
export type FormulaScreenProps = NativeStackScreenProps<RootStackParamList, "Formulator">;
