export type SettingsMap = {
	theme: string;
	shape: string;
};

export type SettingsAction = {
	type: string;
	payload?: string;
};

export interface SettingsContextProps {
	settings: SettingsMap | undefined;
	settingsDispatch: (action: SettingsAction) => void;
}

export interface SettingsProviderProps {
	children: React.ReactNode | Array<React.ReactNode>;
}
