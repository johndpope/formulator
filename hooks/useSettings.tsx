import React from "react";
import "firebase/firestore";
import firebase from "firebase";
import { SettingsMap } from "../types/SettingsTypes";
import { useAuthContext } from "../providers/AuthProvider";

export function useSettings() {
	const { user } = useAuthContext();
	const [loading, setLoading] = React.useState<boolean>(true);
	const [userSettings, setUserSettings] = React.useState<SettingsMap>();
	const [error, setError] = React.useState<firebase.firestore.FirestoreError>();

	React.useEffect(() => {
		if (!user) return;
		let unsubscribe = firebase
			.firestore()
			.collection("user_settings")
			.doc(user.uid)
			.onSnapshot(
				(doc) => {
					let settings = doc.data() as SettingsMap;
					setUserSettings(settings);
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
