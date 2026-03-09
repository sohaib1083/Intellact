import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'learner' | 'seller';
  createdAt: Date;
  updatedAt: Date;
}

// Register new user
export const registerUser = async (email: string, password: string, name?: string, phone?: string): Promise<User> => {
  try {
    console.log('Starting user registration for:', email);
    console.log('Auth instance available:', auth ? 'Yes' : 'No');

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('User created successfully:', user.uid);

    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: name || '',
      name: name || '',
      phone: phone || '',
      phoneNumber: phone || '',
      role: 'learner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('🔍 Creating user profile in Firestore...');
    await setDoc(doc(db, 'users', user.uid), userProfile);
    console.log('✅ User profile created successfully in Firestore');

    return user;
  } catch (error) {
    console.error('❌ Registration error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.message.includes('permissions')) {
        console.error('📋 This is a Firestore permissions error.');
        console.error('📋 Please update your Firestore rules to allow user creation.');
      }
    }
    throw error as AuthError;
  }
};

// Sign in user
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error as AuthError;
  }
};

// Sign out user
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error as AuthError;
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    console.log('🔍 Attempting to fetch user profile for UID:', uid);
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('✅ User profile loaded successfully');
      return docSnap.data() as UserProfile;
    } else {
      console.log('⚠️ User profile not found in Firestore');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('📋 This is likely a Firestore permissions issue.');
      console.error('📋 Make sure your Firestore rules allow reading user documents.');
    }
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};