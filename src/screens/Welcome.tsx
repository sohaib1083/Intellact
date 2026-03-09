import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StatusBar,
  Platform,
  Dimensions,
  View,
  Text as RNText,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../hooks';
import { Block, Button, Text } from '../components';

const { height, width } = Dimensions.get('window');

// Responsive breakpoints
const isCompact = height < 700;
const isStandard = height >= 700 && height < 850;
const isLarge = height >= 850;

export default function Welcome() {
  const navigation = useNavigation();
  const { colors, sizes } = useTheme();

  // Staggered animations
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const descFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        damping: 12,
        stiffness: 100,
        useNativeDriver: true,
      }),
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Title entrance (staggered)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(titleSlide, { toValue: 0, damping: 15, stiffness: 120, useNativeDriver: true }),
      ]).start();
    }, 200);

    // Subtitle
    setTimeout(() => {
      Animated.timing(subtitleFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, 400);

    // Description
    setTimeout(() => {
      Animated.timing(descFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, 550);

    // Buttons
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(buttonFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(buttonSlide, { toValue: 0, damping: 15, stiffness: 100, useNativeDriver: true }),
      ]).start();
    }, 650);
  }, []);

  const logoSize = isLarge ? 100 : isStandard ? 88 : 76;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#6D28D9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Decorative circles */}
        <View style={{
          position: 'absolute', top: -height * 0.12, right: -width * 0.2,
          width: width * 0.7, height: width * 0.7, borderRadius: width * 0.35,
          backgroundColor: 'rgba(255,255,255,0.06)',
        }} />
        <View style={{
          position: 'absolute', bottom: -height * 0.08, left: -width * 0.15,
          width: width * 0.5, height: width * 0.5, borderRadius: width * 0.25,
          backgroundColor: 'rgba(255,255,255,0.04)',
        }} />
        <View style={{
          position: 'absolute', top: height * 0.35, left: -width * 0.1,
          width: width * 0.3, height: width * 0.3, borderRadius: width * 0.15,
          backgroundColor: 'rgba(255,255,255,0.03)',
        }} />

        <View style={{
          flex: 1,
          paddingHorizontal: isCompact ? 24 : 32,
          paddingTop: isLarge ? height * 0.12 : isStandard ? height * 0.1 : height * 0.08,
          paddingBottom: isCompact ? 24 : 36,
        }}>
          {/* Logo */}
          <Animated.View style={{
            alignItems: 'center',
            marginBottom: isLarge ? 40 : isStandard ? 32 : 24,
            opacity: logoFade,
            transform: [{ scale: logoScale }],
          }}>
            <View style={{
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize * 0.3,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.2)',
            }}>
              <Video
                source={require('../assets/icons/presentation.mp4')}
                style={{ width: logoSize, height: logoSize }}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted
              />
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.View style={{
            alignItems: 'center',
            marginBottom: isLarge ? 16 : 12,
            opacity: titleFade,
            transform: [{ translateY: titleSlide }],
          }}>
            <RNText style={{
              fontSize: isLarge ? 48 : isStandard ? 42 : 36,
              color: '#FFFFFF',
              fontWeight: '800',
              letterSpacing: -0.5,
              textAlign: 'center',
            }}>
              Intellact
            </RNText>
          </Animated.View>

          {/* Subtitle chip */}
          <Animated.View style={{
            alignItems: 'center',
            marginBottom: isLarge ? 28 : 20,
            opacity: subtitleFade,
          }}>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
            }}>
              <RNText style={{
                fontSize: isLarge ? 15 : 14,
                color: '#FFFFFF',
                fontWeight: '600',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
                Smart Learning Platform
              </RNText>
            </View>
          </Animated.View>

          {/* Description */}
          <Animated.View style={{ alignItems: 'center', opacity: descFade }}>
            <RNText style={{
              fontSize: isLarge ? 17 : 16,
              lineHeight: isLarge ? 26 : 24,
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
              maxWidth: 300,
              fontWeight: '400',
            }}>
              Transform your career with cutting-edge courses and expert guidance from industry leaders.
            </RNText>
          </Animated.View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Feature pills */}
          <Animated.View style={{
            opacity: descFade,
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: isLarge ? 36 : 28,
          }}>
            {['Expert Instructors', 'Self-Paced', 'Certificates'].map((feature, i) => (
              <View key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.15)',
              }}>
                <RNText style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
                  {feature}
                </RNText>
              </View>
            ))}
          </Animated.View>

          {/* CTA Buttons */}
          <Animated.View style={{
            opacity: buttonFade,
            transform: [{ translateY: buttonSlide }],
          }}>
            {/* Primary CTA */}
            <Button
              color={colors.white}
              onPress={() => navigation.navigate('Signup' as never)}
              marginBottom={isCompact ? 10 : 14}
              style={{
                height: isCompact ? 52 : 58,
                borderRadius: 16,
                shadowColor: '#000',
                shadowOpacity: 0.25,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 6 },
                elevation: 10,
              }}
            >
              <RNText style={{
                color: '#4F46E5',
                fontSize: 16,
                letterSpacing: 0.5,
                fontWeight: '700',
              }}>
                Get Started Free
              </RNText>
            </Button>

            {/* Secondary CTA */}
            <Button
              outlined
              onPress={() => navigation.navigate('Login' as never)}
              style={{
                height: isCompact ? 52 : 58,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.4)',
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <RNText style={{
                color: '#FFFFFF',
                fontSize: 16,
                letterSpacing: 0.5,
                fontWeight: '600',
              }}>
                I Have an Account
              </RNText>
            </Button>

            {/* Footer */}
            <View style={{ alignItems: 'center', marginTop: isCompact ? 14 : 20 }}>
              <RNText style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.5)',
                fontWeight: '400',
              }}>
                Trusted by thousands of learners
              </RNText>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}
