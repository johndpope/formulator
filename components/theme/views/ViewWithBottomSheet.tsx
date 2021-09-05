import React from "react";
import { View, Animated, ViewStyle, StyleProp } from "react-native";

type bottomSheetContentCallbackType = {
	scrolling?: Animated.Value;
	sheetAnimations?: {
		fadeIn?: Animated.AnimatedInterpolation;
		fadeOut?: Animated.AnimatedInterpolation;
		translateIn?: Animated.AnimatedInterpolation;
		translateOut?: Animated.AnimatedInterpolation;
	};
};

interface ViewWithBottomSheetProps {
	collapsedHeight: number;
	children?: React.ReactNode | React.ReactNodeArray;
	style: StyleProp<ViewStyle>;
	bottomSheet: ({ scrolling, sheetAnimations }: bottomSheetContentCallbackType) => React.ReactNode;
}

export function ViewWithBottomSheet({
	collapsedHeight,
	bottomSheet,
	children,
	style,
}: ViewWithBottomSheetProps) {
	const scrolling = React.useRef(new Animated.Value(0)).current;
	const [expandedHeight, setExpandedHeight] = React.useState<number>();

	const sheetAnimations = {
		fadeIn: scrolling.interpolate({ inputRange: [0, 300], outputRange: [0, 1], extrapolate: "clamp" }),
		fadeOut: scrolling.interpolate({ inputRange: [0, 300], outputRange: [1, 0], extrapolate: "clamp" }),
		translateOut: scrolling.interpolate({
			inputRange: [0, 300],
			outputRange: [100, 0],
			extrapolate: "clamp",
		}),
		translateIn: scrolling.interpolate({
			inputRange: [0, 300],
			outputRange: [0, -100],
			extrapolate: "clamp",
		}),
	};

	return (
		<View
			style={style}
			onLayout={(event) => {
				setExpandedHeight(event.nativeEvent.layout.height);
			}}>
			{expandedHeight && (
				<View style={[{ height: expandedHeight }]}>
					<Animated.FlatList
						bounces={false}
						nestedScrollEnabled
						decelerationRate={"fast"}
						scrollEventThrottle={200}
						stickyHeaderIndices={[0]}
						disableIntervalMomentum={true}
						showsVerticalScrollIndicator={false}
						snapToInterval={expandedHeight - collapsedHeight}
						onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrolling } } }], {
							useNativeDriver: true,
						})}
						CellRendererComponent={({ style, ...props }) => (
							<View style={[style, { zIndex: 100 }]} {...props} />
						)}
						data={[
							<View style={{ height: expandedHeight - collapsedHeight }}>{children}</View>,
							<View style={{ height: expandedHeight }}>
								{bottomSheet({ scrolling, sheetAnimations })}
							</View>,
						]}
						keyExtractor={(item, index) => `bottom-sheet-item-${index}`}
						renderItem={({ item, index }) => item}
					/>
				</View>
			)}
		</View>
	);
}
