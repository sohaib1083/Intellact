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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Block, Button, Image } from '../components/';
import { useTheme, useAuth } from '../hooks/';
import { signOut } from '../services/auth';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isVerySmallScreen = height < 600;

const Profile = () => {
  const { user, userProfile } = useAuth();
  const navigation = useNavigation();
  const { assets, colors, sizes, gradients } = useTheme();
  const insets = useSafeAreaInsets();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Responsive sizing
  const horizontalPadding = isSmallScreen ? sizes.sm : sizes.padding;
  const avatarSize = isVerySmallScreen ? 80 : isSmallScreen ? 90 : 110;
  const avatarFontSize = isVerySmallScreen ? 36 : isSmallScreen ? 42 : 52;
  const nameSize = isVerySmallScreen ? 22 : isSmallScreen ? 24 : 28;
  const emailSize = isVerySmallScreen ? 13 : 15;
  const statCircleSize = isVerySmallScreen ? 42 : isSmallScreen ? 46 : 50;
  const statFontSize = isVerySmallScreen ? 18 : isSmallScreen ? 20 : 22;
  const statLabelSize = isVerySmallScreen ? 11 : 13;
  const menuItemHeight = isVerySmallScreen ? 52 : 60;

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
      case 'payment':
        // TODO: Navigate to Payment Methods screen
        console.log('Navigate to Payment Methods');
        break;
      case 'notifications':
        navigation.navigate('Notifications' as never);
        break;
      case 'downloads':
        // TODO: Navigate to Downloads screen
        console.log('Navigate to Downloads');
        break;
      case 'language':
        navigation.navigate('Language' as never);
        break;
      case 'theme':
        navigation.navigate('Appearance' as never);
        break;
      case 'help':
        // TODO: Navigate to Help Center
        console.log('Navigate to Help Center');
        break;
      case 'feedback':
        // TODO: Navigate to Feedback screen
        console.log('Navigate to Feedback');
        break;
      case 'about':
        // TODO: Navigate to About screen
        console.log('Navigate to About');
        break;
      default:
        console.log('Feature not yet implemented:', itemId);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Block flex={1} color={colors.light}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: sizes.xxl }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Gradient Background */}
          <Block
            gradient={gradients.primary}
            paddingHorizontal={horizontalPadding}
            paddingBottom={sizes.xxl}
            style={{ paddingTop: insets.top + sizes.m }}
          >
            {/* Profile Info */}
            <Block align="center">
              {/* Avatar with Edit Button */}
              <Block style={{ position: 'relative', marginBottom: sizes.m }}>
                <Block
                  style={{
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: avatarSize / 2,
                    backgroundColor: colors.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 15,
                    elevation: 10,
                    borderWidth: isVerySmallScreen ? 2 : 4,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <RNText style={{ fontSize: avatarFontSize, color: colors.primary, fontWeight: '600' }}>
                    {displayName.charAt(0).toUpperCase()}
                  </RNText>
                </Block>

                {/* Edit Profile Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('EditProfile' as never)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: isVerySmallScreen ? 28 : 36,
                    height: isVerySmallScreen ? 28 : 36,
                    borderRadius: isVerySmallScreen ? 14 : 18,
                    backgroundColor: colors.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <RNText style={{ fontSize: isVerySmallScreen ? 14 : 18, color: colors.primary }}>✎</RNText>
                </TouchableOpacity>
              </Block>

              {/* Name */}
              <RNText
                style={{
                  fontSize: nameSize,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: isVerySmallScreen ? 4 : 6,
                  letterSpacing: 0.3,
                }}
              >
                {displayName}
              </RNText>

              {/* Email */}
              <RNText
                style={{
                  fontSize: emailSize,
                  color: '#FFFFFF',
                  opacity: 0.95,
                  marginBottom: isVerySmallScreen ? sizes.xs : sizes.sm,
                  letterSpacing: 0.2,
                }}
              >
                {userEmail}
              </RNText>

              {/* Role Badge */}
              <Block
                color="rgba(255, 255, 255, 0.25)"
                radius={20}
                paddingHorizontal={isVerySmallScreen ? sizes.s : sizes.m}
                paddingVertical={isVerySmallScreen ? 6 : sizes.s}
                style={{
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <RNText
                  style={{
                    fontSize: isVerySmallScreen ? 11 : 13,
                    color: '#FFFFFF',
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}
                >
                  {userRole} • Member since {memberSince}
                </RNText>
              </Block>
            </Block>
          </Block>

          {/* Stats Cards */}
          <Block paddingHorizontal={horizontalPadding} marginTop={isVerySmallScreen ? -sizes.m : -sizes.xl}>
            <Block
              color={colors.white}
              radius={isVerySmallScreen ? 16 : 20}
              padding={isVerySmallScreen ? sizes.sm : sizes.l}
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 15,
                elevation: 6,
              }}
            >
              <Block row justify="space-around">
                {/* Courses Enrolled */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('MyCourses' as never)}
                  style={{ flex: 1, alignItems: 'center' }}
                >
                  <Block align="center">
                    <Block
                      style={{
                        width: statCircleSize,
                        height: statCircleSize,
                        borderRadius: statCircleSize / 2,
                        backgroundColor: 'rgba(45, 53, 97, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: isVerySmallScreen ? 4 : sizes.xs,
                      }}
                    >
                      <RNText style={{ fontSize: statFontSize, color: colors.primary, fontWeight: 'bold' }}>
                        {stats.coursesEnrolled}
                      </RNText>
                    </Block>
                    <RNText
                      style={{
                        fontSize: statLabelSize,
                        color: colors.gray,
                        fontWeight: '500',
                        marginTop: 4,
                      }}
                    >
                      Enrolled
                    </RNText>
                  </Block>
                </TouchableOpacity>

                {/* Divider */}
                <View style={{ width: 1, backgroundColor: colors.card, marginHorizontal: isVerySmallScreen ? 4 : sizes.xs }} />

                {/* Completed */}
                <Block align="center" flex={1}>
                  <Block
                    style={{
                      width: statCircleSize,
                      height: statCircleSize,
                      borderRadius: statCircleSize / 2,
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: isVerySmallScreen ? 4 : sizes.xs,
                    }}
                  >
                    <RNText style={{ fontSize: statFontSize, color: colors.success, fontWeight: 'bold' }}>
                      {stats.coursesCompleted}
                    </RNText>
                  </Block>
                  <RNText
                    style={{
                      fontSize: statLabelSize,
                      color: colors.gray,
                      fontWeight: '500',
                      marginTop: 4,
                    }}
                  >
                    Done
                  </RNText>
                </Block>

                {/* Divider */}
                <View style={{ width: 1, backgroundColor: colors.card, marginHorizontal: isVerySmallScreen ? 4 : sizes.xs }} />

                {/* Hours */}
                <Block align="center" flex={1}>
                  <Block
                    style={{
                      width: statCircleSize,
                      height: statCircleSize,
                      borderRadius: statCircleSize / 2,
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: isVerySmallScreen ? 4 : sizes.xs,
                    }}
                  >
                    <RNText style={{ fontSize: statFontSize, color: colors.warning, fontWeight: 'bold' }}>
                      {stats.hoursLearned}
                    </RNText>
                  </Block>
                  <RNText
                    style={{
                      fontSize: statLabelSize,
                      color: colors.gray,
                      fontWeight: '500',
                      marginTop: 4,
                    }}
                  >
                    Hours
                  </RNText>
                </Block>

                {/* Divider */}
                <View style={{ width: 1, backgroundColor: colors.card, marginHorizontal: isVerySmallScreen ? 4 : sizes.xs }} />

                {/* Certificates */}
                <Block align="center" flex={1}>
                  <Block
                    style={{
                      width: statCircleSize,
                      height: statCircleSize,
                      borderRadius: statCircleSize / 2,
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: isVerySmallScreen ? 4 : sizes.xs,
                    }}
                  >
                    <RNText style={{ fontSize: statFontSize, color: colors.info, fontWeight: 'bold' }}>
                      {stats.certificates}
                    </RNText>
                  </Block>
                  <RNText
                    style={{
                      fontSize: statLabelSize,
                      color: colors.gray,
                      fontWeight: '500',
                      marginTop: 4,
                    }}
                  >
                    Awards
                  </RNText>
                </Block>
              </Block>
            </Block>
          </Block>

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <Block key={section.title} paddingHorizontal={horizontalPadding} marginTop={isVerySmallScreen ? sizes.m : sizes.l}>
              {/* Section Title */}
              <RNText
                style={{
                  fontSize: isVerySmallScreen ? 12 : 14,
                  fontWeight: '600',
                  color: colors.gray,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: isVerySmallScreen ? sizes.xs : sizes.sm,
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
                  shadowOpacity: 0.08,
                  shadowOffset: { width: 0, height: 3 },
                  shadowRadius: 10,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: colors.card,
                }}
              >
                {section.items.map((item, itemIndex) => (
                  <React.Fragment key={item.id}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => handleMenuPress(item.id)}
                    >
                      <Block
                        row
                        align="center"
                        justify="space-between"
                        paddingHorizontal={isVerySmallScreen ? sizes.sm : sizes.m}
                        paddingVertical={isVerySmallScreen ? sizes.s : sizes.sm + 4}
                        style={{ minHeight: menuItemHeight }}
                      >
                        {/* Left: Label */}
                        <Block row align="center" flex={1}>
                          <RNText
                            style={{
                              fontSize: isVerySmallScreen ? 14 : 16,
                              color: colors.text,
                              fontWeight: '500',
                              letterSpacing: 0.1,
                            }}
                          >
                            {item.label}
                          </RNText>
                        </Block>

                        {/* Right: Badge + Arrow */}
                        <Block row align="center">
                          {item.badge !== null && (
                            <Block
                              style={{
                                backgroundColor: colors.card,
                                paddingHorizontal: isVerySmallScreen ? 6 : sizes.s,
                                paddingVertical: isVerySmallScreen ? 2 : 4,
                                borderRadius: isVerySmallScreen ? 8 : 10,
                                marginRight: isVerySmallScreen ? 6 : sizes.s,
                              }}
                            >
                              <RNText
                                style={{
                                  fontSize: isVerySmallScreen ? 11 : 12,
                                  color: colors.primary,
                                  fontWeight: '600',
                                }}
                              >
                                {item.badge}
                              </RNText>
                            </Block>
                          )}
                          <RNText style={{ fontSize: isVerySmallScreen ? 16 : 20, color: colors.gray, fontWeight: '300' }}>›</RNText>
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
          <Block paddingHorizontal={horizontalPadding} marginTop={isVerySmallScreen ? sizes.m : sizes.l}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleLogout}
              disabled={isLoggingOut}
            >
              <Block
                color={isLoggingOut ? colors.card : colors.white}
                radius={16}
                padding={isVerySmallScreen ? sizes.s : sizes.sm + 2}
                row
                align="center"
                justify="center"
                style={{
                  shadowColor: '#ef4444',
                  shadowOpacity: 0.15,
                  shadowOffset: { width: 0, height: 3 },
                  shadowRadius: 10,
                  elevation: 3,
                  minHeight: isVerySmallScreen ? 48 : 56,
                  borderWidth: 2,
                  borderColor: '#ef4444',
                }}
              >
                <RNText
                  style={{
                    fontSize: isVerySmallScreen ? 14 : 16,
                    color: '#ef4444',
                    fontWeight: '600',
                    letterSpacing: 0.3,
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
