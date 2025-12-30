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

import { useTheme } from '../hooks';
import { Block, Button, Text } from '../components';

const { height, width } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';

// Optimized screen breakpoints for 430x930
const isCompact = height < 700;
const isStandard = height >= 700 && height < 850;
const isLarge = height >= 850;

export default function Welcome() {
  const navigation = useNavigation();
  const { gradients, colors, sizes } = useTheme();

  // Premium animations
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 15,
        stiffness: 130,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Optimized for 430x930 - Perfect sizing
  const logoSize = isLarge ? 90 : isStandard ? 80 : 70;
  
  // Perfect spacing alignment
  const topSpacing = isLarge ? sizes.l : isStandard ? sizes.m : sizes.sm;
  const logoMarginBottom = isLarge ? sizes.xl : isStandard ? sizes.l : sizes.m;
  const titleMarginBottom = isLarge ? sizes.l : isStandard ? sizes.m : sizes.sm;
  const descMarginBottom = isLarge ? sizes.m : sizes.sm;

  return (
    <Block safe flex={1}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Block flex={1} gradient={gradients.primary}>
        <Block
          flex={1}
          paddingHorizontal={sizes.padding}
          paddingTop={topSpacing}
          paddingBottom={sizes.padding}
        >

          {/* LOGO - Perfectly Centered */}
          <Block align="center" marginTop={0} marginBottom={logoMarginBottom}>
            <Animated.View style={{ transform: [{ scale }] }}>
              <View
                style={{
                  width: logoSize,
                  height: logoSize,
                  borderRadius: logoSize / 2,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 8,
                  margin: 100
                }}
              >
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
          </Block>

          {/* HERO CONTENT - Always Visible */}
          <Block>
            {/* Title Section */}
            <Block align="center" marginBottom={titleMarginBottom}>
              <RNText
                style={{
                  fontSize: isLarge ? 44 : isStandard ? 40 : 34,
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  letterSpacing: 1.2,
                  marginBottom: sizes.xs,
                  textAlign: 'center',
                  textShadowColor: 'rgba(0, 0, 0, 0.25)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}
              >
                Intellact
              </RNText>

              <RNText
                style={{
                  fontSize: isLarge ? 18 : isStandard ? 17 : 16,
                  color: '#FFFFFF',
                  opacity: 0.9,
                  fontWeight: '500',
                  letterSpacing: 0.4,
                  textAlign: 'center',
                }}
              >
                Smart Learning Platform
              </RNText>
            </Block>

            {/* Description Section */}
            <Block align="center" marginBottom={descMarginBottom}>
              <RNText
                style={{
                  fontSize: isLarge ? 15.5 : 15,
                  lineHeight: 22,
                  color: '#FFFFFF',
                  opacity: 0.88,
                  width: Math.min(width - 80, 320),
                  letterSpacing: 0.3,
                  textAlign: 'center',
                }}
              >
                Transform your career with cutting-edge courses and expert guidance.
              </RNText>
            </Block>
          </Block>

          {/* Flexible Spacer - Pushes buttons to bottom */}
          <Block flex={1} style={{ minHeight: sizes.sm }} />

          {/* CTA BUTTONS - Professional Design */}
          <Block marginBottom={sizes.sm}>
            <Button
              color={colors.white}
              onPress={() => navigation.navigate('Signup' as never)}
              marginBottom={sizes.sm}
              style={{
                height: 56,
                borderRadius: 16,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 8,
              }}
            >
              <Text
                bold
                style={{
                  color: colors.primary,
                  fontSize: 15.5,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  fontWeight: '700',
                }}
              >
                Start Learning Free
              </Text>
            </Button>

            <Button
              outlined
              onPress={() => navigation.navigate('Login' as never)}
              style={{
                height: 56,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: colors.white,
                backgroundColor: 'rgba(255,255,255,0.13)',
              }}
            >
              <Text
                white
                bold
                style={{
                  fontSize: 15.5,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  fontWeight: '700',
                }}
              >
                Sign In
              </Text>
            </Button>
          </Block>

        </Block>
      </Block>
    </Block>
  );
}
