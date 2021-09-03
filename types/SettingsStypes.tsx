export type SettingsMap = {
	theme: string;
};

export type SettingsAction = {
	type: string;
	payload?: string;
};

export interface SettingsContextProps {
	settings: SettingsMap;
	settingsDispatch: React.Dispatch<SettingsAction>;
}

export interface SettingsProviderProps {
	children: React.ReactNode | Array<React.ReactNode>;
}
