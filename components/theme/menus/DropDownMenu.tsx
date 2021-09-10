import React, { MutableRefObject } from "react";
import tw from "../../../styles/tailwind";
import { Pressable, View, Text, Dimensions, InteractionManager } from "react-native";
import { useThemeContext } from "../../../providers/ThemeProvider";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useFocusEffect } from "@react-navigation/native";

interface ToggleProps {
	opened: boolean;
	setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DropDownMenuProps {
	position?: "right" | "left";
	children?: React.ReactNode | Array<React.ReactNode>;
	toggle?: ({ opened, setOpened }: ToggleProps) => React.ReactNode;
}

export const DropDownMenu = ({ toggle, children, position = "right" }: DropDownMenuProps) => {
	const { theme } = useThemeContext();
	const viewRef = React.useRef<View>(null);
	const [opened, setOpened] = React.useState<boolean>(false);
	const [offset, setOffset] = React.useState<{ x: number; y: number }>();
	const dimensions = React.useRef(Dimensions.get("screen")).current;

	useFocusEffect(
		React.useCallback(() => {
			const task = InteractionManager.runAfterInteractions(() => {
				viewRef.current?.measureInWindow((x, y, width, height) => {
					setOffset({ x, y });
				});
			});

			return () => task.cancel();
		}, [])
	);

	return (
		<View ref={viewRef} style={tw.style(`flex flex-col shadow-2xl`)}>
			{opened && (
				<Pressable
					onPress={() => setOpened(false)}
					style={tw.style({
						width: dimensions.width,
						height: dimensions.height,
						top: -(offset?.y || 0),
						left: -(offset?.x || 0),
						position: "absolute",
					})}
				/>
			)}
			{toggle?.({ opened, setOpened })}
			{opened && (
				<View
					style={tw.style(
						{
							borderColor: theme.border,
							backgroundColor: theme.background.secondary,
							"right-0": position === "right",
							"left-0": position === "left",
						},
						theme.shape,
						`absolute top-1 w-32 flex flex-col border overflow-hidden`
					)}>
					{children}
				</View>
			)}
		</View>
	);
};

interface DropDownItemProps {
	text: string;
	icon: IconProp;
	onPress?: () => void;
	onLongPress?: () => void;
}

export const DropDownItem = ({ text, icon, onPress, onLongPress }: DropDownItemProps) => {
	const { theme } = useThemeContext();
	return (
		<Pressable
			style={({ pressed }) =>
				tw.style(
					{
						borderColor: theme.border,
						backgroundColor: pressed ? theme.background.primary : "transparent",
					},
					`flex-1 flex flex-row px-4 py-3 border-b overflow-hidden`
				)
			}
			onPress={onPress}
			onLongPress={onLongPress}>
			{icon && <FontAwesomeIcon icon={icon} size={18} color={theme.brand} />}
			<Text
				style={tw.style(
					{
						color: theme.text.primary,
						fontFamily: "Poppins_600SemiBold",
					},
					`flex-1 ml-4`
				)}>
				{text}
			</Text>
		</Pressable>
	);
};
