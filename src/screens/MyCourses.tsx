import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text as RNText,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  FadeIn,
  SlideInRight,
} from 'react-native-reanimated';

import { Block, Image } from '../components/';
import { useTheme, useAuth } from '../hooks/';
import { getUserInterests, fetchCourseById, CourseInterest, Course } from '../services/courses';

type RootStackParamList = {
  Home: undefined;
  CourseDetail: { courseId: string };
  MyCourses: undefined;
};

const { height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isVerySmallScreen = height < 600;

// Animated components
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface EnrichedInterest extends CourseInterest {
  course?: Course;
}

const MyCourses = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const { colors, sizes } = useTheme();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'interested' | 'contacted'>('interested');
  const [interests, setInterests] = useState<EnrichedInterest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const horizontalPadding = isVerySmallScreen ? sizes.sm : isSmallScreen ? sizes.m : sizes.padding;
  const titleSize = isVerySmallScreen ? 14 : 16;
  const cardImageHeight = isVerySmallScreen ? 80 : isSmallScreen ? 90 : 100;

  useEffect(() => {
    if (user?.uid) loadInterests();
  }, [user?.uid]);

  const loadInterests = async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    setError(null);
    try {
      const userInterests = await getUserInterests(user.uid);
      const enrichedInterests: EnrichedInterest[] = await Promise.all(
        userInterests.map(async (interest) => {
          try {
            const course = await fetchCourseById(interest.courseId);
            return { ...interest, course: course || undefined };
          } catch {
            return interest;
          }
        })
      );
      setInterests(enrichedInterests);
    } catch (err) {
      console.error('Error loading interests:', err);
      setError('Failed to load your courses');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadInterests();
    setIsRefreshing(false);
  }, [user?.uid]);

  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  const pendingInterests = interests.filter(i => i.status === 'pending');
  const contactedInterests = interests.filter(i => i.status === 'contacted' || i.status === 'enrolled');
  const displayedInterests = activeTab === 'interested' ? pendingInterests : contactedInterests;

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { color: '#f39c12', label: 'Pending Review' };
      case 'contacted': return { color: '#3498db', label: 'Contacted' };
      case 'enrolled': return { color: '#10B981', label: 'Enrolled' };
      case 'declined': return { color: '#e74c3c', label: 'Declined' };
      default: return { color: colors.gray, label: status };
    }
  };

  const renderInterestCard = (interest: EnrichedInterest, index: number) => {
    const statusInfo = getStatusInfo(interest.status);
    const course = interest.course;
    return (
      <Animated.View 
        key={interest.id}
        entering={FadeInDown.delay(index * 80).duration(400).springify()}
      >
        <AnimatedTouchable activeOpacity={0.9} onPress={() => handleCoursePress(interest.courseId)}>
          <Block 
            color={colors.white} 
            radius={20} 
            marginBottom={sizes.m} 
            style={{ 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 4 }, 
              shadowOpacity: 0.08, 
              shadowRadius: 12, 
              elevation: 5, 
              overflow: 'hidden' 
          }}
        >
          <Block row padding={sizes.m}>
            <Block 
              style={{ 
                width: cardImageHeight + 10, 
                height: cardImageHeight + 10, 
                borderRadius: 16, 
                backgroundColor: colors.card, 
                overflow: 'hidden', 
                marginRight: sizes.m,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {course?.thumbnail ? (
                <Image source={{ uri: course.thumbnail }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <LinearGradient 
                  colors={['#2D3561', '#1a2040']}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                  <RNText style={{ fontSize: 32, color: '#FFFFFF', fontWeight: '700' }}>{(course?.title || interest.courseName || '?').charAt(0).toUpperCase()}</RNText>
                </LinearGradient>
              )}
            </Block>
            <Block flex={1} justify="space-between">
              <Block>
                <RNText 
                  style={{ 
                    fontSize: titleSize + 1, 
                    fontWeight: '700', 
                    color: colors.text, 
                    marginBottom: 6, 
                    lineHeight: (titleSize + 1) * 1.3,
                    letterSpacing: -0.3,
                  }} 
                  numberOfLines={2}
                >
                  {course?.title || interest.courseName}
                </RNText>
                {course?.instructor?.name && (
                  <RNText style={{ fontSize: isVerySmallScreen ? 12 : 13, color: colors.gray, marginBottom: 8 }} numberOfLines={1}>
                    by {course.instructor.name}
                  </RNText>
                )}
              </Block>
              <Block row align="center" justify="space-between">
                <Block 
                  style={{ 
                    backgroundColor: String(statusInfo.color) + '18', 
                    paddingHorizontal: 12, 
                    paddingVertical: 6, 
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: String(statusInfo.color) + '30',
                  }}
                >
                  <RNText style={{ fontSize: 11, fontWeight: '700', color: statusInfo.color }}>{statusInfo.label}</RNText>
                </Block>
                <RNText style={{ fontSize: 11, color: colors.gray, fontWeight: '500' }}>{formatDate(interest.createdAt)}</RNText>
              </Block>
            </Block>
          </Block>
          {course && (
            <Block 
              row 
              align="center" 
              justify="space-between" 
              paddingHorizontal={sizes.m} 
              paddingVertical={sizes.sm}
              style={{ 
                borderTopWidth: 1, 
                borderTopColor: 'rgba(0,0,0,0.05)',
                backgroundColor: 'rgba(45, 53, 97, 0.02)',
              }}
            >
              <Block row align="center">
                <Block 
                  row 
                  align="center" 
                  style={{ 
                    backgroundColor: '#f39c12' + '15', 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 8,
                    marginRight: sizes.sm,
                  }}
                >
                  <RNText style={{ fontSize: 11, color: '#f39c12', fontWeight: '700' }}>★ {course.rating?.toFixed(1) || 'N/A'}</RNText>
                </Block>
                <Block 
                  style={{ 
                    backgroundColor: 'rgba(45, 53, 97, 0.1)', 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 8,
                  }}
                >
                  <RNText style={{ fontSize: 11, color: colors.primary, fontWeight: '600' }}>{course.level || 'Beginner'}</RNText>
                </Block>
              </Block>
              <RNText style={{ fontSize: 15, fontWeight: '800', color: colors.primary }}>{course.price === 0 ? 'Free' : 'Rs. ' + ((course.price ?? 0) * 280).toLocaleString()}</RNText>
            </Block>
          )}
        </Block>
      </AnimatedTouchable>
      </Animated.View>
    );
  };

  if (isLoading && !isRefreshing) {
    return (
      <Block safe flex={1} color={colors.light} align="center" justify="center">
        <ActivityIndicator size="large" color={colors.primary} />
        <RNText style={{ marginTop: sizes.sm, color: colors.gray }}>Loading your courses...</RNText>
      </Block>
    );
  }

  return (
    <Block flex={1} color={colors.light}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: sizes.xxl }} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        {/* Enhanced Header */}
        <LinearGradient
          colors={['#2D3561', '#1a2040']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: horizontalPadding,
            paddingTop: insets.top + (isVerySmallScreen ? sizes.sm : sizes.m),
            paddingBottom: sizes.l,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <Block row align="center" marginBottom={sizes.m}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
              style={{ 
                marginRight: sizes.sm,
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.15)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <RNText style={{ fontSize: isVerySmallScreen ? 18 : 20, color: '#FFFFFF', fontWeight: '600' }}>{'←'}</RNText>
            </TouchableOpacity>
            <Block>
              <RNText style={{ fontSize: isVerySmallScreen ? 24 : 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 }}>My Courses</RNText>
              <RNText style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Track your learning journey</RNText>
            </Block>
          </Block>
          
          {/* Premium Tab Switcher */}
          <Block 
            row 
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 16,
              padding: 4,
            }}
          >
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setActiveTab('interested')} activeOpacity={0.8}>
              <Block 
                color={activeTab === 'interested' ? colors.white : 'transparent'} 
                radius={12} 
                paddingVertical={sizes.sm}
                align="center" 
                style={activeTab === 'interested' ? { 
                  shadowColor: '#000', 
                  shadowOffset: { width: 0, height: 2 }, 
                  shadowOpacity: 0.15, 
                  shadowRadius: 6, 
                  elevation: 4 
                } : {}}
              >
                <RNText style={{ 
                  fontSize: isVerySmallScreen ? 13 : 14, 
                  fontWeight: activeTab === 'interested' ? '700' : '500', 
                  color: activeTab === 'interested' ? colors.primary : 'rgba(255,255,255,0.8)',
                }}>
                  Interested ({pendingInterests.length})
                </RNText>
              </Block>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setActiveTab('contacted')} activeOpacity={0.8}>
              <Block 
                color={activeTab === 'contacted' ? colors.white : 'transparent'} 
                radius={12} 
                paddingVertical={sizes.sm}
                align="center" 
                style={activeTab === 'contacted' ? { 
                  shadowColor: '#000', 
                  shadowOffset: { width: 0, height: 2 }, 
                  shadowOpacity: 0.15, 
                  shadowRadius: 6, 
                  elevation: 4 
                } : {}}
              >
                <RNText style={{ 
                  fontSize: isVerySmallScreen ? 13 : 14, 
                  fontWeight: activeTab === 'contacted' ? '700' : '500', 
                  color: activeTab === 'contacted' ? colors.primary : 'rgba(255,255,255,0.8)',
                }}>
                  In Progress ({contactedInterests.length})
                </RNText>
              </Block>
            </TouchableOpacity>
          </Block>
        </LinearGradient>

        <Block paddingHorizontal={horizontalPadding} paddingTop={sizes.m}>
          {/* Info Banner */}
          <Block 
            radius={16} 
            padding={sizes.m} 
            marginBottom={sizes.m} 
            row 
            align="center"
            style={{
              backgroundColor: 'rgba(45, 53, 97, 0.06)',
              borderWidth: 1,
              borderColor: 'rgba(45, 53, 97, 0.1)',
            }}
          >
            <Block 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 12, 
                backgroundColor: colors.primary, 
                justifyContent: 'center', 
                alignItems: 'center', 
                marginRight: sizes.sm,
              }}
            >
              <RNText style={{ fontSize: 16, color: '#FFFFFF', fontWeight: '700' }}>i</RNText>
            </Block>
            <Block flex={1}>
              <RNText style={{ fontSize: isVerySmallScreen ? 12 : 13, color: colors.text, lineHeight: (isVerySmallScreen ? 12 : 13) * 1.6, fontWeight: '500' }}>
                {activeTab === 'interested' ? 'Courses you have expressed interest in. Our team will review and contact you soon.' : 'Courses where you have been contacted or enrolled.'}
              </RNText>
            </Block>
          </Block>

          {error && (
            <Block color="#fee2e2" radius={12} padding={sizes.sm} marginBottom={sizes.m} align="center">
              <RNText style={{ fontSize: 14, color: '#dc2626', textAlign: 'center' }}>{error}</RNText>
              <TouchableOpacity onPress={loadInterests} style={{ marginTop: sizes.s }}>
                <RNText style={{ fontSize: 14, color: colors.primary, fontWeight: '600' }}>Try Again</RNText>
              </TouchableOpacity>
            </Block>
          )}

          {displayedInterests.length > 0 ? (
            displayedInterests.map((interest, index) => renderInterestCard(interest, index))
          ) : (
            <Block 
              color={colors.white} 
              radius={24} 
              padding={sizes.xl} 
              align="center" 
              style={{ 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 4 }, 
                shadowOpacity: 0.08, 
                shadowRadius: 12, 
                elevation: 5 
              }}
            >
              <Block 
                style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 40, 
                  backgroundColor: 'rgba(45, 53, 97, 0.08)', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  marginBottom: sizes.m 
                }}
              >
                <LinearGradient 
                  colors={['#2D3561', '#1a2040']}
                  style={{ 
                    width: 50, 
                    height: 50, 
                    borderRadius: 25, 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                  }}
                >
                  <RNText style={{ fontSize: 24, color: '#FFFFFF', fontWeight: '700' }}>{activeTab === 'interested' ? '📚' : '🚀'}</RNText>
                </LinearGradient>
              </Block>
              <RNText style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: sizes.xs, textAlign: 'center', letterSpacing: -0.3 }}>
                {activeTab === 'interested' ? 'No Interests Yet' : 'No Courses In Progress'}
              </RNText>
              <RNText style={{ fontSize: 14, color: colors.gray, textAlign: 'center', lineHeight: 22, marginBottom: sizes.l }}>
                {activeTab === 'interested' ? 'Browse our courses and express interest to get started!' : 'Once you are contacted about a course, it will appear here.'}
              </RNText>
              {activeTab === 'interested' && (
                <TouchableOpacity onPress={() => navigation.navigate('Home' as never)} activeOpacity={0.85}>
                  <LinearGradient
                    colors={['#2D3561', '#1a2040']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 14,
                      paddingHorizontal: sizes.xl,
                      paddingVertical: sizes.sm,
                      shadowColor: '#2D3561',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <RNText style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 }}>Browse Courses</RNText>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </Block>
          )}
        </Block>
      </ScrollView>
    </Block>
  );
};

export default MyCourses;
