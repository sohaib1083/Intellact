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

import { Block } from '../components/';
import { useTheme, useAuth } from '../hooks/';
import { updateUserProfile } from '../services/auth';

const { height } = Dimensions.get('window');
const isSmallScreen = height < 700;

const EditProfile = () => {
  const navigation = useNavigation();
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { colors, sizes } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const horizontalPadding = isSmallScreen ? sizes.sm : sizes.padding;

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
      <Block safe flex={1} color={colors.light}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: sizes.xxl }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Block
            paddingHorizontal={horizontalPadding}
            paddingTop={sizes.l}
            paddingBottom={sizes.m}
            color={colors.card}
          >
            <Block row align="center" justify="space-between">
              <TouchableOpacity
                onPress={handleCancel}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <RNText
                  style={{
                    fontSize: 16,
                    color: colors.primary,
                    fontWeight: '400',
                  }}
                >
                  Cancel
                </RNText>
              </TouchableOpacity>

              <RNText
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.text,
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
                    fontSize: 16,
                    color: isSaving ? colors.gray : colors.primary,
                    fontWeight: '600',
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </RNText>
              </TouchableOpacity>
            </Block>
          </Block>

          {/* Avatar Section */}
          <Block align="center" paddingVertical={sizes.l}>
            <Block
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <RNText style={{ fontSize: 48, color: colors.white }}>
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
            <Block marginBottom={sizes.m}>
              <RNText
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: colors.text,
                  marginBottom: sizes.xs,
                }}
              >
                Full Name *
              </RNText>
              <Block
                color={colors.white}
                radius={12}
                style={{
                  borderWidth: 1,
                  borderColor: errors.name ? '#ef4444' : colors.card,
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
                    fontSize: 16,
                    color: colors.text,
                    padding: sizes.sm,
                    minHeight: 48,
                  }}
                />
              </Block>
              {errors.name ? (
                <RNText
                  style={{
                    fontSize: 12,
                    color: '#ef4444',
                    marginTop: 4,
                  }}
                >
                  {errors.name}
                </RNText>
              ) : null}
            </Block>

            {/* Email Field (Read-only) */}
            <Block marginBottom={sizes.m}>
              <RNText
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: colors.text,
                  marginBottom: sizes.xs,
                }}
              >
                Email
              </RNText>
              <Block
                color={colors.card}
                radius={12}
                style={{
                  borderWidth: 1,
                  borderColor: colors.card,
                }}
              >
                <TextInput
                  value={user?.email || ''}
                  editable={false}
                  style={{
                    fontSize: 16,
                    color: colors.gray,
                    padding: sizes.sm,
                    minHeight: 48,
                  }}
                />
              </Block>
              <RNText
                style={{
                  fontSize: 12,
                  color: colors.gray,
                  marginTop: 4,
                }}
              >
                Email cannot be changed
              </RNText>
            </Block>

            {/* Phone Field */}
            <Block marginBottom={sizes.m}>
              <RNText
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: colors.text,
                  marginBottom: sizes.xs,
                }}
              >
                Phone Number
              </RNText>
              <Block
                color={colors.white}
                radius={12}
                style={{
                  borderWidth: 1,
                  borderColor: errors.phone ? '#ef4444' : colors.card,
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
                    fontSize: 16,
                    color: colors.text,
                    padding: sizes.sm,
                    minHeight: 48,
                  }}
                />
              </Block>
              {errors.phone ? (
                <RNText
                  style={{
                    fontSize: 12,
                    color: '#ef4444',
                    marginTop: 4,
                  }}
                >
                  {errors.phone}
                </RNText>
              ) : null}
            </Block>

            {/* Role Display */}
            <Block marginBottom={sizes.m}>
              <RNText
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: colors.text,
                  marginBottom: sizes.xs,
                }}
              >
                Role
              </RNText>
              <Block
                color={colors.card}
                radius={12}
                padding={sizes.sm}
                style={{
                  borderWidth: 1,
                  borderColor: colors.card,
                  minHeight: 48,
                  justifyContent: 'center',
                }}
              >
                <RNText
                  style={{
                    fontSize: 16,
                    color: colors.gray,
                  }}
                >
                  {userProfile?.role === 'learner' ? 'Learner' : 'Seller'}
                </RNText>
              </Block>
              <RNText
                style={{
                  fontSize: 12,
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
                padding={sizes.sm}
                align="center"
                justify="center"
                style={{
                  minHeight: 50,
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                <RNText
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                    fontWeight: '600',
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
                padding={sizes.sm}
                align="center"
                justify="center"
                style={{
                  minHeight: 50,
                  borderWidth: 1,
                  borderColor: colors.card,
                }}
              >
                <RNText
                  style={{
                    fontSize: 16,
                    color: colors.text,
                    fontWeight: '500',
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
