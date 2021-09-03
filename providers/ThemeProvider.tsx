import React from "react";
import { themes } from "../styles/Themes";
import { ThemeContextProps, ThemeProviderProps, Theme, ThemeAction } from "../types/ThemeTypes";
import { useAuthContext } from "./AuthProvider";
import { useSettingsContext } from "./SettingsProvider";

const ThemeContext = React.createContext<ThemeContextProps>(undefined!);
export const useThemeContext = () => React.useContext(ThemeContext);

const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const { settings } = useSettingsContext();
	const [theme, setTheme] = React.useState<Theme>(themes.darker);

	React.useEffect(() => {
		if (!settings) return;
		setTheme(themes[settings.theme]);
	}, [settings]);

	return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
