/**
 * Admin utility to seed the database with sample courses
 * Import and use: await seedDatabase()
 */

import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const sampleCourses = [
  {
    title: 'Complete React Native Development',
    description: 'Master React Native from scratch. Build real-world mobile apps for iOS and Android using JavaScript and React Native framework.',
    shortDescription: 'Build iOS and Android apps with React Native',
    instructor: {
      id: 'inst-001',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Senior Mobile Developer with 8+ years experience'
    },
    thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800',
    category: 'Development',
    subcategory: 'Mobile Development',
    price: 89.99,
    originalPrice: 149.99,
    currency: 'USD',
    language: 'English',
    level: 'Beginner',
    duration: '24 hours',
    totalLessons: 156,
    rating: 4.8,
    totalRatings: 2847,
    totalStudents: 12500,
    tags: ['react native', 'mobile', 'javascript', 'ios', 'android'],
    whatYouWillLearn: [
      'Build production-ready mobile apps',
      'Master React Native core concepts',
      'Implement navigation and routing',
      'Connect to REST APIs and Firebase',
      'Deploy to App Store and Google Play'
    ],
    requirements: ['Basic JavaScript knowledge', 'Understanding of React basics'],
    isPublished: true,
    isFeatured: true,
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'Learn the fundamentals of UI/UX design from industry experts. Cover user research, wireframing, prototyping, and creating stunning interfaces.',
    shortDescription: 'Design beautiful user interfaces and experiences',
    instructor: {
      id: 'inst-002',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Lead Designer at a Fortune 500 company'
    },
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    category: 'Design',
    subcategory: 'UI/UX Design',
    price: 79.99,
    originalPrice: 129.99,
    currency: 'USD',
    language: 'English',
    level: 'All Levels',
    duration: '18 hours',
    totalLessons: 98,
    rating: 4.9,
    totalRatings: 1923,
    totalStudents: 8700,
    tags: ['ui design', 'ux design', 'figma', 'prototyping'],
    whatYouWillLearn: [
      'Design principles and color theory',
      'User research methodologies',
      'Wireframing and prototyping',
      'Master Figma from scratch',
      'Build a professional portfolio'
    ],
    requirements: ['No prior design experience needed', 'Figma account (free)'],
    isPublished: true,
    isFeatured: true,
  },
  {
    title: 'Digital Marketing Strategy',
    description: 'Comprehensive digital marketing course covering SEO, social media marketing, email campaigns, Google Ads, and analytics.',
    shortDescription: 'Master digital marketing from SEO to social media',
    instructor: {
      id: 'inst-003',
      name: 'Emma Williams',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: 'Digital Marketing Director with 10+ years experience'
    },
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    category: 'Marketing',
    subcategory: 'Digital Marketing',
    price: 69.99,
    originalPrice: 119.99,
    currency: 'USD',
    language: 'English',
    level: 'Intermediate',
    duration: '15 hours',
    totalLessons: 87,
    rating: 4.7,
    totalRatings: 1456,
    totalStudents: 6200,
    tags: ['marketing', 'seo', 'social media', 'google ads'],
    whatYouWillLearn: [
      'SEO fundamentals and advanced techniques',
      'Social media marketing strategies',
      'Email marketing campaigns',
      'Google Ads and PPC advertising',
      'Analytics and performance tracking'
    ],
    requirements: ['Basic computer skills', 'Interest in marketing'],
    isPublished: true,
    isFeatured: false,
  },
  {
    title: 'Business Analytics with Python',
    description: 'Learn to analyze business data using Python. Cover data manipulation with Pandas, visualization with Matplotlib, and statistical analysis.',
    shortDescription: 'Analyze business data using Python and Pandas',
    instructor: {
      id: 'inst-004',
      name: 'David Park',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      bio: 'Data Scientist at leading tech company'
    },
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    category: 'Business',
    subcategory: 'Data Analytics',
    price: 94.99,
    originalPrice: 159.99,
    currency: 'USD',
    language: 'English',
    level: 'Intermediate',
    duration: '20 hours',
    totalLessons: 112,
    rating: 4.6,
    totalRatings: 987,
    totalStudents: 4500,
    tags: ['python', 'data analysis', 'pandas', 'business intelligence'],
    whatYouWillLearn: [
      'Python programming fundamentals',
      'Data manipulation with Pandas',
      'Data visualization techniques',
      'Statistical analysis methods',
      'Real-world business case studies'
    ],
    requirements: ['Basic understanding of statistics', 'Excel knowledge helpful'],
    isPublished: true,
    isFeatured: true,
  },
  {
    title: 'Full Stack Web Development',
    description: 'Complete web development bootcamp covering HTML, CSS, JavaScript, Node.js, React, and MongoDB. Build full-stack web applications.',
    shortDescription: 'Build complete web apps from frontend to backend',
    instructor: {
      id: 'inst-005',
      name: 'Alex Thompson',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      bio: 'Full Stack Developer and Tech Educator'
    },
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    category: 'Development',
    subcategory: 'Web Development',
    price: 99.99,
    originalPrice: 179.99,
    currency: 'USD',
    language: 'English',
    level: 'Beginner',
    duration: '42 hours',
    totalLessons: 284,
    rating: 4.8,
    totalRatings: 3421,
    totalStudents: 18900,
    tags: ['web development', 'javascript', 'react', 'nodejs', 'mongodb'],
    whatYouWillLearn: [
      'HTML5, CSS3, and modern JavaScript',
      'React for frontend development',
      'Node.js and Express backend',
      'MongoDB database design',
      'Deployment and DevOps basics'
    ],
    requirements: ['No coding experience needed', 'Computer with internet'],
    isPublished: true,
    isFeatured: true,
  },
  {
    title: 'Leadership and Management Skills',
    description: 'Develop essential leadership skills for modern business. Learn team management, effective communication, and strategic thinking.',
    shortDescription: 'Become an effective leader and manager',
    instructor: {
      id: 'inst-006',
      name: 'Jennifer Adams',
      avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
      bio: 'Executive Coach and Former CEO'
    },
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    category: 'Business',
    subcategory: 'Leadership',
    price: 59.99,
    originalPrice: 99.99,
    currency: 'USD',
    language: 'English',
    level: 'All Levels',
    duration: '12 hours',
    totalLessons: 64,
    rating: 4.7,
    totalRatings: 1234,
    totalStudents: 5600,
    tags: ['leadership', 'management', 'communication', 'team building'],
    whatYouWillLearn: [
      'Leadership styles and when to use them',
      'Effective communication techniques',
      'Team building and motivation',
      'Conflict resolution strategies',
      'Strategic decision making'
    ],
    requirements: ['Open to all experience levels', 'Interest in leadership'],
    isPublished: true,
    isFeatured: false,
  },
];

/**
 * Seeds the database with sample courses
 * Only adds courses if the collection is empty
 */
export const seedDatabase = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if courses already exist
    const coursesRef = collection(db, 'courses');
    const existingCourses = await getDocs(coursesRef);
    
    if (existingCourses.size > 0) {
      return { 
        success: true, 
        message: 'Database already has ' + existingCourses.size + ' courses. Skipping seed.' 
      };
    }
    
    // Add sample courses
    let addedCount = 0;
    for (const course of sampleCourses) {
      await addDoc(coursesRef, {
        ...course,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      addedCount++;
    }
    
    return { 
      success: true, 
      message: 'Successfully added ' + addedCount + ' courses to database!' 
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { 
      success: false, 
      message: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error') 
    };
  }
};

/**
 * Force seeds the database (adds courses even if some exist)
 */
export const forceSeedDatabase = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const coursesRef = collection(db, 'courses');
    
    let addedCount = 0;
    for (const course of sampleCourses) {
      await addDoc(coursesRef, {
        ...course,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      addedCount++;
    }
    
    return { 
      success: true, 
      message: 'Successfully added ' + addedCount + ' courses to database!' 
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { 
      success: false, 
      message: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error') 
    };
  }
};

export default seedDatabase;
