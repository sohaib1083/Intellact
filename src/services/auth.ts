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
    console.log('🔐 Starting user registration for:', email);
    console.log('🔥 Auth instance available:', auth ? 'Yes' : 'No');
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ User created successfully:', user.uid);
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      name: name || '',
      phone: phone || '',
      role: 'learner', // Default role
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log('💾 Creating user profile in Firestore...');
    await setDoc(doc(db, 'users', user.uid), userProfile);
    console.log('✅ User profile created successfully');
    
    return user;
  } catch (error) {
    console.error('❌ Registration error:', error);
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
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
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