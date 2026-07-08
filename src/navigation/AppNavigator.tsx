import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoadingRoute} from '../screens/LoadingRoute';
import {HomeRoute} from '../screens/HomeRoute';
import {Microapp1Route} from '../screens/Microapp1Route';
import {Microapp2Route} from '../screens/Microapp2Route';
import {Microapp3Route} from '../screens/Microapp3Route';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen
          name="Loading"
          component={LoadingRoute}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Home" component={HomeRoute} options={{headerShown: false}} />
        <Stack.Screen name="Microapp1" component={Microapp1Route} options={{title: ''}} />
        <Stack.Screen name="Microapp2" component={Microapp2Route} options={{title: ''}} />
        <Stack.Screen name="Microapp3" component={Microapp3Route} options={{title: ''}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
