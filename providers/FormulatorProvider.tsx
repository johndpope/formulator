import React from 'react'
import tw from '../styles/tailwind'
import { View, Text } from 'react-native'

interface Variable {
   [key: string] : {
      [key: string] : string
   }
}

interface Formula {
   name: string,
   equation: string,
   result: string|null,
   openBrackets: number
   lastConstantType: string,
   variables: Array<Variable>
}

interface FormulatorProviderProps {
   data?: Formula
   children: React.ReactNode|Array<React.ReactNode>
}

interface FormulatorContextProps {
   formula: Formula,
   setFormula: React.Dispatch<React.SetStateAction<Formula>>
}

const FormulatorContext = React.createContext<Partial<FormulatorContextProps>>({});
export const useFormulatorContext = () => React.useContext(FormulatorContext);

export default function FormulatorProvider({data, children} : FormulatorProviderProps) {

   const [formula, setFormula] = React.useState<Formula>({
      name: 'New Formula',
      equation: '',
      result: null,
      openBrackets: 0,
      lastConstantType: '',
      variables: []
   });

   return (
      <FormulatorContext.Provider value={{formula, setFormula}}>
         {children}
      </FormulatorContext.Provider>
   )
}
