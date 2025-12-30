import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Dimensions, ScrollView, Modal as RNModal} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useTheme, useAuth} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Text, Checkbox} from '../components/';
import {registerUser} from '../services/auth';

const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');

interface IRegistration {
  name: string;
  email: string;
  phone: string;
  password: string;
  agreed: boolean;
}

interface IRegistrationValidation {
  name: boolean;
  email: boolean;
  phone: boolean;
  password: boolean;
  agreed: boolean;
}

const Signup = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    email: false,
    phone: false,
    password: false,
    agreed: false,
  });
  const [registration, setRegistration] = useState<IRegistration>({
    name: '',
    email: '',
    phone: '',
    password: '',
    agreed: false,
  });
  const {colors, gradients, sizes} = useTheme();

  const showModal = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  }, []);

  const handleChange = useCallback(
    (value: Partial<IRegistration>) => {
      setRegistration((state) => ({...state, ...value}));
    },
    [setRegistration],
  );

  const handleSignup = useCallback(async () => {
    if (!Object.values(isValid).includes(false)) {
      setLoading(true);
      try {
        await registerUser(registration.email, registration.password, registration.name, registration.phone);
        showModal('Success', 'Account created successfully!', 'success');
      } catch (error: any) {
        showModal('Registration Failed', error.message || 'Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      showModal('Invalid Form', 'Please check your inputs and agree to terms.', 'error');
    }
  }, [isValid, registration, showModal]);

  useEffect(() => {
    if (user) {
      navigation.navigate('Home' as never);
    }
  }, [user, navigation]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
      phone: regex.phone.test(registration.phone),
      password: regex.password.test(registration.password),
      agreed: registration.agreed,
    }));
  }, [registration, setIsValid]);

  const isSmallScreen = height < 700;

  return (
    <Block safe flex={1}>
      <Block flex={1} gradient={gradients.primary}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: sizes.padding,
            paddingTop: isSmallScreen ? height * 0.08 : height * 0.1,
            paddingBottom: sizes.padding,
          }}>
          
          {/* Header section */}
          <Block flex={0} align="center" marginBottom={sizes.l}>
            <Text h1 center white bold style={{
              fontSize: isSmallScreen ? 26 : 30,
              marginBottom: 8
            }}>
              Join Intellact
            </Text>
            <Text h5 center white semibold style={{
              opacity: 0.9,
              fontSize: isSmallScreen ? 15 : 17,
            }}>
              Create your account to start learning
            </Text>
          </Block>

          {/* Signup form */}
          <Block flex={1}>
            <Block
              color={colors.card}
              radius={20}
              padding={sizes.padding}
              shadow={!isAndroid}
              style={{
                elevation: 12,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 6},
                shadowOpacity: 0.15,
                shadowRadius: 12,
              }}>
              
              <Text h4 semibold marginBottom={sizes.l} style={{
                textAlign: 'center',
                color: colors.text
              }}>
                Create Account
              </Text>
              
              <Input
                autoCapitalize="words"
                marginBottom={sizes.m}
                label="Full Name"
                placeholder="Enter your full name"
                success={Boolean(registration.name && isValid.name)}
                danger={Boolean(registration.name && !isValid.name)}
                onChangeText={(value) => handleChange({name: value})}
              />

              <Input
                autoComplete="tel"
                marginBottom={sizes.m}
                label="Phone Number"
                keyboardType="phone-pad"
                placeholder="Enter your phone number"
                success={Boolean(registration.phone && isValid.phone)}
                danger={Boolean(registration.phone && !isValid.phone)}
                onChangeText={(value) => handleChange({phone: value})}
              />
              
              <Input
                autoComplete="email"
                autoCapitalize="none"
                marginBottom={sizes.m}
                label="Email Address"
                keyboardType="email-address"
                placeholder="Enter your email"
                success={Boolean(registration.email && isValid.email)}
                danger={Boolean(registration.email && !isValid.email)}
                onChangeText={(value) => handleChange({email: value})}
              />
              
              <Input
                secureTextEntry
                autoComplete="password"
                marginBottom={sizes.m}
                label="Password"
                placeholder="Create a strong password"
                onChangeText={(value) => handleChange({password: value})}
                success={Boolean(registration.password && isValid.password)}
                danger={Boolean(registration.password && !isValid.password)}
              />
              
              <Block row flex={0} align="center" marginBottom={sizes.l}>
                <Checkbox
                  marginRight={sizes.sm}
                  checked={registration?.agreed}
                  onPress={(value) => handleChange({agreed: value})}
                />
                <Text style={{flex: 1, color: colors.text}}>
                  I agree to the{' '}
                  <Text
                    semibold
                    primary
                    onPress={() => {
                      showModal('Terms & Conditions', 'Terms and conditions content coming soon.', 'info');
                    }}>
                    Terms & Conditions
                  </Text>
                  {' '}and{' '}
                  <Text
                    semibold
                    primary
                    onPress={() => {
                      showModal('Privacy Policy', 'Privacy policy content coming soon.', 'info');
                    }}>
                    Privacy Policy
                  </Text>
                </Text>
              </Block>
              
              <Button
                onPress={handleSignup}
                disabled={loading}
                marginBottom={sizes.s}
                gradient={gradients.primary}
                shadow={!isAndroid}
                style={{
                  minHeight: isSmallScreen ? 48 : 52,
                }}>
                <Text bold white transform="uppercase" style={{
                  fontSize: isSmallScreen ? 15 : 16,
                  letterSpacing: 0.8
                }}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </Button>
              
              <Button
                white
                onPress={() => navigation.navigate('Login' as never)}
                style={{
                  minHeight: isSmallScreen ? 48 : 52,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  backgroundColor: colors.white,
                  borderRadius: 8,
                }}>
                <Text bold style={{
                  fontSize: isSmallScreen ? 15 : 16,
                  letterSpacing: 0.8,
                  color: colors.primary
                }} transform="uppercase">
                  Already Have Account
                </Text>
              </Button>
            </Block>
          </Block>

          {/* Footer */}
          <Block flex={0} align="center" marginTop={sizes.l}>
            <Text center style={{
              opacity: 0.7,
              fontSize: 12,
              color: colors.white
            }}>
              Join thousands of learners worldwide
            </Text>
          </Block>
        </ScrollView>
      </Block>
      
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

export default Signup;
