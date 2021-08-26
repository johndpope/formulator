import React from "react";
import { AuthContextProps, AuthProviderProps } from "../types/AuthTypes";

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

const firebaseConfig = {
	apiKey: "AIzaSyDZrNtS-Cw79Vwh8coms5XDnopbHK8Vsv0",
	authDomain: "variable-calculator-3e73a.firebaseapp.com",
	projectId: "variable-calculator-3e73a",
	storageBucket: "variable-calculator-3e73a.appspot.com",
	messagingSenderId: "808291979339",
	appId: "1:808291979339:web:ddfa4435129cc314ca3dce",
	measurementId: "G-YG69GBHDT5",
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
	firebase.firestore().settings({ experimentalForceLongPolling: true });
} else {
	firebase.app();
}

WebBrowser.maybeCompleteAuthSession();

// Initialize Firebase
const db = firebase.firestore();

const AuthContext = React.createContext<Partial<AuthContextProps>>({});
export const useAuthContext = () => React.useContext(AuthContext);

export default function AuthProvider({ children }: AuthProviderProps) {
	const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
		clientId: "808291979339-7v3q8ohmf8b2frvedngb6e0m728krjge.apps.googleusercontent.com",
	});

	const [user, setUser] = React.useState<any | null>();
	const [authError, setAuthError] = React.useState<string>();

	const signInWithGoogle = () => promptAsync();

	const signInWithEmail = ({ email, password }: { email: string; password: string }) => {
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((userCredential: any) => {
				var user = userCredential.user;
			})
			.catch((error: any) => {
				console.log(error.message);
				setAuthError(error.code.split("/")[1].split("-").join(" "));
				setTimeout(() => {
					setAuthError("");
				}, 6000);
			});
	};

	const signUpWithEmail = ({ email, password }: { email: string; password: string }) => {
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((userCredential: any) => {
				if (!userCredential.additionalUserInfo.isNewUser) return;

				setInitialUserData(userCredential.user.uid);
			})
			.catch((error: any) => {
				setAuthError(error.code.split("/")[1].split("-").join(" "));
				setTimeout(() => {
					setAuthError("");
				}, 6000);
			});
	};

	const signOut = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
				setUser(null);
				console.log("User signed out!");
			})
			.catch((error: any) => {
				// An error happened.
				console.log(`ERROR: [${error.code}] ${error.message}`);
			});
	};

	const resetPassword = (email: string) => {
		firebase
			.auth()
			.sendPasswordResetEmail(email)
			.then(() => {
				setAuthError("Password reset email was sent!");
				setTimeout(() => {
					setAuthError("");
				}, 6000);
			})
			.catch((error: any) => {
				setAuthError(error.code.split("/")[1].split("-").join(" "));
				setTimeout(() => {
					setAuthError("");
				}, 6000);
			});
	};

	const setInitialUserData = (uid: string) => {
		db.collection("user_settings").doc().set({
			user: uid,
			theme: "dark",
		});
	};

	React.useEffect(() => {
		if (response?.type === "success") {
			const { id_token } = response.params;
			const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
			firebase
				.auth()
				.signInWithCredential(credential)
				.then((res: any) => {
					if (!res.additionalUserInfo.isNewUser) return;
					setInitialUserData(res.user.uid);
				})
				.catch((err: any) => console.log(err));
		}
	}, [response]);

	React.useEffect(() => {
		let subscriber = firebase.auth().onAuthStateChanged(setUser);
		return () => subscriber();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				authError,
				resetPassword,
				signInWithGoogle,
				signInWithEmail,
				signUpWithEmail,
				signOut,
			}}>
			{children}
		</AuthContext.Provider>
	);
}
