import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Welcome, Login, Signup} from '../screens';
import {useScreenOptions} from '../hooks';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator 
      screenOptions={screenOptions.stack}
      initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;