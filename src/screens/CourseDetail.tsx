import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Text as RNText,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeIn,
  SlideInRight,
  ZoomIn,
} from 'react-native-reanimated';

import { Block, Image } from '../components/';
import { useTheme, useAuth } from '../hooks/';
import { 
  fetchCourseById, 
  expressInterest, 
  checkUserInterest,
  Course,
} from '../services/courses';

const { height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isVerySmallScreen = height < 600;

// Animated components
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type RouteParams = {
  CourseDetail: {
    courseId: string;
  };
};

const CourseDetail = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'CourseDetail'>>();
  const { user, userProfile } = useAuth();
  const { colors, sizes, gradients } = useTheme();
  const insets = useSafeAreaInsets();

  const courseId = route.params?.courseId;

  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInterested, setIsInterested] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Responsive sizing
  const horizontalPadding = isVerySmallScreen ? sizes.sm : isSmallScreen ? sizes.m : sizes.padding;
  const imageHeight = isVerySmallScreen ? 180 : isSmallScreen ? 200 : 220;
  const titleSize = isVerySmallScreen ? 22 : isSmallScreen ? 24 : 26;
  const sectionTitleSize = isVerySmallScreen ? 16 : 18;

  useEffect(() => {
    if (courseId) {
      loadCourse();
      checkInterest();
    }
  }, [courseId]);

  const loadCourse = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const courseData = await fetchCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
      } else {
        setError('Course not found');
      }
    } catch (err) {
      console.error('Error loading course:', err);
      setError('Failed to load course');
    } finally {
      setIsLoading(false);
    }
  };

  const checkInterest = async () => {
    if (!user?.uid || !courseId) return;
    try {
      const interested = await checkUserInterest(user.uid, courseId);
      setIsInterested(interested);
    } catch (err) {
      console.error('Error checking interest:', err);
    }
  };

  const handleExpressInterest = async () => {
    if (!user || !course) {
      Alert.alert('Error', 'Please log in to express interest');
      return;
    }

    if (isInterested) {
      Alert.alert(
        'Already Interested',
        'You have already expressed interest in this course. Our team will contact you soon!'
      );
      return;
    }

    setShowInterestModal(true);
  };

  const submitInterest = async () => {
    if (!user || !course) return;

    // Validate phone number
    const phone = phoneNumber.trim() || userProfile?.phone || '';
    if (!phone) {
      Alert.alert('Phone Required', 'Please enter your phone number so we can contact you.');
      return;
    }

    setIsSubmitting(true);
    try {
      await expressInterest(
        course,
        {
          uid: user.uid,
          email: user.email || '',
          name: userProfile?.name || user.displayName || '',
          phone: phone,
        },
        interestMessage
      );

      setIsInterested(true);
      setShowInterestModal(false);
      setInterestMessage('');
      setPhoneNumber('');

      Alert.alert(
        'Interest Recorded',
        `Thank you for your interest in "${course.title}"!\n\nOur team will review your request and contact you soon with more details about enrollment.`,
        [{ text: 'OK' }]
      );
    } catch (err) {
      console.error('Error expressing interest:', err);
      Alert.alert('Error', 'Failed to submit your interest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `Rs. ${(price * 280).toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <Block safe flex={1} color={colors.light} align="center" justify="center">
        <ActivityIndicator size="large" color={colors.primary} />
        <RNText style={{ marginTop: sizes.sm, color: colors.gray }}>
          Loading course...
        </RNText>
      </Block>
    );
  }

  if (error || !course) {
    return (
      <Block safe flex={1} color={colors.light} align="center" justify="center" paddingHorizontal={sizes.padding}>
        <Block
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: 'rgba(45, 53, 97, 0.1)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: sizes.sm,
          }}
        >
          <RNText style={{ fontSize: 28, color: colors.primary, fontWeight: '600' }}>?</RNText>
        </Block>
        <RNText style={{ fontSize: 18, color: colors.text, textAlign: 'center', marginBottom: sizes.sm }}>
          {error || 'Course not found'}
        </RNText>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <RNText style={{ fontSize: 16, color: colors.primary, fontWeight: '600' }}>
            Go Back
          </RNText>
        </TouchableOpacity>
      </Block>
    );
  }

  return (
    <Block flex={1} color={colors.light}>
      {/* Header */}
      <Block
        row
        align="center"
        justify="space-between"
        paddingHorizontal={horizontalPadding}
        color={colors.primary}
        style={{
          paddingTop: insets.top + (isVerySmallScreen ? sizes.xs : sizes.sm),
          paddingBottom: isVerySmallScreen ? sizes.sm + 10 : sizes.m + 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            width: 40,
            height: 100,
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <RNText
            style={{
              fontSize: 20,
              color: '#FFFFFF',
              fontWeight: '600',
            }}
          >
            ←
          </RNText>
        </TouchableOpacity>
        <RNText
          style={{
            fontSize: isVerySmallScreen ? 16 : 18,
            fontWeight: '700',
            color: '#FFFFFF',
          }}
        >
          Course Details
        </RNText>
        <Block style={{ width: 40 }} />
      </Block>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Course Image */}
        <Animated.View entering={FadeIn.duration(400)}>
          <Block
            style={{
              width: '100%',
              height: imageHeight,
              backgroundColor: colors.card,
              position: 'relative',
            }}
          >
            {course.thumbnail ? (
              <Image
                source={{ uri: course.thumbnail }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Block flex={1} align="center" justify="center" color={colors.card}>
                <Block
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 45,
                    backgroundColor: colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <RNText style={{ fontSize: 40, color: '#FFFFFF', fontWeight: '700' }}>
                    {(course.title || 'C').charAt(0).toUpperCase()}
                  </RNText>
                </Block>
              </Block>
            )}
            
            {/* Gradient overlay at bottom */}
            <Block
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}
            />
            
            {/* Level Badge */}
            <Block
              style={{
                position: 'absolute',
                top: sizes.sm,
                left: sizes.sm,
                backgroundColor: 'rgba(45, 53, 97, 0.95)',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 12,
              }}
            >
              <RNText style={{ fontSize: 11, color: '#FFFFFF', fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {course.level || 'Beginner'}
              </RNText>
            </Block>

            {/* Rating Badge */}
            <Block
              row
              style={{
                position: 'absolute',
              top: sizes.sm,
              right: sizes.sm,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <RNText style={{ fontSize: 14, color: '#f39c12', fontWeight: '700', marginRight: 4 }}>★</RNText>
            <RNText style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '700' }}>
              {(course.rating ?? 0).toFixed(1)}
            </RNText>
          </Block>

          {/* Category Badge at bottom */}
          <Block
            style={{
              position: 'absolute',
              bottom: sizes.sm,
              left: sizes.sm,
              backgroundColor: '#f39c12',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
            }}
          >
            <RNText style={{ fontSize: 11, color: '#FFFFFF', fontWeight: '700' }}>
              {course.category || 'General'}
            </RNText>
          </Block>
        </Block>
        </Animated.View>

        {/* Course Info */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <Block paddingHorizontal={horizontalPadding} paddingTop={sizes.m}>
            {/* Title */}
            <RNText
              style={{
                fontSize: titleSize,
                fontWeight: '800',
                color: colors.text,
                marginBottom: sizes.s,
                lineHeight: titleSize * 1.25,
                letterSpacing: -0.5,
            }}
          >
            {course.title || 'Course'}
          </RNText>

          {/* Short Description */}
          <RNText
            style={{
              fontSize: isVerySmallScreen ? 14 : 15,
              color: colors.gray,
              marginBottom: sizes.m,
              lineHeight: (isVerySmallScreen ? 14 : 15) * 1.6,
            }}
          >
            {course.shortDescription || course.description || 'No description available'}
          </RNText>

          {/* Stats Row - Redesigned */}
          <Block
            row
            color={colors.white}
            radius={16}
            padding={sizes.sm}
            marginBottom={sizes.m}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Block flex={1} align="center" style={{ borderRightWidth: 1, borderRightColor: colors.light }}>
              <RNText style={{ fontSize: 20, fontWeight: '800', color: '#f39c12', marginBottom: 4 }}>
                {(course.rating ?? 0).toFixed(1)}
              </RNText>
              <RNText style={{ fontSize: 11, color: colors.gray }}>Rating</RNText>
            </Block>
            <Block flex={1} align="center" style={{ borderRightWidth: 1, borderRightColor: colors.light }}>
              <RNText style={{ fontSize: 20, fontWeight: '800', color: colors.primary, marginBottom: 4 }}>
                {course.totalStudents ?? 0}
              </RNText>
              <RNText style={{ fontSize: 11, color: colors.gray }}>Interested</RNText>
            </Block>
            <Block flex={1} align="center">
              <RNText style={{ fontSize: 20, fontWeight: '800', color: '#10B981', marginBottom: 4 }}>
                {course.totalLessons ?? 0}
              </RNText>
              <RNText style={{ fontSize: 11, color: colors.gray }}>Lessons</RNText>
            </Block>
          </Block>

          {/* Price Card - Enhanced */}
          <Block
            color={colors.primary}
            radius={20}
            padding={sizes.m}
            marginBottom={sizes.m}
            style={{
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Block row align="center" justify="space-between">
              <Block>
                <RNText style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontWeight: '600' }}>
                  COURSE PRICE
                </RNText>
                <Block row align="center">
                  <RNText
                    style={{
                      fontSize: isVerySmallScreen ? 28 : 32,
                      fontWeight: '800',
                      color: '#FFFFFF',
                    }}
                  >
                    {formatPrice(course.price)}
                  </RNText>
                </Block>
              </Block>
              <Block align="flex-end">
                <Block row align="center" style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                  <RNText style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '600' }}>
                    {course.duration || 'Self-paced'}
                  </RNText>
                </Block>
                <RNText style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                  {course.language || 'English'}
                </RNText>
              </Block>
            </Block>
          </Block>
          </Block>
        </Animated.View>

          {/* Instructor Section - Enhanced */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Block paddingHorizontal={horizontalPadding}>
          <Block marginBottom={sizes.l}>
            <RNText
              style={{
                fontSize: sectionTitleSize,
                fontWeight: '800',
                color: colors.text,
                marginBottom: sizes.sm,
                letterSpacing: -0.3,
              }}
            >
              Meet Your Instructor
            </RNText>
            <Block
              color={colors.white}
              radius={20}
              padding={sizes.m}
              row
              align="center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <Block
                style={{
                  width: isVerySmallScreen ? 60 : 70,
                  height: isVerySmallScreen ? 60 : 70,
                  borderRadius: isVerySmallScreen ? 30 : 35,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: sizes.sm,
                  borderWidth: 3,
                  borderColor: 'rgba(45, 53, 97, 0.1)',
                }}
              >
                {course.instructor?.avatar ? (
                  <Image
                    source={{ uri: course.instructor.avatar }}
                    style={{
                      width: isVerySmallScreen ? 54 : 64,
                      height: isVerySmallScreen ? 54 : 64,
                      borderRadius: isVerySmallScreen ? 27 : 32,
                    }}
                  />
                ) : (
                  <RNText
                    style={{
                      fontSize: isVerySmallScreen ? 24 : 28,
                      color: '#FFFFFF',
                      fontWeight: '700',
                    }}
                  >
                    {(course.instructor?.name || 'I').charAt(0).toUpperCase()}
                  </RNText>
                )}
              </Block>
              <Block flex={1}>
                <RNText
                  style={{
                    fontSize: isVerySmallScreen ? 16 : 18,
                    fontWeight: '700',
                    color: colors.text,
                    marginBottom: 4,
                  }}
                >
                  {course.instructor?.name || 'Instructor'}
                </RNText>
                {course.instructor?.bio && (
                  <RNText
                    style={{
                      fontSize: isVerySmallScreen ? 12 : 13,
                      color: colors.gray,
                      lineHeight: (isVerySmallScreen ? 12 : 13) * 1.5,
                    }}
                    numberOfLines={2}
                  >
                    {course.instructor.bio}
                  </RNText>
                )}
              </Block>
            </Block>
          </Block>

          {/* What You'll Learn - Enhanced */}
          {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
            <Block marginBottom={sizes.l}>
              <RNText
                style={{
                  fontSize: sectionTitleSize,
                  fontWeight: '800',
                  color: colors.text,
                  marginBottom: sizes.sm,
                  letterSpacing: -0.3,
                }}
              >
                What You'll Learn
              </RNText>
              <Block
                color={colors.white}
                radius={20}
                padding={sizes.m}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                {course.whatYouWillLearn.map((item, index) => (
                  <Block key={index} row marginBottom={index < course.whatYouWillLearn.length - 1 ? sizes.sm : 0}>
                    <Block
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: '#10B981',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: sizes.sm,
                        marginTop: 2,
                      }}
                    >
                      <RNText style={{ fontSize: 11, color: '#FFFFFF', fontWeight: '800' }}>✓</RNText>
                    </Block>
                    <RNText
                      style={{
                        flex: 1,
                        fontSize: isVerySmallScreen ? 13 : 14,
                        color: colors.text,
                        lineHeight: (isVerySmallScreen ? 13 : 14) * 1.5,
                      }}
                    >
                      {item}
                    </RNText>
                  </Block>
                ))}
              </Block>
            </Block>
          )}

          {/* Requirements - Enhanced */}
          {course.requirements && course.requirements.length > 0 && (
            <Block marginBottom={sizes.l}>
              <RNText
                style={{
                  fontSize: sectionTitleSize,
                  fontWeight: '800',
                  color: colors.text,
                  marginBottom: sizes.sm,
                  letterSpacing: -0.3,
                }}
              >
                Requirements
              </RNText>
              <Block
                color={colors.white}
                radius={20}
                padding={sizes.m}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 4,
                  borderLeftWidth: 4,
                  borderLeftColor: '#f39c12',
                }}
              >
                {course.requirements.map((item, index) => (
                  <Block key={index} row marginBottom={index < course.requirements.length - 1 ? sizes.sm : 0}>
                    <Block
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#f39c12',
                        marginRight: sizes.sm,
                        marginTop: 7,
                      }}
                    />
                    <RNText
                      style={{
                        flex: 1,
                        fontSize: isVerySmallScreen ? 13 : 14,
                        color: colors.text,
                        lineHeight: (isVerySmallScreen ? 13 : 14) * 1.6,
                      }}
                    >
                      {item}
                    </RNText>
                  </Block>
                ))}
              </Block>
            </Block>
          )}

          {/* Full Description - Enhanced */}
          <Block marginBottom={sizes.l}>
            <RNText
              style={{
                fontSize: sectionTitleSize,
                fontWeight: '800',
                color: colors.text,
                marginBottom: sizes.sm,
                letterSpacing: -0.3,
              }}
            >
              About This Course
            </RNText>
            <Block
              color={colors.white}
              radius={20}
              padding={sizes.m}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <RNText
                style={{
                  fontSize: isVerySmallScreen ? 13 : 14,
                  color: colors.text,
                  lineHeight: (isVerySmallScreen ? 13 : 14) * 1.8,
                }}
              >
                {course.description}
              </RNText>
            </Block>
          </Block>

          {/* Tags - Enhanced */}
          {course.tags && course.tags.length > 0 && (
            <Block marginBottom={sizes.l}>
              <RNText
                style={{
                  fontSize: sectionTitleSize,
                  fontWeight: '800',
                  color: colors.text,
                  marginBottom: sizes.sm,
                  letterSpacing: -0.3,
                }}
              >
                Topics Covered
              </RNText>
              <Block row style={{ flexWrap: 'wrap', gap: 8 }}>
                {course.tags.map((tag, index) => (
                  <Block
                    key={index}
                    style={{
                      backgroundColor: 'rgba(45, 53, 97, 0.08)',
                      borderRadius: 25,
                      paddingHorizontal: sizes.m,
                      paddingVertical: sizes.s,
                      borderWidth: 1,
                      borderColor: 'rgba(45, 53, 97, 0.15)',
                    }}
                  >
                    <RNText
                      style={{
                        fontSize: isVerySmallScreen ? 11 : 12,
                        color: colors.primary,
                        fontWeight: '600',
                      }}
                    >
                      {tag}
                    </RNText>
                  </Block>
                ))}
              </Block>
            </Block>
          )}
          </Block>
        </Animated.View>
      </ScrollView>

      {/* Fixed Bottom CTA - Enhanced */}
      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <Block
          color={colors.white}
          paddingHorizontal={horizontalPadding}
          paddingVertical={sizes.m}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 15,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        >
          <AnimatedTouchable
          activeOpacity={0.85}
          onPress={handleExpressInterest}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={isInterested ? ['#10B981', '#059669'] : ['#2D3561', '#1a2040']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              paddingVertical: isVerySmallScreen ? sizes.sm : sizes.m,
              paddingHorizontal: sizes.m,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: isVerySmallScreen ? 54 : 62,
              shadowColor: isInterested ? '#10B981' : '#2D3561',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <RNText
              style={{
                fontSize: isVerySmallScreen ? 17 : 19,
                fontWeight: '800',
                color: '#FFFFFF',
                letterSpacing: 0.5,
              }}
            >
              {isInterested ? '✓ Interest Submitted' : 'I\'m Interested'}
            </RNText>
            {!isInterested && (
              <RNText
                style={{
                  fontSize: isVerySmallScreen ? 11 : 12,
                  color: 'rgba(255,255,255,0.85)',
                  marginTop: 4,
                  fontWeight: '500',
                }}
              >
                We'll contact you with enrollment details
              </RNText>
            )}
          </LinearGradient>
        </AnimatedTouchable>
      </Block>
      </Animated.View>

      {/* Interest Modal */}
      <Modal
        visible={showInterestModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInterestModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Block
            flex={1}
            justify="flex-end"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <TouchableOpacity 
              style={{ flex: 1 }} 
              activeOpacity={1} 
              onPress={() => setShowInterestModal(false)} 
            />
            <Block
              color={colors.white}
              radius={24}
              style={{
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                paddingBottom: Platform.OS === 'ios' ? 34 : sizes.l,
              }}
            >
              {/* Modal Header */}
              <Block
                row
                align="center"
                justify="space-between"
                paddingHorizontal={sizes.m}
                paddingVertical={sizes.sm}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.light,
                }}
              >
                <Block>
                  <RNText
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: colors.text,
                    }}
                  >
                    Express Interest
                  </RNText>
                  <RNText style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>
                    We'll contact you with enrollment details
                  </RNText>
                </Block>
                <TouchableOpacity 
                  onPress={() => setShowInterestModal(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.light,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <RNText style={{ fontSize: 18, color: colors.gray, fontWeight: '500' }}>x</RNText>
                </TouchableOpacity>
              </Block>

              {/* Modal Content */}
              <ScrollView style={{ maxHeight: height * 0.5 }}>
                <Block padding={sizes.m}>
                  {/* Course Preview */}
                  <Block
                    row
                    color={colors.light}
                    radius={12}
                    padding={sizes.s}
                    marginBottom={sizes.m}
                  >
                    <Image
                      source={{ uri: course?.thumbnail }}
                      style={{ width: 60, height: 45, borderRadius: 8 }}
                    />
                    <Block flex={1} marginLeft={sizes.s}>
                      <RNText style={{ fontSize: 13, fontWeight: '600', color: colors.text }} numberOfLines={2}>
                        {course?.title}
                      </RNText>
                      <RNText style={{ fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 2 }}>
                        Rs. {((course?.price || 0) * 280).toLocaleString()}
                      </RNText>
                    </Block>
                  </Block>

                  {/* Contact Info Section */}
                  <RNText style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: sizes.s }}>
                    Your Contact Information
                  </RNText>

                  {/* Name Display */}
                  <Block
                    color={colors.light}
                    radius={10}
                    padding={sizes.sm}
                    marginBottom={sizes.s}
                  >
                    <RNText style={{ fontSize: 11, color: colors.gray, marginBottom: 2 }}>Name</RNText>
                    <RNText style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>
                      {userProfile?.name || user?.displayName || user?.email?.split('@')[0]}
                    </RNText>
                  </Block>

                  {/* Email Display */}
                  <Block
                    color={colors.light}
                    radius={10}
                    padding={sizes.sm}
                    marginBottom={sizes.s}
                  >
                    <RNText style={{ fontSize: 11, color: colors.gray, marginBottom: 2 }}>Email</RNText>
                    <RNText style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>
                      {user?.email}
                    </RNText>
                  </Block>

                  {/* Phone Input */}
                  <Block marginBottom={sizes.m}>
                    <RNText style={{ fontSize: 11, color: colors.gray, marginBottom: 4 }}>
                      Phone Number <RNText style={{ color: '#e74c3c' }}>*</RNText>
                    </RNText>
                    <Block
                      color={colors.white}
                      radius={10}
                      style={{
                        borderWidth: 1.5,
                        borderColor: phoneNumber || userProfile?.phone ? colors.primary : colors.card,
                      }}
                    >
                      <TextInput
                        value={phoneNumber || userProfile?.phone || ''}
                        onChangeText={setPhoneNumber}
                        placeholder="e.g., 0300-1234567"
                        placeholderTextColor={colors.gray}
                        keyboardType="phone-pad"
                        style={{
                          fontSize: 14,
                          color: colors.text,
                          paddingHorizontal: sizes.sm,
                          paddingVertical: sizes.s,
                          minHeight: 44,
                        }}
                      />
                    </Block>
                    <RNText style={{ fontSize: 10, color: colors.gray, marginTop: 4 }}>
                      We'll use this to contact you about enrollment
                    </RNText>
                  </Block>

                  {/* Optional Message */}
                  <RNText style={{ fontSize: 11, color: colors.gray, marginBottom: 4 }}>
                    Message (Optional)
                  </RNText>
                  <Block
                    color={colors.white}
                    radius={10}
                    style={{
                      borderWidth: 1.5,
                      borderColor: interestMessage ? colors.primary : colors.card,
                      marginBottom: sizes.m,
                    }}
                  >
                    <TextInput
                      value={interestMessage}
                      onChangeText={setInterestMessage}
                      placeholder="Any questions or preferred timing?"
                      placeholderTextColor={colors.gray}
                      multiline
                      numberOfLines={3}
                      style={{
                        fontSize: 14,
                        color: colors.text,
                        padding: sizes.sm,
                        minHeight: 70,
                        textAlignVertical: 'top',
                      }}
                    />
                  </Block>

                  {/* Submit Button */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={submitInterest}
                    disabled={isSubmitting}
                  >
                    <Block
                      color={colors.primary}
                      radius={12}
                      padding={sizes.sm}
                      align="center"
                      style={{
                        opacity: isSubmitting ? 0.6 : 1,
                        minHeight: 52,
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      {isSubmitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <RNText
                          style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: '#FFFFFF',
                          }}
                        >
                          Submit Interest
                        </RNText>
                      )}
                    </Block>
                  </TouchableOpacity>

                  {/* Privacy Note */}
                  <RNText style={{ fontSize: 10, color: colors.gray, textAlign: 'center', marginTop: sizes.s }}>
                    Your information is secure and will only be used to contact you about this course.
                  </RNText>
                </Block>
              </ScrollView>
            </Block>
          </Block>
        </KeyboardAvoidingView>
      </Modal>
    </Block>
  );
};

export default CourseDetail;
