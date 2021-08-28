import React from "react";
import tw from "../../styles/tailwind";
import { View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface ResultProps {
	data: string | null;
	color?: string;
}

export default function Result({ data, color }: ResultProps) {
	return (
		<View style={tw`flex flex-row h-12 w-full items-center justify-between px-5`}>
			{data != null && (
				<>
					<FontAwesomeIcon
						icon={["fal", "equals"]}
						size={20}
						style={tw`${color ? `text-${color}-500` : "text-white"}`}
					/>
					<Text style={tw`${color ? `text-${color}-500` : "text-white"} text-xl ml-auto`}>{data}</Text>
				</>
			)}
		</View>
	);
}
