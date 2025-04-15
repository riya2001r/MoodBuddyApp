import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarScreen from './src/screens/CalendarScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calendar">
        <Stack.Screen name="Calendar" component={CalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
