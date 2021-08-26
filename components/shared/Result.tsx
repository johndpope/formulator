import React from "react";
import tw from "../../styles/tailwind";
import { View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface ResultProps {
	data: string | null;
}

export default function Result({ data }: ResultProps) {
	return (
		<View style={tw`flex flex-row h-10 w-full items-center justify-between px-5`}>
			{data != null && (
				<>
					<FontAwesomeIcon icon={["fal", "equals"]} size={16} />
					<Text>{data}</Text>
				</>
			)}
		</View>
	);
}
