import tw from './styles/tailwind';
import React, { FC } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import FormulatorProvider, { useFormulatorContext } from './providers/FormulatorProvider';

const ChildComponent : FC = () => {

  const { formula, setFormula } = useFormulatorContext();
  
  return (
    <View style={tw`m-auto`}>
      {formula &&
        <Text style={tw`text-black`}>{formula.name}</Text>
      }
    </View>
  )
}

export default function App() {
  return (
    <View style={tw`h-full flex`}>
      <FormulatorProvider>
        <ChildComponent />
      </FormulatorProvider>
    </View>
  );
}