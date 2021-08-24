import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Formula } from "./FormulatorTypes";

type RootStackParamList = {
	Home: undefined;
	Formulator: { formula: Formula } | undefined;
};

export type FormulaScreenProps = NativeStackScreenProps<RootStackParamList, "Formulator">;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
