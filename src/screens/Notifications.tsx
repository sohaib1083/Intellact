import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text as RNText,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Block } from '../components/';
import { useTheme } from '../hooks/';

const { height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isVerySmallScreen = height < 600;

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const Notifications = () => {
  const navigation = useNavigation();
  const { colors, sizes } = useTheme();
  const insets = useSafeAreaInsets();

  // Responsive sizing
  const horizontalPadding = isVerySmallScreen ? sizes.sm : isSmallScreen ? sizes.m : sizes.padding;
  const titleSize = isVerySmallScreen ? 16 : 18;
  const sectionTitleSize = isVerySmallScreen ? 13 : 14;
  const itemTitleSize = isVerySmallScreen ? 14 : 15;
  const descSize = isVerySmallScreen ? 11 : 12;
  const itemPadding = isVerySmallScreen ? sizes.s : sizes.sm;

  // Notification settings state
  const [settings, setSettings] = useState<{ [key: string]: NotificationSetting[] }>({
    general: [
      {
        id: 'push',
        title: 'Push Notifications',
        description: 'Receive notifications on your device',
        enabled: true,
      },
      {
        id: 'email',
        title: 'Email Notifications',
        description: 'Receive updates via email',
        enabled: true,
      },
      {
        id: 'sound',
        title: 'Notification Sound',
        description: 'Play sound for notifications',
        enabled: true,
      },
    ],
    courses: [
      {
        id: 'course-updates',
        title: 'Course Updates',
        description: 'When your enrolled courses have new content',
        enabled: true,
      },
      {
        id: 'course-reminders',
        title: 'Learning Reminders',
        description: 'Daily reminders to continue learning',
        enabled: false,
      },
      {
        id: 'course-completion',
        title: 'Completion Alerts',
        description: 'When you complete a course or milestone',
        enabled: true,
      },
    ],
    social: [
      {
        id: 'instructor-messages',
        title: 'Instructor Messages',
        description: 'When instructors respond to your questions',
        enabled: true,
      },
      {
        id: 'community',
        title: 'Community Activity',
        description: 'Replies and mentions in discussions',
        enabled: false,
      },
    ],
    promotional: [
      {
        id: 'deals',
        title: 'Deals & Promotions',
        description: 'Special offers and discounts',
        enabled: false,
      },
      {
        id: 'recommendations',
        title: 'Course Recommendations',
        description: 'Personalized course suggestions',
        enabled: true,
      },
    ],
  });

  const toggleSetting = (category: string, settingId: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: prev[category].map((setting) =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      ),
    }));
  };

  const renderSection = (title: string, category: string) => (
    <Block marginBottom={sizes.m}>
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
        {title}
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
        {settings[category].map((setting, index) => (
          <Block
            key={setting.id}
            row
            align="center"
            justify="space-between"
            padding={itemPadding}
            style={{
              borderBottomWidth: index < settings[category].length - 1 ? 1 : 0,
              borderBottomColor: colors.light,
            }}
          >
            <Block flex={1} marginRight={sizes.s}>
              <RNText
                style={{
                  fontSize: itemTitleSize,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 2,
                }}
              >
                {setting.title}
              </RNText>
              <RNText
                style={{
                  fontSize: descSize,
                  color: colors.gray,
                  lineHeight: descSize * 1.4,
                }}
              >
                {setting.description}
              </RNText>
            </Block>
            <Switch
              value={setting.enabled}
              onValueChange={() => toggleSetting(category, setting.id)}
              trackColor={{ false: colors.light, true: 'rgba(45, 53, 97, 0.3)' }}
              thumbColor={setting.enabled ? colors.primary : colors.gray}
              ios_backgroundColor={colors.light}
              style={{ transform: [{ scaleX: isVerySmallScreen ? 0.85 : 0.95 }, { scaleY: isVerySmallScreen ? 0.85 : 0.95 }] }}
            />
          </Block>
        ))}
      </Block>
    </Block>
  );

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
          Notifications
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
            <RNText style={{ fontSize: isVerySmallScreen ? 14 : 16, color: colors.primary, fontWeight: '600' }}>N</RNText>
          </Block>
          <Block flex={1}>
            <RNText
              style={{
                fontSize: descSize,
                color: colors.text,
                lineHeight: descSize * 1.5,
              }}
            >
              Manage your notification preferences to stay updated on what matters most to you.
            </RNText>
          </Block>
        </Block>

        {renderSection('General', 'general')}
        {renderSection('Course Updates', 'courses')}
        {renderSection('Social', 'social')}
        {renderSection('Promotional', 'promotional')}

        {/* Turn Off All */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // Turn off all notifications
            const newSettings = { ...settings };
            Object.keys(newSettings).forEach((category) => {
              newSettings[category] = newSettings[category].map((s) => ({
                ...s,
                enabled: false,
              }));
            });
            setSettings(newSettings);
          }}
          style={{ marginTop: sizes.s }}
        >
          <Block
            color={colors.white}
            radius={12}
            padding={isVerySmallScreen ? sizes.s : sizes.sm}
            align="center"
            style={{
              borderWidth: 1.5,
              borderColor: '#ef4444',
            }}
          >
            <RNText
              style={{
                fontSize: itemTitleSize,
                fontWeight: '600',
                color: '#ef4444',
              }}
            >
              Turn Off All Notifications
            </RNText>
          </Block>
        </TouchableOpacity>
      </ScrollView>
    </Block>
  );
};

export default Notifications;
