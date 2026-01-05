import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text as RNText,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Block } from '../components/';
import { useTheme, useAuth } from '../hooks/';
import { updateUserProfile } from '../services/auth';

const { height, width } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isVerySmallScreen = height < 600;

const EditProfile = () => {
  const navigation = useNavigation();
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { colors, sizes } = useTheme();
  const insets = useSafeAreaInsets();
  const [isSaving, setIsSaving] = useState(false);

  // Responsive sizing
  const horizontalPadding = isVerySmallScreen ? sizes.sm : isSmallScreen ? sizes.m : sizes.padding;
  const avatarSize = isVerySmallScreen ? 70 : isSmallScreen ? 80 : 90;
  const avatarFontSize = isVerySmallScreen ? 32 : isSmallScreen ? 38 : 42;
  const titleSize = isVerySmallScreen ? 16 : 18;
  const labelSize = isVerySmallScreen ? 13 : 14;
  const inputSize = isVerySmallScreen ? 15 : 16;
  const inputHeight = isVerySmallScreen ? 44 : 48;

  // Form state
  const [formData, setFormData] = useState({
    name: userProfile?.name || user?.displayName || '',
    phone: userProfile?.phone || '',
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
  });

  const validateForm = () => {
    const newErrors = { name: '', phone: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      if (user) {
        await updateUserProfile(user.uid, {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        });
        
        // Refresh the user profile in context
        await refreshUserProfile();

        Alert.alert(
          'Success',
          'Your profile has been updated successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        'Failed to update profile. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Block flex={1} color={colors.light}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: sizes.xxl }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Block
            paddingHorizontal={horizontalPadding}
            paddingBottom={isVerySmallScreen ? sizes.s : sizes.m}
            color={colors.white}
            style={{
              paddingTop: insets.top + (isVerySmallScreen ? sizes.sm : sizes.m),
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Block row align="center" justify="space-between">
              <TouchableOpacity
                onPress={handleCancel}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <RNText
                  style={{
                    fontSize: isVerySmallScreen ? 15 : 16,
                    color: colors.primary,
                    fontWeight: '500',
                  }}
                >
                  Cancel
                </RNText>
              </TouchableOpacity>

              <RNText
                style={{
                  fontSize: titleSize,
                  fontWeight: '700',
                  color: colors.text,
                  letterSpacing: 0.2,
                }}
              >
                Edit Profile
              </RNText>

              <TouchableOpacity
                onPress={handleSave}
                disabled={isSaving}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <RNText
                  style={{
                    fontSize: isVerySmallScreen ? 15 : 16,
                    color: isSaving ? colors.gray : colors.primary,
                    fontWeight: '700',
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </RNText>
              </TouchableOpacity>
            </Block>
          </Block>

          {/* Avatar Section */}
          <Block align="center" paddingVertical={isVerySmallScreen ? sizes.m : sizes.l}>
            <Block
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.12,
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <RNText style={{ fontSize: avatarFontSize, color: colors.white, fontWeight: '600' }}>
                {formData.name.charAt(0).toUpperCase() || 'U'}
              </RNText>
            </Block>
            <TouchableOpacity style={{ marginTop: sizes.s }}>
              <RNText
                style={{
                  fontSize: 14,
                  color: colors.primary,
                  fontWeight: '500',
                }}
              >
                Change Photo
              </RNText>
            </TouchableOpacity>
          </Block>

          {/* Form Section */}
          <Block paddingHorizontal={horizontalPadding}>
            {/* Name Field */}
            <Block marginBottom={isVerySmallScreen ? sizes.sm : sizes.m}>
              <RNText
                style={{
                  fontSize: labelSize,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: sizes.xs,
                  letterSpacing: 0.2,
                }}
              >
                Full Name *
              </RNText>
              <Block
                color={colors.white}
                radius={12}
                style={{
                  borderWidth: 1.5,
                  borderColor: errors.name ? '#ef4444' : colors.card,
                  shadowColor: errors.name ? '#ef4444' : '#000',
                  shadowOpacity: errors.name ? 0.1 : 0.03,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => {
                    setFormData({ ...formData, name: text });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.gray}
                  style={{
                    fontSize: inputSize,
                    color: colors.text,
                    padding: isVerySmallScreen ? sizes.s : sizes.sm,
                    minHeight: inputHeight,
                  }}
                />
              </Block>
              {errors.name ? (
                <RNText
                  style={{
                    fontSize: isVerySmallScreen ? 11 : 12,
                    color: '#ef4444',
                    marginTop: 4,
                  }}
                >
                  {errors.name}
                </RNText>
              ) : null}
            </Block>

            {/* Email Field (Read-only) */}
            <Block marginBottom={isVerySmallScreen ? sizes.sm : sizes.m}>
              <RNText
                style={{
                  fontSize: labelSize,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: sizes.xs,
                  letterSpacing: 0.2,
                }}
              >
                Email
              </RNText>
              <Block
                color={colors.card}
                radius={12}
                style={{
                  borderWidth: 1.5,
                  borderColor: colors.card,
                }}
              >
                <TextInput
                  value={user?.email || ''}
                  editable={false}
                  style={{
                    fontSize: inputSize,
                    color: colors.gray,
                    padding: isVerySmallScreen ? sizes.s : sizes.sm,
                    minHeight: inputHeight,
                  }}
                />
              </Block>
              <RNText
                style={{
                  fontSize: isVerySmallScreen ? 11 : 12,
                  color: colors.gray,
                  marginTop: 4,
                }}
              >
                Email cannot be changed
              </RNText>
            </Block>

            {/* Phone Field */}
            <Block marginBottom={isVerySmallScreen ? sizes.sm : sizes.m}>
              <RNText
                style={{
                  fontSize: labelSize,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: sizes.xs,
                  letterSpacing: 0.2,
                }}
              >
                Phone Number
              </RNText>
              <Block
                color={colors.white}
                radius={12}
                style={{
                  borderWidth: 1.5,
                  borderColor: errors.phone ? '#ef4444' : colors.card,
                  shadowColor: errors.phone ? '#ef4444' : colors.primary,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: errors.phone ? 0.15 : 0.03,
                  shadowRadius: 4,
                  elevation: errors.phone ? 3 : 1,
                }}
              >
                <TextInput
                  value={formData.phone}
                  onChangeText={(text) => {
                    setFormData({ ...formData, phone: text });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor={colors.gray}
                  keyboardType="phone-pad"
                  style={{
                    fontSize: inputSize,
                    color: colors.text,
                    padding: isVerySmallScreen ? sizes.s : sizes.sm,
                    minHeight: inputHeight,
                  }}
                />
              </Block>
              {errors.phone ? (
                <RNText
                  style={{
                    fontSize: isVerySmallScreen ? 11 : 12,
                    color: '#ef4444',
                    marginTop: 4,
                  }}
                >
                  {errors.phone}
                </RNText>
              ) : null}
            </Block>

            {/* Role Display */}
            <Block marginBottom={isVerySmallScreen ? sizes.sm : sizes.m}>
              <RNText
                style={{
                  fontSize: labelSize,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: sizes.xs,
                  letterSpacing: 0.2,
                }}
              >
                Role
              </RNText>
              <Block
                color={colors.card}
                radius={12}
                padding={isVerySmallScreen ? sizes.s : sizes.sm}
                style={{
                  borderWidth: 1.5,
                  borderColor: colors.card,
                  minHeight: inputHeight,
                  justifyContent: 'center',
                }}
              >
                <RNText
                  style={{
                    fontSize: inputSize,
                    color: colors.gray,
                  }}
                >
                  {userProfile?.role === 'learner' ? 'Learner' : 'Seller'}
                </RNText>
              </Block>
              <RNText
                style={{
                  fontSize: isVerySmallScreen ? 11 : 12,
                  color: colors.gray,
                  marginTop: 4,
                }}
              >
                Contact support to change your role
              </RNText>
            </Block>
          </Block>

          {/* Action Buttons */}
          <Block paddingHorizontal={horizontalPadding} marginTop={sizes.l}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Block
                color={colors.primary}
                radius={12}
                padding={isVerySmallScreen ? sizes.s : sizes.sm}
                align="center"
                justify="center"
                style={{
                  minHeight: isVerySmallScreen ? 48 : isSmallScreen ? 50 : 52,
                  opacity: isSaving ? 0.6 : 1,
                  shadowColor: colors.primary,
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 4,
                }}
              >
                <RNText
                  style={{
                    fontSize: isVerySmallScreen ? 14 : isSmallScreen ? 15 : 16,
                    color: '#FFFFFF',
                    fontWeight: '700',
                    letterSpacing: 0.3,
                  }}
                >
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </RNText>
              </Block>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCancel}
              style={{ marginTop: sizes.sm }}
            >
              <Block
                color={colors.white}
                radius={12}
                padding={isVerySmallScreen ? sizes.s : sizes.sm}
                align="center"
                justify="center"
                style={{
                  minHeight: isVerySmallScreen ? 48 : isSmallScreen ? 50 : 52,
                  borderWidth: 1.5,
                  borderColor: colors.card,
                }}
              >
                <RNText
                  style={{
                    fontSize: isVerySmallScreen ? 14 : isSmallScreen ? 15 : 16,
                    color: colors.text,
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </RNText>
              </Block>
            </TouchableOpacity>
          </Block>
        </ScrollView>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default EditProfile;
