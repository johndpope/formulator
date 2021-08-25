import React from "react";
import tw from "../../styles/tailwind";
import { Pressable, View, Text } from "react-native";
import { FormulaAction } from "../../types/FormulatorTypes";

interface CalculatorProps {
	dispatch: React.Dispatch<FormulaAction>;
}

export default function Calculator({ dispatch }: CalculatorProps) {
	return (
		<View style={tw`flex flex-row justify-center flex-wrap p-5`}>
			<Pressable
				onPress={() =>
					dispatch?.({
						type: "INSERT_CONSTANT",
						payload: { constantType: "EQ_NUMBER", constantValue: "1" },
					})
				}
				style={tw`w-10 h-10 bg-gray-200 flex items-center justify-center`}>
				<Text>1</Text>
			</Pressable>
			<Pressable
				onPress={() =>
					dispatch?.({
						type: "INSERT_CONSTANT",
						payload: { constantType: "EQ_OPERATION", constantValue: "*" },
					})
				}
				style={tw`w-10 h-10 bg-gray-200 flex items-center justify-center`}>
				<Text>*</Text>
			</Pressable>
			<Pressable
				onPress={() =>
					dispatch?.({
						type: "INSERT_CONSTANT",
						payload: { constantType: "EQ_NUMBER", constantValue: "2" },
					})
				}
				style={tw`w-10 h-10 bg-gray-200 flex items-center justify-center`}>
				<Text>2</Text>
			</Pressable>
			<View style={tw`p-5 w-full`}>
				<Pressable
					onPress={() =>
						dispatch?.({
							type: "CREATE_VARIABLE",
							payload: {
								name: "total",
								color: "yellow",
								equation: "50",
								result: "50",
								openBrackets: 0,
								lastConstantType: "EQ_NUMBER",
							},
						})
					}
					style={tw`p-5 bg-gray-200 flex items-center justify-center`}>
					<Text>New Variable</Text>
				</Pressable>
				<Pressable
					onPress={() =>
						dispatch?.({
							type: "UPDATE_VARIABLE",
							payload: {
								name: "total",
								color: "green",
								equation: "100",
								result: "100",
								openBrackets: 0,
								lastConstantType: "EQ_NUMBER",
							},
						})
					}
					style={tw`p-5 bg-gray-200 flex items-center justify-center`}>
					<Text>Updated Variable</Text>
				</Pressable>
				<Pressable
					onPress={() =>
						dispatch?.({
							type: "DELETE_VARIABLE",
							payload: {
								name: "total",
								color: "green",
								equation: "100",
								result: "100",
								openBrackets: 0,
								lastConstantType: "EQ_NUMBER",
							},
						})
					}
					style={tw`p-5 bg-gray-200 flex items-center justify-center`}>
					<Text>Delete Variable</Text>
				</Pressable>
			</View>
		</View>
	);
}
