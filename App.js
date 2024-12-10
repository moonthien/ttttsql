import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserScreen from './screens/UserScreen';
import ViewUserScreen from './screens/ViewUserScreen';
import LoginScreen from './screens/LoginScreen';
import Screen01 from './screens/Screen01';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="UserScreen" component={UserScreen} options={{ title: 'User List' }} />
        <Stack.Screen name="ViewUserScreen" component={ViewUserScreen} options={{ title: 'User Details' }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Screen01" component={Screen01} options={{ title: 'Screen01' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
