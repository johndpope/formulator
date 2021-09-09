import React from "react";
import "firebase/firestore";
import firebase from "firebase";
import { useAuthContext } from "./AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
	SettingsMap,
	SettingsAction,
	SettingsContextProps,
	SettingsProviderProps,
} from "../types/SettingsTypes";

const defaultSettings = {
	theme: "palenight",
	shape: "rounded",
};

const SettingsContext = React.createContext<SettingsContextProps>(undefined!);
export const useSettingsContext = () => React.useContext(SettingsContext);

const SettingsProvider = ({ children }: SettingsProviderProps) => {
	const { user } = useAuthContext();
	const [settings, setSettings] = React.useState(defaultSettings);

	const setSettingsStorage = async (settings: SettingsMap) => {
		try {
			await AsyncStorage.setItem("@theme", JSON.stringify(settings));
		} catch (e) {
			console.log(`ERROR: ${e}`);
		}
	};

	const getSettingsStorage = async () => {
		try {
			const storage = await AsyncStorage.getItem("@theme");
			if (storage == null) return;
			return JSON.parse(storage);
		} catch (e) {
			console.log(`ERROR: ${e}`);
		}
	};

	const settingsDispatch = ({ type, payload }: SettingsAction) => {
		if (payload == null) return;
		switch (type) {
			case "SET_THEME":
				if (typeof payload !== "string") return;
				firebase.firestore().collection("user_settings").doc(user.uid).update({
					theme: payload,
				});
				setSettingsStorage({ ...settings, theme: payload });
				break;
			case "SET_SHAPE":
				if (typeof payload !== "string") return;
				firebase.firestore().collection("user_settings").doc(user.uid).update({
					shape: payload,
				});
				setSettingsStorage({ ...settings, shape: payload });
				break;
			default:
				break;
		}
		return;
	};

	React.useEffect(() => {
		const initializeThemeFromStorage = async () => {
			let storedSettings = await getSettingsStorage();
			if (!storedSettings) return;
			setSettings(storedSettings);
		};
		initializeThemeFromStorage();
	}, []);

	React.useEffect(() => {
		if (!user) return;
		const settingsRef = firebase.firestore().collection("user_settings").doc(user.uid);
		const unsubscribe = settingsRef.onSnapshot(
			(doc) => {
				let settings = doc.data() as SettingsMap;
				setSettings(settings);
			},
			(err) => {
				console.log(err);
			}
		);

		return () => unsubscribe();
	}, [user]);

	return (
		<SettingsContext.Provider value={{ settings, settingsDispatch }}>
			{children}
		</SettingsContext.Provider>
	);
};

export default SettingsProvider;
