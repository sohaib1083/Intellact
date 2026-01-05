import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text as RNText,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Block } from '../components/';
import { useTheme } from '../hooks/';

const { height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isVerySmallScreen = height < 600;

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  preview: {
    bg: string;
    card: string;
    text: string;
    accent: string;
  };
}

const themes: ThemeOption[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright interface',
    icon: 'L',
    preview: {
      bg: '#F8F9FA',
      card: '#FFFFFF',
      text: '#252F40',
      accent: '#2D3561',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes at night',
    icon: 'D',
    preview: {
      bg: '#1A1A2E',
      card: '#252542',
      text: '#FFFFFF',
      accent: '#6C63FF',
    },
  },
  {
    id: 'system',
    name: 'System',
    description: 'Match your device settings',
    icon: 'S',
    preview: {
      bg: 'linear-gradient',
      card: '#FFFFFF',
      text: '#252F40',
      accent: '#2D3561',
    },
  },
];

const Appearance = () => {
  const navigation = useNavigation();
  const { colors, sizes } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium'); // small, medium, large

  // Responsive sizing
  const horizontalPadding = isVerySmallScreen ? sizes.sm : isSmallScreen ? sizes.m : sizes.padding;
  const titleSize = isVerySmallScreen ? 16 : 18;
  const sectionTitleSize = isVerySmallScreen ? 13 : 14;
  const itemTitleSize = isVerySmallScreen ? 14 : 15;
  const descSize = isVerySmallScreen ? 11 : 12;
  const previewSize = isVerySmallScreen ? 60 : 70;

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    // In a real app, this would update the app's theme
  };

  return (
    <Block flex={1} color={colors.light}>
      {/* Header */}
      <Block
        row
        align="center"
        justify="space-between"
        paddingHorizontal={horizontalPadding}
        color={colors.white}
        style={{
          paddingTop: insets.top + (isVerySmallScreen ? sizes.xs : sizes.s),
          paddingBottom: isVerySmallScreen ? sizes.s : sizes.sm,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <RNText
            style={{
              fontSize: titleSize,
              color: colors.primary,
              fontWeight: '600',
            }}
          >
            ← Back
          </RNText>
        </TouchableOpacity>
        <RNText
          style={{
            fontSize: titleSize,
            fontWeight: '700',
            color: colors.text,
          }}
        >
          Appearance
        </RNText>
        <Block style={{ width: 60 }} />
      </Block>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: sizes.m,
          paddingBottom: sizes.xxl,
        }}
      >
        {/* Theme Selection */}
        <Block marginBottom={sizes.l}>
          <RNText
            style={{
              fontSize: sectionTitleSize,
              fontWeight: '700',
              color: colors.primary,
              marginBottom: sizes.s,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Theme
          </RNText>
          <Block
            row
            style={{
              flexWrap: 'wrap',
              marginHorizontal: -sizes.xs,
            }}
          >
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                activeOpacity={0.8}
                onPress={() => handleSelectTheme(theme.id)}
                style={{
                  width: '33.33%',
                  paddingHorizontal: sizes.xs,
                  marginBottom: sizes.s,
                }}
              >
                <Block
                  color={colors.white}
                  radius={16}
                  padding={isVerySmallScreen ? sizes.xs : sizes.s}
                  align="center"
                  style={{
                    borderWidth: 2,
                    borderColor:
                      selectedTheme === theme.id
                        ? colors.primary
                        : colors.light,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: selectedTheme === theme.id ? 0.15 : 0.05,
                    shadowRadius: 8,
                    elevation: selectedTheme === theme.id ? 4 : 2,
                  }}
                >
                  {/* Preview Box */}
                  <Block
                    style={{
                      width: previewSize,
                      height: previewSize,
                      borderRadius: 12,
                      backgroundColor:
                        theme.id === 'system'
                          ? colors.light
                          : theme.preview.bg,
                      overflow: 'hidden',
                      marginBottom: sizes.xs,
                    }}
                  >
                    {theme.id === 'system' ? (
                      <Block flex={1} row>
                        <Block
                          flex={1}
                          color="#F8F9FA"
                          justify="center"
                          align="center"
                        >
                          <RNText style={{ fontSize: 12, fontWeight: '600', color: '#2D3561' }}>L</RNText>
                        </Block>
                        <Block
                          flex={1}
                          color="#1A1A2E"
                          justify="center"
                          align="center"
                        >
                          <RNText style={{ fontSize: 12, fontWeight: '600', color: '#FFFFFF' }}>D</RNText>
                        </Block>
                      </Block>
                    ) : (
                      <Block flex={1} padding={sizes.xs}>
                        {/* Mini Card Preview */}
                        <Block
                          color={theme.preview.card}
                          radius={6}
                          flex={1}
                          padding={4}
                        >
                          <Block
                            style={{
                              width: '60%',
                              height: 4,
                              backgroundColor: theme.preview.text,
                              borderRadius: 2,
                              marginBottom: 3,
                              opacity: 0.7,
                            }}
                          />
                          <Block
                            style={{
                              width: '40%',
                              height: 3,
                              backgroundColor: theme.preview.text,
                              borderRadius: 2,
                              opacity: 0.4,
                            }}
                          />
                        </Block>
                      </Block>
                    )}
                  </Block>

                  {/* Icon and Name */}
                  <RNText style={{ fontSize: isVerySmallScreen ? 16 : 20, marginBottom: 2 }}>
                    {theme.icon}
                  </RNText>
                  <RNText
                    style={{
                      fontSize: isVerySmallScreen ? 12 : 13,
                      fontWeight: selectedTheme === theme.id ? '700' : '500',
                      color: selectedTheme === theme.id ? colors.primary : colors.text,
                    }}
                  >
                    {theme.name}
                  </RNText>
                </Block>
              </TouchableOpacity>
            ))}
          </Block>
        </Block>

        {/* Font Size */}
        <Block marginBottom={sizes.l}>
          <RNText
            style={{
              fontSize: sectionTitleSize,
              fontWeight: '700',
              color: colors.primary,
              marginBottom: sizes.s,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Text Size
          </RNText>
          <Block
            color={colors.white}
            radius={16}
            padding={isVerySmallScreen ? sizes.s : sizes.sm}
            style={{
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {/* Size Preview */}
            <Block
              color={colors.light}
              radius={12}
              padding={sizes.sm}
              marginBottom={sizes.sm}
              align="center"
            >
              <RNText
                style={{
                  fontSize:
                    fontSize === 'small'
                      ? 14
                      : fontSize === 'large'
                      ? 20
                      : 17,
                  color: colors.text,
                  fontWeight: '500',
                }}
              >
                Sample Text Preview
              </RNText>
            </Block>

            {/* Size Options */}
            <Block row justify="space-between">
              {[
                { id: 'small', label: 'Small', size: 'Aa' },
                { id: 'medium', label: 'Medium', size: 'Aa' },
                { id: 'large', label: 'Large', size: 'Aa' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.7}
                  onPress={() => setFontSize(option.id)}
                  style={{ flex: 1, marginHorizontal: sizes.xs }}
                >
                  <Block
                    color={fontSize === option.id ? colors.primary : colors.light}
                    radius={10}
                    padding={isVerySmallScreen ? sizes.xs : sizes.s}
                    align="center"
                  >
                    <RNText
                      style={{
                        fontSize:
                          option.id === 'small'
                            ? 14
                            : option.id === 'large'
                            ? 22
                            : 18,
                        fontWeight: '700',
                        color: fontSize === option.id ? colors.white : colors.text,
                        marginBottom: 2,
                      }}
                    >
                      {option.size}
                    </RNText>
                    <RNText
                      style={{
                        fontSize: isVerySmallScreen ? 10 : 11,
                        color: fontSize === option.id ? 'rgba(255,255,255,0.8)' : colors.gray,
                      }}
                    >
                      {option.label}
                    </RNText>
                  </Block>
                </TouchableOpacity>
              ))}
            </Block>
          </Block>
        </Block>

        {/* Display Options */}
        <Block marginBottom={sizes.l}>
          <RNText
            style={{
              fontSize: sectionTitleSize,
              fontWeight: '700',
              color: colors.primary,
              marginBottom: sizes.s,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Display Options
          </RNText>
          <Block
            color={colors.white}
            radius={16}
            style={{
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {[
              { id: 'animations', label: 'Reduce Animations', desc: 'Minimize motion effects', enabled: false },
              { id: 'contrast', label: 'High Contrast', desc: 'Increase text visibility', enabled: false },
              { id: 'bold', label: 'Bold Text', desc: 'Make text bolder', enabled: false },
            ].map((option, index) => (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.7}
                onPress={() => {
                  // Toggle option in a real app
                  console.log('Toggle:', option.id);
                }}
              >
                <Block
                  row
                  align="center"
                  justify="space-between"
                  padding={isVerySmallScreen ? sizes.s : sizes.sm}
                  style={{
                    borderBottomWidth: index < 2 ? 1 : 0,
                    borderBottomColor: colors.light,
                  }}
                >
                  <Block flex={1}>
                    <RNText
                      style={{
                        fontSize: itemTitleSize,
                        fontWeight: '600',
                        color: colors.text,
                        marginBottom: 2,
                      }}
                    >
                      {option.label}
                    </RNText>
                    <RNText
                      style={{
                        fontSize: descSize,
                        color: colors.gray,
                      }}
                    >
                      {option.desc}
                    </RNText>
                  </Block>
                  <Block
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: option.enabled ? colors.primary : colors.gray,
                      backgroundColor: option.enabled ? colors.primary : 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {option.enabled && (
                      <RNText style={{ fontSize: 10, color: colors.white, fontWeight: '700' }}>
                        OK
                      </RNText>
                    )}
                  </Block>
                </Block>
              </TouchableOpacity>
            ))}
          </Block>
        </Block>

        {/* Note */}
        <RNText
          style={{
            fontSize: descSize,
            color: colors.gray,
            textAlign: 'center',
            marginTop: sizes.s,
            lineHeight: descSize * 1.6,
          }}
        >
          Dark mode is coming soon!{'\n'}
          Stay tuned for more customization options.
        </RNText>
      </ScrollView>
    </Block>
  );
};

export default Appearance;
