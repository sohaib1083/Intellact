// Quick script to populate Firestore with initial data
// Run this after fixing your Firestore rules

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDDaQxPqSbZdDpXu53IFFuPN9T9Hb50QQU",
  authDomain: "intellact-6c3fb.firebaseapp.com",
  projectId: "intellact-6c3fb",
  storageBucket: "intellact-6c3fb.firebasestorage.app",
  messagingSenderId: "385298882792",
  appId: "1:385298882792:android:f8ae7f766e23f87d02e95d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const initializeCategories = async () => {
  const categories = [
    { id: 'development', name: 'Development', icon: 'code', coursesCount: 0, isActive: true },
    { id: 'business', name: 'Business', icon: 'business', coursesCount: 0, isActive: true },
    { id: 'design', name: 'Design', icon: 'design', coursesCount: 0, isActive: true },
    { id: 'marketing', name: 'Marketing', icon: 'marketing', coursesCount: 0, isActive: true },
  ];

  for (const category of categories) {
    try {
      await setDoc(doc(db, 'categories', category.id), category);
      console.log(`✅ Added category: ${category.name}`);
    } catch (error) {
      console.error(`❌ Error adding category ${category.name}:`, error);
    }
  }
};

const initializeSampleCourse = async () => {
  const course = {
    title: "React Native Complete Course",
    description: "Learn React Native from scratch",
    shortDescription: "Complete React Native development course",
    instructor: {
      id: "instructor1",
      name: "John Doe",
      avatar: "",
      bio: "Experienced React Native developer"
    },
    thumbnail: "https://via.placeholder.com/300x200",
    category: "Development",
    price: 2999,
    currency: "PKR",
    language: "English",
    level: "Beginner",
    duration: "20 hours",
    totalLessons: 50,
    rating: 4.5,
    totalRatings: 100,
    totalStudents: 500,
    tags: ["react-native", "mobile", "javascript"],
    whatYouWillLearn: ["Build mobile apps", "Use React Native", "Deploy to app stores"],
    requirements: ["Basic JavaScript knowledge"],
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const docRef = await addDoc(collection(db, 'courses'), course);
    console.log(`✅ Added sample course with ID: ${docRef.id}`);
  } catch (error) {
    console.error("❌ Error adding sample course:", error);
  }
};

const main = async () => {
  console.log("🚀 Initializing Firestore with sample data...");
  await initializeCategories();
  await initializeSampleCourse();
  console.log("✅ Done! Check your Firestore console.");
  process.exit(0);
};

main().catch(console.error);