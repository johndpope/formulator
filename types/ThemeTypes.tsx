export type ColorMap = {
	[key: string]: string;
};

export type Theme = {
	colors: ColorMap;
	text: ColorMap;
	background: string;
	foreground: string;
};

export type ThemeAction = {
	type: string;
	payload?: Theme | string;
};

export interface ThemeContextProps {
	theme: Theme;
	themeDispatch: React.Dispatch<ThemeAction>;
}

export interface ThemeProviderProps {
	children: React.ReactNode | Array<React.ReactNode>;
}
