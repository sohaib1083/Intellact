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

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

const Language = () => {
  const navigation = useNavigation();
  const { colors, sizes } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Responsive sizing
  const horizontalPadding = isVerySmallScreen ? sizes.sm : isSmallScreen ? sizes.m : sizes.padding;
  const titleSize = isVerySmallScreen ? 16 : 18;
  const itemTitleSize = isVerySmallScreen ? 14 : 15;
  const nativeSize = isVerySmallScreen ? 12 : 13;
  const flagSize = isVerySmallScreen ? 24 : 28;
  const itemHeight = isVerySmallScreen ? 52 : 58;
  const checkSize = isVerySmallScreen ? 20 : 24;

  const handleSelectLanguage = (code: string) => {
    setSelectedLanguage(code);
    // In a real app, this would update the app's locale
    // and potentially save to user preferences
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
          Language
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
        {/* Info Banner */}
        <Block
          color="rgba(45, 53, 97, 0.08)"
          radius={12}
          padding={isVerySmallScreen ? sizes.s : sizes.sm}
          marginBottom={sizes.m}
          row
          align="center"
        >
          <Block
            style={{
              width: isVerySmallScreen ? 32 : 36,
              height: isVerySmallScreen ? 32 : 36,
              borderRadius: isVerySmallScreen ? 16 : 18,
              backgroundColor: 'rgba(45, 53, 97, 0.15)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: sizes.s,
            }}
          >
            <RNText style={{ fontSize: isVerySmallScreen ? 14 : 16, color: colors.primary, fontWeight: '600' }}>G</RNText>
          </Block>
          <Block flex={1}>
            <RNText
              style={{
                fontSize: isVerySmallScreen ? 11 : 12,
                color: colors.text,
                lineHeight: (isVerySmallScreen ? 11 : 12) * 1.5,
              }}
            >
              Select your preferred language for the app interface. Course content language may vary.
            </RNText>
          </Block>
        </Block>

        {/* Language List */}
        <Block
          color={colors.white}
          radius={16}
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
            overflow: 'hidden',
          }}
        >
          {languages.map((language, index) => (
            <TouchableOpacity
              key={language.code}
              activeOpacity={0.7}
              onPress={() => handleSelectLanguage(language.code)}
            >
              <Block
                row
                align="center"
                style={{
                  height: itemHeight,
                  paddingHorizontal: isVerySmallScreen ? sizes.s : sizes.sm,
                  borderBottomWidth: index < languages.length - 1 ? 1 : 0,
                  borderBottomColor: colors.light,
                  backgroundColor:
                    selectedLanguage === language.code
                      ? 'rgba(45, 53, 97, 0.06)'
                      : colors.white,
                }}
              >
                {/* Flag */}
                <Block
                  style={{
                    width: flagSize + 8,
                    height: flagSize + 8,
                    borderRadius: (flagSize + 8) / 2,
                    backgroundColor: colors.light,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: sizes.s,
                  }}
                >
                  <RNText style={{ fontSize: flagSize - 4 }}>{language.flag}</RNText>
                </Block>

                {/* Language Names */}
                <Block flex={1}>
                  <RNText
                    style={{
                      fontSize: itemTitleSize,
                      fontWeight: selectedLanguage === language.code ? '700' : '500',
                      color: selectedLanguage === language.code ? colors.primary : colors.text,
                    }}
                  >
                    {language.name}
                  </RNText>
                  <RNText
                    style={{
                      fontSize: nativeSize,
                      color: colors.gray,
                      marginTop: 1,
                    }}
                  >
                    {language.nativeName}
                  </RNText>
                </Block>

                {/* Checkmark */}
                {selectedLanguage === language.code && (
                  <Block
                    style={{
                      width: checkSize,
                      height: checkSize,
                      borderRadius: checkSize / 2,
                      backgroundColor: colors.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <RNText
                      style={{
                        fontSize: checkSize * 0.5,
                        color: colors.white,
                        fontWeight: '700',
                      }}
                    >
                      OK
                    </RNText>
                  </Block>
                )}
              </Block>
            </TouchableOpacity>
          ))}
        </Block>

        {/* Note */}
        <RNText
          style={{
            fontSize: isVerySmallScreen ? 11 : 12,
            color: colors.gray,
            textAlign: 'center',
            marginTop: sizes.m,
            lineHeight: (isVerySmallScreen ? 11 : 12) * 1.6,
          }}
        >
          More languages coming soon. Have a suggestion?{'\n'}
          Contact us through the Help Center.
        </RNText>
      </ScrollView>
    </Block>
  );
};

export default Language;
