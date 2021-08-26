import React from "react";
import "firebase/firestore";
import firebase from "firebase";
import { Formula } from "../types/FormulatorTypes";
import { useAuthContext } from "../providers/AuthProvider";

export function useFormulas() {
	const { user } = useAuthContext();
	const [loading, setLoading] = React.useState<boolean>(true);
	const [formulas, setFormulas] = React.useState<Array<Formula>>([]);
	const [error, setError] = React.useState<firebase.firestore.FirestoreError>();

	React.useEffect(() => {
		if (!user) return;
		let unsubscribe = firebase
			.firestore()
			.collection("user_formulas")
			.where("user", "==", user.uid)
			.onSnapshot(
				(querySnapshot) => {
					let data: Array<Formula> = [];
					querySnapshot.forEach((doc) => {
						let formula: Formula = { ...doc.data(), fid: doc.id } as Formula;
						data.push(formula);
					});
					setLoading(false);
					setFormulas(data);
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
		formulas,
	};
}
