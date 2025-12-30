import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text as RNText,
  View,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { Block, Image } from '../components/';
import { useTheme, useAuth } from '../hooks/';

const { height } = Dimensions.get('window');
const isSmallScreen = height < 700;

const MyCourses = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { assets, colors, sizes } = useTheme();
  const [activeTab, setActiveTab] = useState<'enrolled' | 'completed'>('enrolled');

  const horizontalPadding = isSmallScreen ? sizes.sm : sizes.padding;

  // Mock data - replace with real data from Firebase/API
  const enrolledCourses = [
    {
      id: 1,
      title: 'Complete React Native Course',
      instructor: 'Dr. Sarah Johnson',
      progress: 45,
      image: assets.card1,
      totalLessons: 120,
      completedLessons: 54,
      lastAccessed: '2 hours ago',
    },
    {
      id: 2,
      title: 'AI & Machine Learning Fundamentals',
      instructor: 'Prof. Michael Chen',
      progress: 20,
      image: assets.card2,
      totalLessons: 85,
      completedLessons: 17,
      lastAccessed: '1 day ago',
    },
  ];

  const completedCourses = [
    {
      id: 3,
      title: 'Introduction to JavaScript',
      instructor: 'John Doe',
      completedDate: 'Dec 15, 2025',
      image: assets.card3,
      rating: 5,
      certificateUrl: '#',
    },
  ];

  const activeCourses = activeTab === 'enrolled' ? enrolledCourses : completedCourses;

  return (
    <Block safe flex={1} color={colors.light}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.xxl }}
      >
        {/* Header */}
        <Block
          paddingHorizontal={horizontalPadding}
          paddingTop={sizes.l}
          paddingBottom={sizes.m}
          color={colors.card}
        >
          <Block row align="center" marginBottom={sizes.m}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginRight: sizes.m }}
            >
              <RNText
                style={{
                  fontSize: 24,
                  color: colors.primary,
                }}
              >
                ‹
              </RNText>
            </TouchableOpacity>

            <RNText
              style={{
                fontSize: 24,
                fontWeight: '600',
                color: colors.text,
              }}
            >
              My Courses
            </RNText>
          </Block>

          {/* Tabs */}
          <Block row>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('enrolled')}
              style={{ flex: 1 }}
            >
              <Block
                align="center"
                paddingVertical={sizes.s}
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: activeTab === 'enrolled' ? colors.primary : 'transparent',
                }}
              >
                <RNText
                  style={{
                    fontSize: 16,
                    fontWeight: activeTab === 'enrolled' ? '600' : '400',
                    color: activeTab === 'enrolled' ? colors.primary : colors.gray,
                  }}
                >
                  Enrolled ({enrolledCourses.length})
                </RNText>
              </Block>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('completed')}
              style={{ flex: 1 }}
            >
              <Block
                align="center"
                paddingVertical={sizes.s}
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: activeTab === 'completed' ? colors.primary : 'transparent',
                }}
              >
                <RNText
                  style={{
                    fontSize: 16,
                    fontWeight: activeTab === 'completed' ? '600' : '400',
                    color: activeTab === 'completed' ? colors.primary : colors.gray,
                  }}
                >
                  Completed ({completedCourses.length})
                </RNText>
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>

        {/* Course List */}
        <Block paddingHorizontal={horizontalPadding} marginTop={sizes.m}>
          {activeCourses.length === 0 ? (
            <Block
              align="center"
              justify="center"
              padding={sizes.xl}
              color={colors.white}
              radius={16}
              marginTop={sizes.xxl}
            >
              <RNText
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: sizes.s,
                }}
              >
                No {activeTab} courses
              </RNText>
              <RNText
                style={{
                  fontSize: 14,
                  color: colors.gray,
                  textAlign: 'center',
                }}
              >
                {activeTab === 'enrolled'
                  ? 'Browse courses and start learning today!'
                  : 'Complete your first course to see it here.'}
              </RNText>
            </Block>
          ) : (
            activeCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                activeOpacity={0.8}
                onPress={() => console.log('Open course:', course.title)}
              >
                <Block
                  color={colors.white}
                  radius={16}
                  marginBottom={sizes.m}
                  style={{
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <Block row>
                    {/* Course Image */}
                    <Image
                      source={course.image}
                      style={{
                        width: 120,
                        height: 120,
                        borderTopLeftRadius: 16,
                        borderBottomLeftRadius: 16,
                      }}
                      resizeMode="cover"
                    />

                    {/* Course Info */}
                    <Block flex={1} padding={sizes.sm} justify="space-between">
                      <Block>
                        <RNText
                          style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: colors.text,
                            marginBottom: 4,
                          }}
                          numberOfLines={2}
                        >
                          {course.title}
                        </RNText>
                        <RNText
                          style={{
                            fontSize: 13,
                            color: colors.gray,
                            marginBottom: sizes.xs,
                          }}
                        >
                          {course.instructor}
                        </RNText>
                      </Block>

                      {activeTab === 'enrolled' && 'progress' in course ? (
                        <Block>
                          {/* Progress Bar */}
                          <Block marginBottom={4}>
                            <Block
                              style={{
                                height: 6,
                                backgroundColor: colors.card,
                                borderRadius: 3,
                                overflow: 'hidden',
                              }}
                            >
                              <Block
                                style={{
                                  width: `${course.progress}%`,
                                  height: '100%',
                                  backgroundColor: colors.primary,
                                }}
                              />
                            </Block>
                          </Block>

                          {/* Progress Text */}
                          <Block row justify="space-between">
                            <RNText
                              style={{
                                fontSize: 12,
                                color: colors.gray,
                              }}
                            >
                              {course.completedLessons}/{course.totalLessons} lessons
                            </RNText>
                            <RNText
                              style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: colors.primary,
                              }}
                            >
                              {course.progress}%
                            </RNText>
                          </Block>
                        </Block>
                      ) : (
                        'completedDate' in course && (
                          <Block>
                            <RNText
                              style={{
                                fontSize: 12,
                                color: colors.success,
                                fontWeight: '500',
                                marginBottom: 4,
                              }}
                            >
                              ✓ Completed on {course.completedDate}
                            </RNText>
                            <TouchableOpacity
                              onPress={() => console.log('View certificate')}
                            >
                              <RNText
                                style={{
                                  fontSize: 13,
                                  color: colors.primary,
                                  fontWeight: '500',
                                }}
                              >
                                View Certificate →
                              </RNText>
                            </TouchableOpacity>
                          </Block>
                        )
                      )}
                    </Block>
                  </Block>

                  {/* Continue Button for Enrolled */}
                  {activeTab === 'enrolled' && (
                    <Block
                      paddingHorizontal={sizes.sm}
                      paddingBottom={sizes.sm}
                    >
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => console.log('Continue learning:', course.title)}
                      >
                        <Block
                          color={colors.primary}
                          radius={10}
                          padding={sizes.s}
                          align="center"
                          style={{
                            minHeight: 40,
                            justifyContent: 'center',
                          }}
                        >
                          <RNText
                            style={{
                              fontSize: 14,
                              color: '#FFFFFF',
                              fontWeight: '600',
                            }}
                          >
                            Continue Learning
                          </RNText>
                        </Block>
                      </TouchableOpacity>
                    </Block>
                  )}
                </Block>
              </TouchableOpacity>
            ))
          )}
        </Block>

        {/* Summary Stats */}
        {activeCourses.length > 0 && (
          <Block paddingHorizontal={horizontalPadding} marginTop={sizes.l}>
            <Block
              color={colors.white}
              radius={16}
              padding={sizes.m}
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <RNText
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: sizes.sm,
                }}
              >
                {activeTab === 'enrolled' ? 'Learning Stats' : 'Achievements'}
              </RNText>

              <Block row justify="space-around" marginTop={sizes.s}>
                <Block align="center">
                  <RNText
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: colors.primary,
                    }}
                  >
                    {activeTab === 'enrolled' ? enrolledCourses.length : completedCourses.length}
                  </RNText>
                  <RNText
                    style={{
                      fontSize: 12,
                      color: colors.gray,
                      marginTop: 4,
                    }}
                  >
                    {activeTab === 'enrolled' ? 'Active' : 'Completed'}
                  </RNText>
                </Block>

                <View style={{ width: 1, backgroundColor: colors.card }} />

                <Block align="center">
                  <RNText
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: colors.primary,
                    }}
                  >
                    {activeTab === 'enrolled'
                      ? Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / enrolledCourses.length)
                      : completedCourses.length}
                  </RNText>
                  <RNText
                    style={{
                      fontSize: 12,
                      color: colors.gray,
                      marginTop: 4,
                    }}
                  >
                    {activeTab === 'enrolled' ? 'Avg Progress' : 'Certificates'}
                  </RNText>
                </Block>

                <View style={{ width: 1, backgroundColor: colors.card }} />

                <Block align="center">
                  <RNText
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: colors.primary,
                    }}
                  >
                    {activeTab === 'enrolled'
                      ? enrolledCourses.reduce((acc, c) => acc + c.totalLessons, 0)
                      : completedCourses.reduce((acc, c) => acc + (c.rating || 0), 0)}
                  </RNText>
                  <RNText
                    style={{
                      fontSize: 12,
                      color: colors.gray,
                      marginTop: 4,
                    }}
                  >
                    {activeTab === 'enrolled' ? 'Total Lessons' : 'Total Rating'}
                  </RNText>
                </Block>
              </Block>
            </Block>
          </Block>
        )}
      </ScrollView>
    </Block>
  );
};

export default MyCourses;
