import tw from './styles/tailwind';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={tw`h-full flex`}>
      <Text style={tw`m-auto`}>Hey</Text>
    </View>
  );
}