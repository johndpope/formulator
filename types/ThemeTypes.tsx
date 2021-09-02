export type ColorMap = {
	[key: string]: string;
};

export type ThemeElement = {
	[type: string]: ColorMap;
};

export type Theme = {
	brand: string;
	border: string;
	colors: ColorMap;
	text: {
		primary: string;
		secondary: string;
	};
	button: {
		primary: string;
		secondary: string;
	};
	background: {
		primary: string;
		secondary: string;
	};
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
