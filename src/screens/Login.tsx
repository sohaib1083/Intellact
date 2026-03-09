import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Dimensions, ScrollView, Modal as RNModal, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import {useTheme, useAuth} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Text} from '../components/';
import {loginUser} from '../services/auth';

const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');

interface ILogin {
  email: string;
  password: string;
}

interface ILoginValidation {
  email: boolean;
  password: boolean;
}

const Login = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');
  const [isValid, setIsValid] = useState<ILoginValidation>({
    email: false,
    password: false,
  });
  const [login, setLogin] = useState<ILogin>({
    email: '',
    password: '',
  });
  const {colors, gradients, sizes} = useTheme();

  const showModal = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  }, []);

  const handleChange = useCallback(
    (value: Partial<ILogin>) => {
      setLogin((state) => ({...state, ...value}));
    },
    [setLogin],
  );

  const handleLogin = useCallback(async () => {
    if (!Object.values(isValid).includes(false)) {
      setLoading(true);
      try {
        await loginUser(login.email, login.password);
        showModal('Success', 'Welcome back!', 'success');
      } catch (error: any) {
        showModal('Login Failed', error.message || 'Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      showModal('Invalid Form', 'Please check your email and password.', 'error');
    }
  }, [isValid, login, showModal]);

  useEffect(() => {
    if (user) {
      navigation.navigate('Home' as never);
    }
  }, [user, navigation]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      email: regex.email.test(login.email),
      password: regex.password.test(login.password),
    }));
  }, [login, setIsValid]);

  const isSmallScreen = height < 700;

  return (
    <Block safe flex={1}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#6D28D9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Decorative circles */}
        <View style={{
          position: 'absolute', top: -height * 0.08, right: -width * 0.15,
          width: width * 0.5, height: width * 0.5, borderRadius: width * 0.25,
          backgroundColor: 'rgba(255,255,255,0.05)',
        }} />
        <View style={{
          position: 'absolute', bottom: height * 0.1, left: -width * 0.1,
          width: width * 0.35, height: width * 0.35, borderRadius: width * 0.175,
          backgroundColor: 'rgba(255,255,255,0.03)',
        }} />
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: sizes.padding,
            paddingTop: isSmallScreen ? height * 0.1 : height * 0.13,
            paddingBottom: sizes.padding,
          }}>
          
          {/* Header section */}
          <Animated.View entering={FadeInDown.duration(600)}>
            <Block flex={0} align="center" marginBottom={sizes.xl}>
              <Text h1 center white bold style={{
                fontSize: isSmallScreen ? 28 : 34,
                marginBottom: 8,
                letterSpacing: -0.5,
              }}>
                Welcome Back
              </Text>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 16,
              }}>
                <Text center white semibold style={{
                  fontSize: isSmallScreen ? 14 : 15,
                }}>
                  Sign in to continue learning
                </Text>
              </View>
            </Block>
          </Animated.View>

          {/* Login form */}
          <Animated.View entering={FadeInUp.delay(200).duration(600).springify()}>
            <Block flex={1} justify="center">
              <Block
                color={colors.card}
                radius={24}
                padding={sizes.padding}
                shadow={!isAndroid}
                style={{
                  elevation: 16,
                  shadowColor: 'rgba(0,0,0,0.3)',
                  shadowOffset: {width: 0, height: 8},
                  shadowOpacity: 0.2,
                  shadowRadius: 24,
                  borderWidth: 1,
                  borderColor: 'rgba(79,70,229,0.08)',
                }}>
                
                <Text h4 semibold marginBottom={sizes.s} style={{
                  textAlign: 'center',
                  color: colors.text
                }}>
                  Sign In
                </Text>
                
                <Input
                  autoComplete="email"
                  autoCapitalize="none"
                  marginBottom={sizes.l}
                  label="Email Address"
                  keyboardType="email-address"
                  placeholder="Enter your email"
                  success={Boolean(login.email && isValid.email)}
                  danger={Boolean(login.email && !isValid.email)}
                  onChangeText={(value) => handleChange({email: value})}
                />
                
                <Input
                  secureTextEntry
                  autoComplete="password"
                  marginBottom={sizes.xl}
                  label="Password"
                  placeholder="Enter your password"
                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(login.password && isValid.password)}
                  danger={Boolean(login.password && !isValid.password)}
                />
                
                <Button
                  onPress={handleLogin}
                  disabled={loading}
                  marginBottom={sizes.s}
                  gradient={gradients.primary}
                  shadow={!isAndroid}
                  style={{
                    minHeight: isSmallScreen ? 50 : 54,
                  }}>
                  <Text bold white transform="uppercase" style={{
                    fontSize: isSmallScreen ? 15 : 16,
                    letterSpacing: 0.8
                  }}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </Button>
                
                <Button
                  white
                  onPress={() => navigation.navigate('Signup' as never)}
                style={{
                  // minHeight: isSmallScreen ? 50 : 54,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  backgroundColor: colors.white,
                  // borderRadius: 8,
                }}>
                <Text bold style={{
                  fontSize: isSmallScreen ? 15 : 16,
                  letterSpacing: 0.8,
                  color: colors.primary
                }} transform="uppercase">
                  Create New Account
                </Text>
              </Button>
            </Block>
          </Block>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeInUp.delay(400).duration(500)}>
            <Block flex={0} align="center" marginTop={sizes.l}>
              <Text center style={{
                opacity: 0.7,
                fontSize: 12,
                color: colors.white
              }}>
                Secure login powered by Firebase
              </Text>
            </Block>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
      
      {/* Full-screen modal overlay */}
      <RNModal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Block
          flex={1}
          justify="center"
          align="center"
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          paddingHorizontal={sizes.padding}>
          <Block 
            flex={0}
            radius={sizes.cardRadius}
            color={colors.card}
            padding={sizes.padding}
            shadow={!isAndroid}
            style={{
              width: '100%',
              maxWidth: 400,
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 10},
              shadowOpacity: 0.3,
              shadowRadius: 20,
            }}>
            <Text h4 semibold marginBottom={sizes.sm} center style={{
              color: modalType === 'success' ? colors.success : modalType === 'error' ? colors.danger : colors.text
            }}>
              {modalTitle}
            </Text>
            <Text p marginBottom={sizes.l} center style={{
              color: colors.text,
              lineHeight: 22,
            }}>
              {modalMessage}
            </Text>
            <Button
              gradient={gradients.primary}
              onPress={() => setModalVisible(false)}>
              <Text bold white transform="uppercase">
                OK
              </Text>
            </Button>
          </Block>
        </Block>
      </RNModal>
    </Block>
  );
};

export default Login;
