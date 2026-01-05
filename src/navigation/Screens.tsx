import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Home, Profile, EditProfile, MyCourses, CourseDetail, Notifications, Language, Appearance} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: t('navigation.home')}}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="MyCourses"
        component={MyCourses}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="CourseDetail"
        component={CourseDetail}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Language"
        component={Language}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Appearance"
        component={Appearance}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
