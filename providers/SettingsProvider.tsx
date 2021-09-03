import React from "react";
import { themes } from "../styles/Themes";
import { useAuthContext } from "./AuthProvider";
import { useSettings } from "../hooks/useSettings";
import {
	SettingsContextProps,
	SettingsProviderProps,
	SettingsMap,
	SettingsAction,
} from "../types/SettingsStypes";

const SettingsContext = React.createContext<SettingsContextProps>(undefined!);
export const useSettingsContext = () => React.useContext(SettingsContext);

const settingsReducer = (state: SettingsMap, action: SettingsAction) => {
	const { type, payload } = action;
	switch (type) {
		case "SET_THEME":
			if (payload == null) return state;
			return { ...state, theme: payload };
		default:
			return state;
	}
};

const SettingsProvider = ({ children }: SettingsProviderProps) => {
	const { userSettings } = useSettings();
	const [settings, settingsDispatch] = React.useReducer(settingsReducer, { theme: "palenight" });

	React.useEffect(() => {
		if (!userSettings) return;
		settingsDispatch({ type: "SET_THEME", payload: userSettings.theme });
	}, [userSettings]);

	return (
		<SettingsContext.Provider value={{ settings, settingsDispatch }}>
			{children}
		</SettingsContext.Provider>
	);
};

export default SettingsProvider;
