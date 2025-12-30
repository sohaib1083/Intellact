import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import Menu from './Menu';
import AuthNavigator from './AuthNavigator';
import {useAuth, useTheme} from '../hooks';
import {Text} from '../components';

const AuthAwareNavigator = () => {
  const {user, loading} = useAuth();
  const {colors, sizes} = useTheme();

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.background
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text p marginTop={sizes.m} color={colors.text}>
          Loading...
        </Text>
      </View>
    );
  }

  // If user is authenticated, show main app with drawer navigation
  if (user) {
    return <Menu />;
  }

  // If user is not authenticated, show auth screens
  return <AuthNavigator />;
};

export default AuthAwareNavigator;