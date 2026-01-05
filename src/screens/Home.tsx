import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  Text as RNText,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import { useTheme, useAuth } from '../hooks/';
import { Block, Image } from '../components/';
import {
  fetchAllCourses,
  fetchCoursesByCategory,
  searchCourses,
  fetchCategories,
  Course,
  Category,
} from '../services/courses';

type RootStackParamList = {
  Home: undefined;
  CourseDetail: { courseId: string };
  Profile: undefined;
};

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isVerySmallScreen = height < 600;

const CATEGORY_COLORS: { [key: string]: string } = {
  all: '#6366f1',
  development: '#3b82f6',
  business: '#10b981',
  design: '#8b5cf6',
  marketing: '#f59e0b',
  default: '#6366f1',
};

const getCategoryColor = (categoryId: string): string => {
  return CATEGORY_COLORS[categoryId.toLowerCase()] || CATEGORY_COLORS.default;
};

// Animated TouchableOpacity for scale effects
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Home = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const { colors, sizes } = useTheme();
  const insets = useSafeAreaInsets();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const horizontalPadding = isVerySmallScreen ? sizes.sm : isSmallScreen ? sizes.m : sizes.padding;
  const headerTitleSize = isVerySmallScreen ? 22 : isSmallScreen ? 24 : 28;
  const sectionTitleSize = isVerySmallScreen ? 16 : 18;
  const cardWidth = isVerySmallScreen ? width * 0.72 : isSmallScreen ? width * 0.75 : width * 0.78;
  const cardImageHeight = isVerySmallScreen ? 110 : isSmallScreen ? 125 : 140;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [coursesData, categoriesData] = await Promise.all([
        fetchAllCourses(),
        fetchCategories(),
      ]);
      setCourses(coursesData);
      // Filter out any "all" category and remove duplicates
      const seenIds = new Set<string>(['all']);
      const filteredCategories = categoriesData.filter(c => {
        if (seenIds.has(c.id)) return false;
        seenIds.add(c.id);
        return true;
      });
      const allCategory: Category = {
        id: 'all',
        name: 'All',
        description: 'All courses',
        coursesCount: coursesData.length,
        isActive: true,
      };
      setCategories([allCategory, ...filteredCategories]);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  }, []);

  const handleCategorySelect = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setIsLoading(true);
    try {
      if (categoryId === 'all') {
        const allCourses = await fetchAllCourses();
        setCourses(allCourses);
      } else {
        const categoryName = categories.find(c => c.id === categoryId)?.name || categoryId;
        const filteredCourses = await fetchCoursesByCategory(categoryName);
        setCourses(filteredCourses);
      }
    } catch (err) {
      console.error('Error filtering courses:', err);
      setError('Failed to filter courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      handleCategorySelect(selectedCategory);
      return;
    }
    if (query.trim().length < 2) return;
    setIsSearching(true);
    try {
      const results = await searchCourses(query);
      setCourses(results);
    } catch (err) {
      console.error('Error searching:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return 'Rs. ' + (price * 280).toLocaleString();
  };

  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Learner';
  };

  const renderCourseCard = (course: Course, index: number) => (
    <Animated.View
      key={course.id}
      entering={FadeInRight.delay(index * 100).duration(400).springify()}
    >
      <AnimatedTouchable
        activeOpacity={0.9}
        onPress={() => handleCoursePress(course.id)}
        style={{ marginRight: sizes.m }}
      >
        <Block
          style={{
            width: cardWidth,
            backgroundColor: colors.white,
            borderRadius: 16,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          {/* Course Thumbnail */}
          <Block style={{ height: cardImageHeight, backgroundColor: '#f0f0f0', position: 'relative' }}>
            {course.thumbnail ? (
              <Image
                source={{ uri: course.thumbnail }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Block flex={1} align="center" justify="center" style={{ backgroundColor: colors.primary }}>
                <RNText style={{ fontSize: 36, color: '#FFFFFF', fontWeight: '700' }}>
                  {(course.title || 'C').charAt(0).toUpperCase()}
                </RNText>
              </Block>
            )}

            {/* Rating Badge - Top Right */}
            <Block
              row
              align="center"
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <RNText style={{ fontSize: 11, color: '#FFD700', fontWeight: '700', marginRight: 3 }}>★</RNText>
              <RNText style={{ fontSize: 11, color: '#FFFFFF', fontWeight: '600' }}>
                {course.rating?.toFixed(1) || '0.0'}
              </RNText>
            </Block>
          </Block>

          {/* Course Content */}
          <Block padding={sizes.sm}>
            {/* Category Tag */}
            <Block
              style={{
                alignSelf: 'flex-start',
                backgroundColor: getCategoryColor((course.category || 'general').toLowerCase().replace(/\s+/g, '-')) + '15',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              <RNText style={{
                fontSize: 10,
                color: getCategoryColor((course.category || 'general').toLowerCase().replace(/\s+/g, '-')),
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                {course.category || 'General'}
              </RNText>
            </Block>

            {/* Title */}
            <RNText
              style={{
                fontSize: isVerySmallScreen ? 14 : 15,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 8,
                lineHeight: (isVerySmallScreen ? 14 : 15) * 1.4,
              }}
              numberOfLines={2}
            >
              {course.title || 'Untitled Course'}
            </RNText>

            {/* Instructor */}
            <Block row align="center" marginBottom={10}>
              <Block
                style={{
                  width: 10,
                  height: 20,
                  borderRadius: 20,
                  backgroundColor: 'rgba(45, 53, 97, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 6,
                }}
              >
                <RNText style={{ fontSize: 10, fontWeight: '700', color: colors.primary }}>
                  {(course.instructor?.name || 'U').charAt(0)}
                </RNText>
              </Block>
              <RNText
                style={{ fontSize: 12, color: colors.gray, flex: 1 }}
                numberOfLines={1}
              >
                {course.instructor?.name || 'Unknown'}
              </RNText>
            </Block>

            {/* Divider */}
            <Block style={{ height: 1, backgroundColor: '#f0f0f0', marginBottom: 10 }} />

            {/* Price & Info Row */}
            <Block row align="center" justify="space-between">
              <Block>
                <RNText style={{ fontSize: isVerySmallScreen ? 16 : 18, fontWeight: '800', color: colors.primary }}>
                  {formatPrice(course.price)}
                </RNText>
              </Block>
              <Block row align="center">

                <Block
                  style={{
                    backgroundColor: 'rgba(45, 53, 97, 0.08)',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 4,
                  }}
                >
                  <RNText style={{ fontSize: 10, color: colors.primary, fontWeight: '600' }}>
                    {course.level || 'Beginner'}
                  </RNText>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </AnimatedTouchable>
    </Animated.View>
  );

  if (isLoading && !isRefreshing && courses.length === 0) {
    return (
      <Block safe flex={1} color={colors.light} align="center" justify="center">
        <ActivityIndicator size="large" color={colors.primary} />
        <RNText style={{ marginTop: sizes.sm, color: colors.gray }}>Loading courses...</RNText>
      </Block>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Block flex={1} color={colors.light}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: sizes.xxl }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
          }
        >
          <Animated.View entering={FadeInDown.duration(500)}>
            <Block
              paddingHorizontal={horizontalPadding}
              paddingBottom={sizes.l}
              style={{
                paddingTop: insets.top + (isVerySmallScreen ? sizes.sm : sizes.m),
                backgroundColor: colors.primary,
                borderBottomLeftRadius: 28,
                borderBottomRightRadius: 28,
              }}
            >
              <Block marginBottom={sizes.m}>
                <RNText style={{ fontSize: isVerySmallScreen ? 13 : 14, color: 'rgba(255,255,255,0.7)', marginBottom: 4, fontWeight: '500' }}>
                  Welcome back,
                </RNText>
                <RNText style={{ fontSize: headerTitleSize, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 }}>
                  {getDisplayName()}
                </RNText>
              </Block>
              <Block
                row
                align="center"
                color={'rgba(255,255,255,0.15)'}
                radius={8}
                paddingVertical={Platform.OS === 'ios' ? sizes.s : 4}
                style={{ borderWidth: 1, borderColor: searchQuery ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)' }}
              >
                <RNText style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', margin: 10, marginLeft: sizes.sm }}>
                  {isSearching ? '...' : '⌕'}
                </RNText>
                <TextInput
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholder="Search courses, topics..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={{ flex: 1, fontSize: isVerySmallScreen ? 14 : 15, color: '#FFFFFF', paddingVertical: Platform.OS === 'ios' ? 10 : 8, paddingHorizontal: 0, }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => { setSearchQuery(''); handleCategorySelect(selectedCategory); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <RNText style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', fontWeight: '300' }}>×</RNText>
                  </TouchableOpacity>
                )}
              </Block>
            </Block>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(150).duration(400)}>
            <Block marginTop={sizes.m}>
              <Block row align="center" justify="space-between" paddingHorizontal={horizontalPadding} marginBottom={sizes.sm}>
                <RNText style={{ fontSize: sectionTitleSize, fontWeight: '800', color: colors.text, letterSpacing: -0.3 }}>Categories</RNText>
              </Block>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: horizontalPadding }}>
                {categories.map((category, index) => {
                  const isSelected = selectedCategory === category.id;
                  const categoryColor = getCategoryColor(category.id);
                  return (
                    <Animated.View key={`${category.id}-${index}`} entering={FadeInRight.delay(index * 50).duration(300)}>
                      <AnimatedTouchable onPress={() => handleCategorySelect(category.id)} activeOpacity={0.8} style={{ marginRight: sizes.s }}>
                        <Block
                          row
                          align="center"
                          color={isSelected ? colors.primary : colors.white}
                          radius={14}
                          paddingHorizontal={sizes.sm}
                          paddingVertical={isVerySmallScreen ? 10 : 12}
                          style={{
                            borderWidth: 0,
                            shadowColor: isSelected ? colors.primary : '#000',
                            shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
                            shadowOpacity: isSelected ? 0.3 : 0.08,
                            shadowRadius: isSelected ? 8 : 4,
                            elevation: isSelected ? 6 : 2,
                          }}
                        >
                          <Block style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: isSelected ? '#FFFFFF' : categoryColor, marginRight: 10 }} />
                          <RNText style={{ fontSize: isVerySmallScreen ? 13 : 14, fontWeight: isSelected ? '700' : '600', color: isSelected ? '#FFFFFF' : colors.text }}>
                            {category.name}
                          </RNText>
                        </Block>
                      </AnimatedTouchable>
                    </Animated.View>
                  );
                })}
              </ScrollView>
            </Block>
          </Animated.View>

          {error && (
            <Block marginHorizontal={horizontalPadding} marginTop={sizes.m} color="#fee2e2" radius={12} padding={sizes.sm} align="center">
              <RNText style={{ fontSize: 14, color: '#dc2626', textAlign: 'center' }}>{error}</RNText>
              <TouchableOpacity onPress={loadData} style={{ marginTop: sizes.s }}>
                <RNText style={{ fontSize: 14, color: colors.primary, fontWeight: '600' }}>Retry</RNText>
              </TouchableOpacity>
            </Block>
          )}

          <Block marginTop={sizes.m}>
            <Block row align="center" justify="space-between" paddingHorizontal={horizontalPadding} marginBottom={sizes.sm}>
              <RNText style={{ fontSize: sectionTitleSize, fontWeight: '800', color: colors.text, letterSpacing: -0.3 }}>
                {searchQuery ? 'Search Results' : selectedCategory === 'all' ? 'Featured Courses' : (categories.find((c) => c.id === selectedCategory)?.name || 'Courses')}
              </RNText>
              <Block style={{ backgroundColor: colors.light, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                <RNText style={{ fontSize: 12, color: colors.gray, fontWeight: '600' }}>{courses.length}</RNText>
              </Block>
            </Block>
            {isLoading && !isRefreshing && courses.length > 0 && (
              <Block align="center" paddingVertical={sizes.sm}>
                <ActivityIndicator size="small" color={colors.primary} />
              </Block>
            )}
            {courses.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingVertical: sizes.s }}>
                {courses.map((course, index) => renderCourseCard(course, index))}
              </ScrollView>
            ) : (
              !isLoading && (
                <Block
                  marginHorizontal={horizontalPadding}
                  color={colors.white}
                  radius={16}
                  padding={sizes.xl}
                  align="center"
                  style={{ shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}
                >
                  <Block style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.light, justifyContent: 'center', alignItems: 'center', marginBottom: sizes.sm }}>
                    <RNText style={{ fontSize: 24, color: colors.primary, fontWeight: '600' }}>?</RNText>
                  </Block>
                  <RNText style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: sizes.xs }}>No Courses Found</RNText>
                  <RNText style={{ fontSize: 14, color: colors.gray, textAlign: 'center' }}>
                    {searchQuery ? 'Try a different search term' : 'No courses available in this category yet'}
                  </RNText>
                </Block>
              )
            )}
          </Block>

          {courses.length > 0 && !searchQuery && (
            <Animated.View entering={FadeInUp.delay(200).duration(500)}>
              <Block marginTop={sizes.l} paddingHorizontal={horizontalPadding}>
                <RNText style={{ fontSize: sectionTitleSize, fontWeight: '800', color: colors.text, marginBottom: sizes.sm, letterSpacing: -0.3 }}>Popular Courses</RNText>
                {courses.slice(0, 5).map((course, index) => (
                  <Animated.View
                    key={'popular-' + course.id}
                    entering={FadeInDown.delay(index * 80).duration(400).springify()}
                  >
                    <AnimatedTouchable
                      activeOpacity={0.95}
                      onPress={() => handleCoursePress(course.id)}
                    >
                      <Block
                        row
                        color={colors.white}
                        radius={16}
                        marginBottom={sizes.sm}
                        style={{ overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}
                      >
                        <Block style={{ width: isVerySmallScreen ? 90 : 100, height: isVerySmallScreen ? 90 : 100, backgroundColor: colors.card, position: 'relative' }}>
                          {course.thumbnail ? (
                            <Image source={{ uri: course.thumbnail }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                          ) : (
                            <Block flex={1} align="center" justify="center" color={colors.primary}>
                              <RNText style={{ fontSize: 32, color: '#FFFFFF', fontWeight: '700' }}>{(course.title || 'C').charAt(0).toUpperCase()}</RNText>
                            </Block>
                          )}
                          <Block style={{ position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 }}>
                            <RNText style={{ fontSize: 9, color: '#fff', fontWeight: '700' }}>{index + 1}</RNText>
                          </Block>
                        </Block>
                        <Block flex={1} padding={sizes.sm} justify="space-between">
                          <Block>
                            <RNText style={{ fontSize: isVerySmallScreen ? 14 : 15, fontWeight: '700', color: colors.text, marginBottom: 4, lineHeight: (isVerySmallScreen ? 14 : 15) * 1.3 }} numberOfLines={2}>
                              {course.title}
                            </RNText>
                            <Block row align="center">
                              <Block style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.light, marginRight: 6, justifyContent: 'center', alignItems: 'center' }}>
                                <RNText style={{ fontSize: 10, fontWeight: '600', color: colors.primary }}>{(course.instructor?.name || 'U').charAt(0)}</RNText>
                              </Block>
                              <RNText style={{ fontSize: 12, color: colors.gray }} numberOfLines={1}>
                                {course.instructor?.name || 'Unknown'}
                              </RNText>
                            </Block>
                          </Block>
                          <Block row align="center" justify="space-between" marginTop={8}>
                            <Block row align="center">
                              <RNText style={{ fontSize: 13, color: '#f39c12', fontWeight: '700', marginRight: 2 }}>★</RNText>
                              <RNText style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>{course.rating?.toFixed(1) || 'N/A'}</RNText>
                            </Block>
                            <RNText style={{ fontSize: isVerySmallScreen ? 14 : 15, fontWeight: '800', color: colors.primary }}>{formatPrice(course.price)}</RNText>
                          </Block>
                        </Block>
                      </Block>
                    </AnimatedTouchable>
                  </Animated.View>
                ))}
              </Block>
            </Animated.View>
          )}
        </ScrollView>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default Home;
