import React from "react";
import { View, Animated } from "react-native";
import { BottomSheet, BottomSheetCallbackProps } from "./BottomSheet";

interface ViewWithBottomSheetProps {
	bottomSheetCollapsedHeight: number;
	children?: React.ReactNode | React.ReactNodeArray;
	bottomSheetHeader: ({ sheetAnimations }: BottomSheetCallbackProps) => React.ReactNode;
	bottomSheetContent: ({ sheetAnimations }: BottomSheetCallbackProps) => React.ReactNode;
}

export const ViewWithBottomSheet = ({
	children,
	bottomSheetCollapsedHeight,
	bottomSheetHeader,
	bottomSheetContent,
}: ViewWithBottomSheetProps) => {
	const [height, setHeight] = React.useState(0);

	return (
		<View
			style={{ flex: 1 }}
			onLayout={(e) => {
				setHeight(e.nativeEvent.layout.height);
			}}>
			{children}
			{height > 0 && (
				<BottomSheet
					expandHeight={height}
					collapseHeight={bottomSheetCollapsedHeight}
					bottomSheetHeader={({ sheetAnimations }) => bottomSheetHeader({ sheetAnimations })}
					bottomSheetContent={({ sheetAnimations }) => bottomSheetContent({ sheetAnimations })}
				/>
			)}
		</View>
	);
};
