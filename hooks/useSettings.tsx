import React from "react";
import "firebase/firestore";
import firebase from "firebase";
import { useAuthContext } from "../providers/AuthProvider";

export function useSettings() {
	const { user } = useAuthContext();
	const [loading, setLoading] = React.useState<boolean>(true);
	const [userSettings, setUserSettings] = React.useState<firebase.firestore.DocumentData>();
	const [error, setError] = React.useState<firebase.firestore.FirestoreError>();

	React.useEffect(() => {
		if (!user) return;
		let unsubscribe = firebase
			.firestore()
			.collection("user_settings")
			.doc(user.uid)
			.onSnapshot(
				(doc) => {
					setUserSettings(doc.data());
				},
				(err) => {
					setError(err);
					console.log(err);
				}
			);

		return () => unsubscribe();
	}, [user]);

	return {
		error,
		loading,
		userSettings,
	};
}
