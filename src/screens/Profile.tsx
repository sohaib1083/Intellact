import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text as RNText,
  View,
  Platform,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { Block, Button, Image } from '../components/';
import { useTheme, useAuth } from '../hooks/';
import { signOut } from '../services/auth';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

const Profile = () => {
  const { user, userProfile } = useAuth();
  const navigation = useNavigation();
  const { assets, colors, sizes, gradients } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const horizontalPadding = isSmallScreen ? sizes.sm : sizes.padding;

  // Get user display info
  const displayName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'Learner';
  const userEmail = user?.email || 'No email';
  const userRole = userProfile?.role === 'learner' ? 'Learner' : 'Seller';
  const memberSince = userProfile?.createdAt 
    ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  // Profile stats
  const stats = {
    coursesEnrolled: 0,
    coursesCompleted: 0,
    hoursLearned: 0,
    certificates: 0,
  };

  // Menu items
  const menuSections = [
    {
      title: 'Account',
      items: [
        { id: 'edit-profile', label: 'Edit Profile', badge: null },
        { id: 'my-courses', label: 'My Courses', badge: stats.coursesEnrolled },
        { id: 'certificates', label: 'Certificates', badge: stats.certificates },
        { id: 'payment', label: 'Payment Methods', badge: null },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: 'notifications', label: 'Notifications', badge: null },
        { id: 'downloads', label: 'Downloads', badge: null },
        { id: 'language', label: 'Language', badge: 'English' },
        { id: 'theme', label: 'Appearance', badge: 'Light' },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help Center', badge: null },
        { id: 'feedback', label: 'Send Feedback', badge: null },
        { id: 'about', label: 'About Intellact', badge: null },
      ],
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      // Navigation will be handled by auth state change
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const handleMenuPress = (itemId: string) => {
    console.log('Menu item pressed:', itemId);
    
    switch (itemId) {
      case 'edit-profile':
        navigation.navigate('EditProfile' as never);
        break;
      case 'my-courses':
        navigation.navigate('MyCourses' as never);
        break;
      case 'certificates':
        // TODO: Navigate to Certificates screen
        console.log('Navigate to Certificates');
        break;
      default:
        console.log('Feature not yet implemented:', itemId);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Block safe flex={1} color={colors.light}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: sizes.xxl }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Gradient Background */}
          <Block
            gradient={gradients.primary}
            paddingHorizontal={horizontalPadding}
            paddingTop={sizes.l}
            paddingBottom={sizes.xxl}
          >
            {/* Profile Info */}
            <Block align="center">
              {/* Avatar */}
              <Block
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.15,
                  shadowOffset: { width: 0, height: 4 },
                  shadowRadius: 12,
                  elevation: 8,
                  marginBottom: sizes.m,
                }}
              >
                <RNText style={{ fontSize: 48, color: colors.primary }}>
                  {displayName.charAt(0).toUpperCase()}
                </RNText>
              </Block>

              {/* Name */}
              <RNText
                style={{
                  fontSize: 26,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: 4,
                }}
              >
                {displayName}
              </RNText>

              {/* Email */}
              <RNText
                style={{
                  fontSize: 14,
                  color: '#FFFFFF',
                  opacity: 0.9,
                  marginBottom: sizes.s,
                }}
              >
                {userEmail}
              </RNText>

              {/* Role Badge */}
              <Block
                color="rgba(255, 255, 255, 0.2)"
                radius={20}
                paddingHorizontal={sizes.m}
                paddingVertical={sizes.xs}
              >
                <RNText
                  style={{
                    fontSize: 13,
                    color: '#FFFFFF',
                    fontWeight: '600',
                  }}
                >
                  {userRole} • Member since {memberSince}
                </RNText>
              </Block>
            </Block>
          </Block>

          {/* Stats Cards */}
          <Block paddingHorizontal={horizontalPadding} marginTop={-sizes.xl}>
            <Block
              color={colors.white}
              radius={20}
              padding={sizes.m}
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <Block row justify="space-around">
                {/* Courses Enrolled */}
                <Block align="center" flex={1}>
                  <RNText
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: colors.primary,
                    }}
                  >
                    {stats.coursesEnrolled}
                  </RNText>
                  <RNText
                    style={{
                      fontSize: 12,
                      color: colors.gray,
                      marginTop: 4,
                    }}
                  >
                    Enrolled
                  </RNText>
                </Block>

                {/* Divider */}
                <View style={{ width: 1, backgroundColor: colors.card, marginHorizontal: sizes.s }} />

                {/* Completed */}
                <Block align="center" flex={1}>
                  <RNText
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: colors.primary,
                    }}
                  >
                    {stats.coursesCompleted}
                  </RNText>
                  <RNText
                    style={{
                      fontSize: 12,
                      color: colors.gray,
                      marginTop: 4,
                    }}
                  >
                    Completed
                  </RNText>
                </Block>

                {/* Divider */}
                <View style={{ width: 1, backgroundColor: colors.card, marginHorizontal: sizes.s }} />

                {/* Hours */}
                <Block align="center" flex={1}>
                  <RNText
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: colors.primary,
                    }}
                  >
                    {stats.hoursLearned}h
                  </RNText>
                  <RNText
                    style={{
                      fontSize: 12,
                      color: colors.gray,
                      marginTop: 4,
                    }}
                  >
                    Learning
                  </RNText>
                </Block>

                {/* Divider */}
                <View style={{ width: 1, backgroundColor: colors.card, marginHorizontal: sizes.s }} />

                {/* Certificates */}
                <Block align="center" flex={1}>
                  <RNText
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: colors.primary,
                    }}
                  >
                    {stats.certificates}
                  </RNText>
                  <RNText
                    style={{
                      fontSize: 12,
                      color: colors.gray,
                      marginTop: 4,
                    }}
                  >
                    Certificates
                  </RNText>
                </Block>
              </Block>
            </Block>
          </Block>

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <Block key={section.title} paddingHorizontal={horizontalPadding} marginTop={sizes.l}>
              {/* Section Title */}
              <RNText
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.gray,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: sizes.sm,
                }}
              >
                {section.title}
              </RNText>

              {/* Menu Items */}
              <Block
                color={colors.white}
                radius={16}
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.06,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                {section.items.map((item, itemIndex) => (
                  <React.Fragment key={item.id}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleMenuPress(item.id)}
                    >
                      <Block
                        row
                        align="center"
                        justify="space-between"
                        paddingHorizontal={sizes.sm}
                        paddingVertical={sizes.sm}
                        style={{ minHeight: 56 }}
                      >
                        {/* Left: Label with clean design */}
                        <Block row align="center" flex={1}>
                          <RNText
                            style={{
                              fontSize: 16,
                              color: colors.text,
                              fontWeight: '400',
                              letterSpacing: 0.2,
                            }}
                          >
                            {item.label}
                          </RNText>
                        </Block>

                        {/* Right: Badge + Arrow */}
                        <Block row align="center">
                          {item.badge !== null && (
                            <RNText
                              style={{
                                fontSize: 13,
                                color: colors.gray,
                                fontWeight: '400',
                                marginRight: sizes.s,
                              }}
                            >
                              {item.badge}
                            </RNText>
                          )}
                          <RNText style={{ fontSize: 18, color: colors.gray, fontWeight: '300' }}>›</RNText>
                        </Block>
                      </Block>
                    </TouchableOpacity>

                    {/* Divider (not for last item) */}
                    {itemIndex < section.items.length - 1 && (
                      <View
                        style={{
                          height: 1,
                          backgroundColor: colors.card,
                          marginLeft: sizes.sm,
                          marginRight: sizes.sm,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Block>
            </Block>
          ))}

          {/* Logout Button */}
          <Block paddingHorizontal={horizontalPadding} marginTop={sizes.l}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogout}
              disabled={isLoggingOut}
            >
              <Block
                color={colors.white}
                radius={16}
                padding={sizes.sm}
                row
                align="center"
                justify="center"
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.06,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 8,
                  elevation: 2,
                  minHeight: 56,
                  borderWidth: 1,
                  borderColor: '#ef4444',
                }}
              >
                <RNText
                  style={{
                    fontSize: 16,
                    color: '#ef4444',
                    fontWeight: '600',
                  }}
                >
                  {isLoggingOut ? 'Logging out...' : 'Log Out'}
                </RNText>
              </Block>
            </TouchableOpacity>
          </Block>

          {/* App Version */}
          <Block align="center" marginTop={sizes.l}>
            <RNText
              style={{
                fontSize: 12,
                color: colors.gray,
                opacity: 0.6,
              }}
            >
              Intellact v1.0.0
            </RNText>
          </Block>
        </ScrollView>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default Profile;
