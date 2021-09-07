import React from "react";
import {
	View,
	AppState,
	Animated,
	PanResponder,
	GestureResponderEvent,
	PanResponderGestureState,
} from "react-native";

export interface SheetAnimationsMap {
	fadeIn: Animated.AnimatedInterpolation;
	fadeOut: Animated.AnimatedInterpolation;
	translateIn: Animated.AnimatedInterpolation;
	translateOut: Animated.AnimatedInterpolation;
}

export interface BottomSheetCallbackProps {
	sheetAnimations: SheetAnimationsMap;
}

interface BottomSheetProps {
	expandHeight: number;
	collapsedHeight: number;
	children: ({ sheetAnimations }: BottomSheetCallbackProps) => React.ReactNode | React.ReactNodeArray;
}

export const BottomSheet = ({ collapsedHeight, expandHeight = 1, children }: BottomSheetProps) => {
	const panY = React.useRef<any>(new Animated.Value(0)).current;
	const _close = Animated.timing(panY, { toValue: 0, duration: 100, useNativeDriver: false });
	const _open = Animated.timing(panY, {
		toValue: -expandHeight + collapsedHeight,
		duration: collapsedHeight,
		useNativeDriver: false,
	});

	const panTranslate = panY.interpolate({
		inputRange: [-expandHeight + collapsedHeight, 0],
		outputRange: [-expandHeight + collapsedHeight, 0],
		extrapolate: "clamp",
	});

	const fadeIn = panY.interpolate({
		inputRange: [-expandHeight + collapsedHeight, 0],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});

	const fadeOut = panY.interpolate({
		inputRange: [-expandHeight + collapsedHeight, 0],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	const translateIn = panY.interpolate({
		inputRange: [-expandHeight + collapsedHeight, 0],
		outputRange: [0, 100],
		extrapolate: "clamp",
	});

	const translateOut = panY.interpolate({
		inputRange: [-expandHeight + collapsedHeight, 0],
		outputRange: [100, 0],
		extrapolate: "clamp",
	});

	const handlePanRelease = (e: GestureResponderEvent, gst: PanResponderGestureState) => {
		panY.flattenOffset();
		if (panY._value < -expandHeight / 2) {
			if (gst.vy > 1) return _close.start();
			return _open.start();
		}

		if (panY._value >= -expandHeight / 2) {
			if (gst.vy < -1) return _open.start();
			return _close.start();
		}
	};

	const handleAppStateChange = () => {
		_close.start();
	};

	const panResponder = React.useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (e, gst) => {
				console.log(gst.dy < -20 || gst.dy > 20);
				return gst.dy < -20 || gst.dy > 20;
			},
			onStartShouldSetPanResponder: () => true,
			onPanResponderGrant: (e, gst) => panY.extractOffset(),
			onPanResponderRelease: (e, gst) => handlePanRelease(e, gst),
			onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
		})
	).current;

	React.useEffect(() => {
		AppState.addEventListener("change", handleAppStateChange);
		return () => AppState.removeEventListener("change", handleAppStateChange);
	}, []);

	return (
		<Animated.View
			{...panResponder.panHandlers}
			style={{
				height: collapsedHeight,
				transform: [{ translateY: panTranslate }],
			}}>
			<View
				style={{
					height: expandHeight,
					width: "100%",
					display: "flex",
					position: "absolute",
					flexDirection: "column",
				}}>
				{children({ sheetAnimations: { fadeIn, fadeOut, translateIn, translateOut } })}
			</View>
		</Animated.View>
	);
};
