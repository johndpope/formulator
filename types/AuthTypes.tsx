import { AuthSessionResult } from "expo-auth-session";

export interface AuthProviderProps {
	children: React.ReactNode | Array<React.ReactNode>;
}

type UserLoginCredentials = { email: string; password: string };

export interface AuthContextProps {
	user: any;
	authError: string;
	resetPassword: (email: string) => void;
	signInWithEmail: ({ email, password }: UserLoginCredentials) => void;
	signUpWithEmail: ({ email, password }: UserLoginCredentials) => void;
	signInWithGoogle: () => Promise<AuthSessionResult>;
	signOut: () => void;
}
