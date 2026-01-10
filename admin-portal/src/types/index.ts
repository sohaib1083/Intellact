import { Timestamp } from 'firebase/firestore';

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
  duration: string;
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

export interface CourseInterest {
  id: string;
  courseId: string;
  courseName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'enrolled' | 'declined';
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  role: 'learner' | 'admin';
  interests?: string[];
  enrolledCourses?: string[];
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  coursesCount: number;
  isActive?: boolean;
}
