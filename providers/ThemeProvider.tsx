import React from "react";
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
	const [theme, themeDispatch] = React.useReducer(themeReducer, {
		background: "bg-gray-900",
		foreground: "bg-gray-800",
		text: {
			primary: "text-white",
			secondary: "text-gray-600",
		},
		colors: {
			red: "red-500",
			yellow: "yellow-500",
			green: "green-500",
			blue: "bloue-500",
			purple: "purple-500",
			pink: "pin-500",
		},
	});
	return <ThemeContext.Provider value={{ theme, themeDispatch }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
