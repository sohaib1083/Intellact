import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Course interface - matches Firestore schema
export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  thumbnail: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string; // e.g., "12 hours"
  totalLessons: number;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  tags: string[];
  whatYouWillLearn: string[];
  requirements: string[];
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// Interest/Enrollment interface - when user expresses interest
export interface CourseInterest {
  id: string;
  courseId: string;
  courseName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  message?: string; // Optional message from user
  status: 'pending' | 'contacted' | 'enrolled' | 'declined';
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  coursesCount: number;
  isActive?: boolean;
}

const COURSES_COLLECTION = 'courses';
const INTERESTS_COLLECTION = 'course_interests';
const CATEGORIES_COLLECTION = 'categories';

// Helper function to safely parse course data with defaults
const parseCourseData = (id: string, data: any): Course => {
  return {
    id,
    title: data.title || 'Untitled Course',
    description: data.description || '',
    shortDescription: data.shortDescription || data.description || '',
    instructor: {
      id: data.instructor?.id || 'unknown',
      name: data.instructor?.name || 'Unknown Instructor',
      avatar: data.instructor?.avatar || '',
      bio: data.instructor?.bio || '',
    },
    thumbnail: data.thumbnail || '',
    category: data.category || 'General',
    subcategory: data.subcategory || '',
    price: typeof data.price === 'number' ? data.price : 0,
    originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : undefined,
    currency: data.currency || 'PKR',
    language: data.language || 'English',
    level: data.level || 'Beginner',
    duration: data.duration || 'Self-paced',
    totalLessons: typeof data.totalLessons === 'number' ? data.totalLessons : 0,
    rating: typeof data.rating === 'number' ? data.rating : 0,
    totalRatings: typeof data.totalRatings === 'number' ? data.totalRatings : 0,
    totalStudents: typeof data.totalStudents === 'number' ? data.totalStudents : 0,
    tags: Array.isArray(data.tags) ? data.tags : [],
    whatYouWillLearn: Array.isArray(data.whatYouWillLearn) ? data.whatYouWillLearn : [],
    requirements: Array.isArray(data.requirements) ? data.requirements : [],
    isPublished: data.isPublished ?? false,
    isFeatured: data.isFeatured ?? false,
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
  };
};

// ==================== COURSE OPERATIONS ====================

/**
 * Fetch all published courses
 * Note: Sorting is done client-side to avoid requiring composite index
 */
export const fetchAllCourses = async (): Promise<Course[]> => {
  try {
    const coursesRef = collection(db, COURSES_COLLECTION);
    // Simple query without orderBy to avoid composite index requirement
    const q = query(
      coursesRef, 
      where('isPublished', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const courses: Course[] = [];
    
    querySnapshot.forEach((doc) => {
      courses.push(parseCourseData(doc.id, doc.data()));
    });
    
    // Sort client-side by createdAt descending
    courses.sort((a, b) => {
      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log('Fetched ' + courses.length + ' courses');
    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

/**
 * Fetch courses by category
 * Note: Sorting is done client-side to avoid requiring composite index
 */
export const fetchCoursesByCategory = async (category: string): Promise<Course[]> => {
  try {
    const coursesRef = collection(db, COURSES_COLLECTION);
    // Query without orderBy to avoid composite index requirement
    const q = query(
      coursesRef,
      where('isPublished', '==', true),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    const courses: Course[] = [];
    
    querySnapshot.forEach((doc) => {
      courses.push(parseCourseData(doc.id, doc.data()));
    });
    
    // Sort client-side by createdAt descending
    courses.sort((a, b) => {
      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log('Fetched ' + courses.length + ' courses in category: ' + category);
    return courses;
  } catch (error) {
    console.error('Error fetching courses by category:', error);
    throw error;
  }
};

/**
 * Fetch featured courses
 * Note: Sorting is done client-side to avoid requiring composite index
 */
export const fetchFeaturedCourses = async (limitCount: number = 10): Promise<Course[]> => {
  try {
    const coursesRef = collection(db, COURSES_COLLECTION);
    // Query without orderBy to avoid composite index requirement
    const q = query(
      coursesRef,
      where('isPublished', '==', true),
      where('isFeatured', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const courses: Course[] = [];
    
    querySnapshot.forEach((doc) => {
      courses.push(parseCourseData(doc.id, doc.data()));
    });
    
    // Sort client-side by rating descending and limit
    courses.sort((a, b) => b.rating - a.rating);
    
    console.log('Fetched ' + courses.length + ' featured courses');
    return courses.slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    throw error;
  }
};

/**
 * Fetch single course by ID
 */
export const fetchCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (courseSnap.exists()) {
      console.log(`Fetched course: ${courseId}`);
      return parseCourseData(courseSnap.id, courseSnap.data());
    }
    
    console.log(`Course not found: ${courseId}`);
    return null;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

/**
 * Search courses by title or description
 */
export const searchCourses = async (searchTerm: string): Promise<Course[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This fetches all published courses and filters client-side
    // For production, consider using Algolia or Firebase Extensions
    const allCourses = await fetchAllCourses();
    const searchLower = searchTerm.toLowerCase();
    
    const filteredCourses = allCourses.filter(course => 
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      course.instructor.name.toLowerCase().includes(searchLower)
    );
    
    console.log(`Found ${filteredCourses.length} courses matching: "${searchTerm}"`);
    return filteredCourses;
  } catch (error) {
    console.error('Error searching courses:', error);
    throw error;
  }
};

/**
 * Create a new course (Admin/API use - for Postman)
 */
export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const coursesRef = collection(db, COURSES_COLLECTION);
    
    const newCourse = {
      ...courseData,
      rating: courseData.rating || 0,
      totalRatings: courseData.totalRatings || 0,
      totalStudents: courseData.totalStudents || 0,
      isPublished: courseData.isPublished ?? true,
      isFeatured: courseData.isFeatured ?? false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(coursesRef, newCourse);
    console.log(`Course created with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

/**
 * Update an existing course
 */
export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<void> => {
  try {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    await updateDoc(courseRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log(`Course updated: ${courseId}`);
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

/**
 * Delete a course
 */
export const deleteCourse = async (courseId: string): Promise<void> => {
  try {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    await deleteDoc(courseRef);
    console.log(`Course deleted: ${courseId}`);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// ==================== INTEREST/ENROLLMENT OPERATIONS ====================

/**
 * Express interest in a course
 */
export const expressInterest = async (
  course: Course,
  user: { uid: string; email: string; name?: string; phone?: string },
  message?: string
): Promise<string> => {
  try {
    const interestsRef = collection(db, INTERESTS_COLLECTION);
    
    // Check if user already expressed interest
    const existingQuery = query(
      interestsRef,
      where('courseId', '==', course.id),
      where('userId', '==', user.uid)
    );
    const existingSnap = await getDocs(existingQuery);
    
    if (!existingSnap.empty) {
      console.log('User already expressed interest in this course');
      return existingSnap.docs[0].id;
    }
    
    const interest: Omit<CourseInterest, 'id'> = {
      courseId: course.id,
      courseName: course.title,
      userId: user.uid,
      userName: user.name || user.email.split('@')[0],
      userEmail: user.email,
      userPhone: user.phone || '',
      message: message || '',
      status: 'pending',
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };
    
    const docRef = await addDoc(interestsRef, interest);
    
    // Increment total students count on course
    const courseRef = doc(db, COURSES_COLLECTION, course.id);
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      const currentStudents = courseSnap.data().totalStudents || 0;
      await updateDoc(courseRef, {
        totalStudents: currentStudents + 1,
        updatedAt: serverTimestamp(),
      });
    }
    
    console.log(`Interest recorded with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error expressing interest:', error);
    throw error;
  }
};

/**
 * Get user's interested courses
 */
export const getUserInterests = async (userId: string): Promise<CourseInterest[]> => {
  try {
    const interestsRef = collection(db, INTERESTS_COLLECTION);
    const q = query(
      interestsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const interests: CourseInterest[] = [];
    
    querySnapshot.forEach((doc) => {
      interests.push({
        id: doc.id,
        ...doc.data()
      } as CourseInterest);
    });
    
    console.log(`Fetched ${interests.length} interests for user: ${userId}`);
    return interests;
  } catch (error) {
    console.error('Error fetching user interests:', error);
    throw error;
  }
};

/**
 * Get all interests (Admin use - to see who's interested)
 */
export const getAllInterests = async (): Promise<CourseInterest[]> => {
  try {
    const interestsRef = collection(db, INTERESTS_COLLECTION);
    const q = query(interestsRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const interests: CourseInterest[] = [];
    
    querySnapshot.forEach((doc) => {
      interests.push({
        id: doc.id,
        ...doc.data()
      } as CourseInterest);
    });
    
    console.log(`Fetched ${interests.length} total interests`);
    return interests;
  } catch (error) {
    console.error('Error fetching all interests:', error);
    throw error;
  }
};

/**
 * Update interest status (Admin use)
 */
export const updateInterestStatus = async (
  interestId: string, 
  status: CourseInterest['status']
): Promise<void> => {
  try {
    const interestRef = doc(db, INTERESTS_COLLECTION, interestId);
    await updateDoc(interestRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    console.log(`Interest status updated: ${interestId} -> ${status}`);
  } catch (error) {
    console.error('Error updating interest status:', error);
    throw error;
  }
};

/**
 * Check if user is interested in a course
 */
export const checkUserInterest = async (userId: string, courseId: string): Promise<boolean> => {
  try {
    const interestsRef = collection(db, INTERESTS_COLLECTION);
    const q = query(
      interestsRef,
      where('courseId', '==', courseId),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user interest:', error);
    return false;
  }
};

// ==================== CATEGORY OPERATIONS ====================

/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const querySnapshot = await getDocs(categoriesRef);
    const categories: Category[] = [];
    
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      } as Category);
    });
    
    // If no categories in DB, return defaults
    if (categories.length === 0) {
      return getDefaultCategories();
    }
    
    console.log(`Fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return getDefaultCategories();
  }
};

/**
 * Get default categories (fallback)
 * Note: "All" category is added by the UI, not here
 */
const getDefaultCategories = (): Category[] => [
  { id: 'development', name: 'Development', icon: 'code', coursesCount: 0 },
  { id: 'business', name: 'Business', icon: 'briefcase', coursesCount: 0 },
  { id: 'design', name: 'Design', icon: 'palette', coursesCount: 0 },
  { id: 'marketing', name: 'Marketing', icon: 'chart', coursesCount: 0 },
  { id: 'it-software', name: 'IT & Software', icon: 'settings', coursesCount: 0 },
  { id: 'personal-development', name: 'Personal Dev', icon: 'brain', coursesCount: 0 },
  { id: 'photography', name: 'Photography', icon: 'camera', coursesCount: 0 },
  { id: 'music', name: 'Music', icon: 'music', coursesCount: 0 },
  { id: 'health', name: 'Health', icon: 'heart', coursesCount: 0 },
];

/**
 * Create a category (Admin use)
 */
export const createCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const docRef = await addDoc(categoriesRef, category);
    console.log(`Category created with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};
