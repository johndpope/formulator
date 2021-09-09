import React from "react";
import { themes } from "../styles/Themes";
import { useSettingsContext } from "./SettingsProvider";
import { ThemeContextProps, ThemeProviderProps, Theme } from "../types/ThemeTypes";

interface ShapesMap {
	[key: string]: string;
}

const ThemeContext = React.createContext<ThemeContextProps>(undefined!);
export const useThemeContext = () => React.useContext(ThemeContext);

const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const { settings } = useSettingsContext();
	const [theme, setTheme] = React.useState<Theme>(themes.darker);
	const shapes: ShapesMap = { square: "rounded-none", rounded: "rounded-md", circular: "rounded-3xl" };

	React.useEffect(() => {
		if (!settings) return;
		setTheme({ ...themes[settings.theme], shape: shapes[settings.shape] });
	}, [settings]);

	return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
