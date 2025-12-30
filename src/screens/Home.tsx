import React, { useState } from 'react';
import {
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  Text as RNText,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme, useAuth } from '../hooks/';
import { Block, Button, Image, Input, Text } from '../components/';

const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
const isSmallScreen = height < 700;

const Home = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { assets, colors, sizes, gradients } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Responsive padding
  const horizontalPadding = isSmallScreen ? sizes.sm : sizes.padding;

  // Category data
  const categories = [
    { id: 'all', name: 'All', icon: '📚' },
    { id: 'development', name: 'Development', icon: '💻' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'marketing', name: 'Marketing', icon: '📈' },
  ];

  // Featured courses
  const featuredCourses = [
    {
      id: 1,
      title: 'Complete React Native Course',
      instructor: 'Dr. Sarah Johnson',
      rating: 4.8,
      students: '12,450',
      price: '$89.99',
      image: assets.card1,
      category: 'development',
      progress: 0,
    },
    {
      id: 2,
      title: 'AI & Machine Learning Masterclass',
      instructor: 'Prof. Michael Chen',
      rating: 4.9,
      students: '8,920',
      price: '$99.99',
      image: assets.card2,
      category: 'development',
      progress: 0,
    },
    {
      id: 3,
      title: 'Business Strategy Fundamentals',
      instructor: 'Emily Roberts',
      rating: 4.7,
      students: '15,680',
      price: '$79.99',
      image: assets.card3,
      category: 'business',
      progress: 0,
    },
    {
      id: 4,
      title: 'UI/UX Design Principles',
      instructor: 'David Martinez',
      rating: 4.9,
      students: '10,230',
      price: '$84.99',
      image: assets.card4,
      category: 'design',
      progress: 0,
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Block safe flex={1} color={colors.light}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: sizes.xxl }}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header Section */}
        <Block
          gradient={gradients.primary}
          paddingHorizontal={horizontalPadding}
          paddingTop={sizes.l}
          paddingBottom={sizes.xl}
        >
          {/* Welcome Text */}
          <Block marginBottom={sizes.l}>
            <RNText
              style={{
                fontSize: 16,
                color: '#FFFFFF',
                opacity: 0.9,
                marginBottom: 4,
              }}
            >
              Welcome back,
            </RNText>
            <RNText
              style={{
                fontSize: 28,
                color: '#FFFFFF',
                fontWeight: 'bold',
                letterSpacing: 0.5,
              }}
            >
              {user?.displayName || 'Learner'}! 👋
            </RNText>
          </Block>

          {/* Search Bar */}
          <Block
            color={colors.white}
            radius={16}
            padding={sizes.sm}
            row
            align="center"
            style={{
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <RNText style={{ fontSize: 18, marginRight: sizes.s }}>🔍</RNText>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for courses..."
              placeholderTextColor={colors.gray}
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
              style={{
                flex: 1,
                fontSize: 16,
                color: colors.text,
                paddingVertical: Platform.OS === 'ios' ? 6 : 4,
                minHeight: 2, // Ensures proper touch target
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <RNText style={{ fontSize: 18, color: colors.gray }}>✕</RNText>
              </TouchableOpacity>
            )}
          </Block>
        </Block>

        {/* Categories Section */}
        <Block paddingHorizontal={horizontalPadding} marginTop={-sizes.l}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: horizontalPadding }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <Block
                  color={selectedCategory === category.id ? colors.primary : colors.white}
                  radius={20}
                  paddingHorizontal={sizes.m}
                  paddingVertical={sizes.s}
                  marginRight={sizes.sm}
                  style={{
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 8,
                    elevation: 3,
                    minHeight: 44, // Proper touch target size
                    justifyContent: 'center',
                  }}
                >
                  <RNText
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: selectedCategory === category.id ? '#FFFFFF' : colors.text,
                    }}
                  >
                    {category.icon} {category.name}
                  </RNText>
                </Block>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Block>

        {/* Continue Learning Section */}
        <Block paddingHorizontal={horizontalPadding} marginTop={sizes.l}>
          <Block row justify="space-between" align="center" marginBottom={sizes.m}>
            <RNText
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: colors.text,
              }}
            >
              Featured Courses
            </RNText>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => {
                // TODO: Navigate to all courses
                console.log('See all courses');
              }}
            >
              <RNText
                style={{
                  fontSize: 14,
                  color: colors.primary,
                  fontWeight: '600',
                }}
              >
                See All →
              </RNText>
            </TouchableOpacity>
          </Block>

          {/* Course Cards */}
          {featuredCourses.map((course) => (
            <TouchableOpacity 
              key={course.id}
              activeOpacity={0.8}
              onPress={() => {
                // TODO: Navigate to course details
                console.log('Course pressed:', course.id);
              }}
            >
              <Block
                color={colors.white}
                radius={16}
                marginBottom={sizes.m}
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                {/* Course Image */}
                <Image
                  source={course.image}
                  style={{
                    width: '100%',
                    height: 180,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    backgroundColor: colors.card, // Placeholder color while loading
                  }}
                  resizeMode="cover"
                />

                {/* Course Info */}
                <Block padding={sizes.sm}>
                  <RNText
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: colors.text,
                      marginBottom: sizes.xs,
                    }}
                    numberOfLines={2}
                  >
                    {course.title}
                  </RNText>

                  <RNText
                    style={{
                      fontSize: 14,
                      color: colors.gray,
                      marginBottom: sizes.s,
                    }}
                  >
                    {course.instructor}
                  </RNText>

                  {/* Rating and Students */}
                  <Block row align="center" marginBottom={sizes.s}>
                    <RNText style={{ fontSize: 14, fontWeight: 'bold', color: '#f39c12', marginRight: 4 }}>
                      ⭐ {course.rating}
                    </RNText>
                    <RNText style={{ fontSize: 13, color: colors.gray, marginRight: sizes.sm }}>
                      ({course.students} students)
                    </RNText>
                  </Block>

                  {/* Price and Action */}
                  <Block row justify="space-between" align="center">
                    <RNText
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: colors.primary,
                      }}
                    >
                      {course.price}
                    </RNText>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        // TODO: Handle course enrollment
                        console.log('Enroll in:', course.title);
                      }}
                      style={{
                        paddingHorizontal: sizes.m,
                        paddingVertical: sizes.s,
                        borderRadius: 12,
                        backgroundColor: colors.primary,
                        minHeight: 44, // Proper touch target
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <RNText
                        style={{
                          color: '#FFFFFF',
                          fontSize: 14,
                          fontWeight: '600',
                        }}
                      >
                        Enroll Now
                      </RNText>
                    </TouchableOpacity>
                  </Block>
                </Block>
              </Block>
            </TouchableOpacity>
          ))}
        </Block>

        {/* Stats Section */}
        <Block paddingHorizontal={horizontalPadding} marginTop={sizes.l} marginBottom={sizes.l}>
          <Block
            gradient={gradients.primary}
            radius={20}
            padding={sizes.l}
            style={{
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <RNText
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: sizes.m,
              }}
            >
              Your Learning Stats
            </RNText>

            <Block row justify="space-between">
              <Block align="center" flex={1}>
                <RNText
                  style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                  }}
                >
                  0
                </RNText>
                <RNText
                  style={{
                    fontSize: 14,
                    color: '#FFFFFF',
                    opacity: 0.9,
                    marginTop: 4,
                  }}
                >
                  Courses
                </RNText>
              </Block>

              <Block align="center" flex={1}>
                <RNText
                  style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                  }}
                >
                  0h
                </RNText>
                <RNText
                  style={{
                    fontSize: 14,
                    color: '#FFFFFF',
                    opacity: 0.9,
                    marginTop: 4,
                  }}
                >
                  Learning Time
                </RNText>
              </Block>

              <Block align="center" flex={1}>
                <RNText
                  style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                  }}
                >
                  0
                </RNText>
                <RNText
                  style={{
                    fontSize: 14,
                    color: '#FFFFFF',
                    opacity: 0.9,
                    marginTop: 4,
                  }}
                >
                  Certificates
                </RNText>
              </Block>
            </Block>
          </Block>
        </Block>
      </ScrollView>
    </Block>
    </TouchableWithoutFeedback>
  );
};

export default Home;
