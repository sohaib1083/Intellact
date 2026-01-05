import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, CourseInterest, User, Category } from '@/types';

const COURSES_COLLECTION = 'courses';
const INTERESTS_COLLECTION = 'course_interests';
const USERS_COLLECTION = 'users';
const CATEGORIES_COLLECTION = 'categories';

// PKR conversion rate
const PKR_RATE = 280;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export async function getAllCourses(): Promise<Course[]> {
  const coursesRef = collection(db, COURSES_COLLECTION);
  const snapshot = await getDocs(coursesRef);
  
  const courses: Course[] = [];
  snapshot.forEach((doc) => {
    courses.push(parseCourseData(doc.id, doc.data()));
  });
  
  // Sort by createdAt descending
  courses.sort((a, b) => {
    const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt as Date);
    const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt as Date);
    return dateB.getTime() - dateA.getTime();
  });
  
  return courses;
}

export async function getCourseById(id: string): Promise<Course | null> {
  const courseRef = doc(db, COURSES_COLLECTION, id);
  const snapshot = await getDoc(courseRef);
  
  if (snapshot.exists()) {
    return parseCourseData(snapshot.id, snapshot.data());
  }
  return null;
}

export async function createCourse(courseData: Partial<Course>): Promise<string> {
  console.log('🚀 createCourse called with:', JSON.stringify(courseData, null, 2));
  
  const coursesRef = collection(db, COURSES_COLLECTION);
  
  // Convert PKR price to USD for storage
  const priceInPKR = courseData.price || 0;
  const priceInUSD = priceInPKR / PKR_RATE;
  
  console.log('💰 Price conversion:', priceInPKR, 'PKR ->', priceInUSD, 'USD');
  
  // Generate instructor ID if not provided
  const instructorId = courseData.instructor?.id || `instructor_${Date.now()}`;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newCourse: Record<string, any> = {
    title: courseData.title || '',
    description: courseData.description || '',
    shortDescription: courseData.shortDescription || '',
    instructor: {
      id: instructorId,
      name: courseData.instructor?.name || 'Unknown Instructor',
      avatar: courseData.instructor?.avatar || '',
      bio: courseData.instructor?.bio || '',
    },
    thumbnail: courseData.thumbnail || '',
    category: courseData.category || 'General',
    subcategory: courseData.subcategory || '',
    price: priceInUSD,
    currency: 'PKR',
    language: courseData.language || 'English',
    level: courseData.level || 'Beginner',
    duration: courseData.duration || '',
    totalLessons: courseData.totalLessons || 0,
    rating: courseData.rating || 0,
    totalRatings: courseData.totalRatings || 0,
    totalStudents: courseData.totalStudents || 0,
    tags: courseData.tags || [],
    whatYouWillLearn: courseData.whatYouWillLearn || [],
    requirements: courseData.requirements || [],
    isPublished: courseData.isPublished ?? true,
    isFeatured: courseData.isFeatured ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  // Only add originalPrice if it has a value (Firebase doesn't allow undefined)
  if (courseData.originalPrice) {
    newCourse.originalPrice = courseData.originalPrice / PKR_RATE;
  }
  
  console.log('📝 New course object:', JSON.stringify(newCourse, null, 2));
  
  try {
    const docRef = await addDoc(coursesRef, newCourse);
    console.log('✅ Course created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Firebase addDoc error:', error);
    throw error;
  }
}

export async function updateCourse(id: string, courseData: Partial<Course>): Promise<void> {
  console.log('🔄 updateCourse called for ID:', id);
  console.log('📝 Update data:', JSON.stringify(courseData, null, 2));
  
  const courseRef = doc(db, COURSES_COLLECTION, id);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { updatedAt: serverTimestamp() };
  
  // Only add fields that are defined (Firebase doesn't allow undefined)
  if (courseData.title !== undefined) updateData.title = courseData.title;
  if (courseData.description !== undefined) updateData.description = courseData.description;
  if (courseData.shortDescription !== undefined) updateData.shortDescription = courseData.shortDescription;
  if (courseData.thumbnail !== undefined) updateData.thumbnail = courseData.thumbnail;
  if (courseData.category !== undefined) updateData.category = courseData.category;
  if (courseData.subcategory !== undefined) updateData.subcategory = courseData.subcategory;
  if (courseData.language !== undefined) updateData.language = courseData.language;
  if (courseData.level !== undefined) updateData.level = courseData.level;
  if (courseData.duration !== undefined) updateData.duration = courseData.duration;
  if (courseData.totalLessons !== undefined) updateData.totalLessons = courseData.totalLessons;
  if (courseData.rating !== undefined) updateData.rating = courseData.rating;
  if (courseData.totalRatings !== undefined) updateData.totalRatings = courseData.totalRatings;
  if (courseData.totalStudents !== undefined) updateData.totalStudents = courseData.totalStudents;
  if (courseData.tags !== undefined) updateData.tags = courseData.tags;
  if (courseData.whatYouWillLearn !== undefined) updateData.whatYouWillLearn = courseData.whatYouWillLearn;
  if (courseData.requirements !== undefined) updateData.requirements = courseData.requirements;
  if (courseData.isPublished !== undefined) updateData.isPublished = courseData.isPublished;
  if (courseData.isFeatured !== undefined) updateData.isFeatured = courseData.isFeatured;
  
  // Handle instructor object
  if (courseData.instructor) {
    updateData.instructor = {
      id: courseData.instructor.id || '',
      name: courseData.instructor.name || '',
      avatar: courseData.instructor.avatar || '',
      bio: courseData.instructor.bio || '',
    };
  }
  
  // Convert PKR price to USD if price is being updated
  if (courseData.price !== undefined) {
    updateData.price = courseData.price / PKR_RATE;
  }
  if (courseData.originalPrice !== undefined && courseData.originalPrice !== null) {
    updateData.originalPrice = courseData.originalPrice / PKR_RATE;
  }
  
  console.log('📤 Final update data:', JSON.stringify(updateData, null, 2));
  
  try {
    await updateDoc(courseRef, updateData);
    console.log('✅ Course updated successfully');
  } catch (error) {
    console.error('❌ Firebase updateDoc error:', error);
    throw error;
  }
}

export async function deleteCourse(id: string): Promise<void> {
  const courseRef = doc(db, COURSES_COLLECTION, id);
  await deleteDoc(courseRef);
}

// ==================== INTEREST OPERATIONS ====================

export async function getAllInterests(): Promise<CourseInterest[]> {
  const interestsRef = collection(db, INTERESTS_COLLECTION);
  const snapshot = await getDocs(interestsRef);
  
  const interests: CourseInterest[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    interests.push({
      id: doc.id,
      courseId: data.courseId || '',
      courseName: data.courseName || '',
      userId: data.userId || '',
      userName: data.userName || '',
      userEmail: data.userEmail || '',
      userPhone: data.userPhone || '',
      message: data.message || '',
      status: data.status || 'pending',
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
    });
  });
  
  // Sort by createdAt descending
  interests.sort((a, b) => {
    const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt as Date);
    const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt as Date);
    return dateB.getTime() - dateA.getTime();
  });
  
  return interests;
}

export async function updateInterestStatus(id: string, status: string): Promise<void> {
  const interestRef = doc(db, INTERESTS_COLLECTION, id);
  await updateDoc(interestRef, { status, updatedAt: serverTimestamp() });
}

export async function deleteInterest(id: string): Promise<void> {
  const interestRef = doc(db, INTERESTS_COLLECTION, id);
  await deleteDoc(interestRef);
}

// ==================== USER OPERATIONS ====================

export async function getAllUsers(): Promise<User[]> {
  const usersRef = collection(db, USERS_COLLECTION);
  const snapshot = await getDocs(usersRef);
  
  const users: User[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    users.push({
      id: doc.id,
      email: data.email || '',
      name: data.name || '',
      phone: data.phone || '',
      role: data.role || 'learner',
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt,
    });
  });
  
  return users;
}

// ==================== STATS ====================

export async function getAllCategories(): Promise<Category[]> {
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  const snapshot = await getDocs(categoriesRef);
  
  const categories: Category[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    categories.push({
      id: doc.id,
      name: data.name || '',
      icon: data.icon || '',
      description: data.description || '',
      coursesCount: data.coursesCount || 0,
      isActive: data.isActive ?? true,
    });
  });
  
  return categories;
}

export async function getStats() {
  const [courses, interests, users] = await Promise.all([
    getAllCourses(),
    getAllInterests(),
    getAllUsers(),
  ]);
  
  return {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.isPublished).length,
    totalInterests: interests.length,
    pendingInterests: interests.filter(i => i.status === 'pending').length,
    totalUsers: users.length,
  };
}
