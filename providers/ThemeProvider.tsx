import React from "react";
import { themes } from "../styles/Themes";
import { ThemeContextProps, ThemeProviderProps, Theme, ThemeAction } from "../types/ThemeTypes";
import { useAuthContext } from "./AuthProvider";
import { useSettingsContext } from "./SettingsProvider";

const ThemeContext = React.createContext<ThemeContextProps>(undefined!);
export const useThemeContext = () => React.useContext(ThemeContext);

const themeReducer = (state: Theme, action: ThemeAction) => {
	const { type, payload } = action;
	switch (type) {
		case "SET_THEME":
			if (payload == null || typeof payload !== "string") return state;
			console.log(payload);
			return themes[payload];
		default:
			return state;
	}
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const { user } = useAuthContext();
	const { settings } = useSettingsContext();
	const [theme, themeDispatch] = React.useReducer(themeReducer, themes.palenight);

	React.useEffect(() => {
		if (!settings) return;
		themeDispatch({ type: "SET_THEME", payload: settings.theme });
	}, [settings]);

	return <ThemeContext.Provider value={{ theme, themeDispatch }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
