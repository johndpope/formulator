import React from "react";
import { darker } from "../styles/Themes";
import { ThemeContextProps, ThemeProviderProps, Theme, ThemeAction } from "../types/ThemeTypes";

const ThemeContext = React.createContext<ThemeContextProps>(undefined!);
export const useThemeContext = () => React.useContext(ThemeContext);

const themeReducer = (state: Theme, action: ThemeAction) => {
	const { type, payload } = action;
	switch (type) {
		case "SET_THEME":
			if (payload == null || typeof payload === "string") return state;
			return payload;
		default:
			return state;
	}
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [theme, themeDispatch] = React.useReducer(themeReducer, darker);
	return <ThemeContext.Provider value={{ theme, themeDispatch }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
