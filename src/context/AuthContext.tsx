// src/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously, type User } from 'firebase/auth'; // Import User type
import { initializeApp } from 'firebase/app'; // Import initializeApp
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'; // For saving user profile

// IMPORTANT: Your Firebase config from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Global variables provided by Canvas environment (if applicable)
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

// Define the shape of your AuthContext
interface AuthContextType {
  user: User | null; // Firebase User object or null
  loading: boolean; // True while initial auth state is being determined
  signOutUser: () => Promise<void>; // Function to sign out
  // You might add signIn functions here too if you want to expose them globally
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // True initially while checking auth state

  // Initialize Firebase and get auth/firestore instances
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  useEffect(() => {
    // Initial sign-in (anonymous or custom token)
    const setupInitialAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
          console.log("AuthContext: Signed in with custom token.");
        } else {
          await signInAnonymously(auth);
          console.log("AuthContext: Signed in anonymously.");
        }
      } catch (error) {
        console.error("AuthContext: Error during initial auth setup:", error);
      }
    };

    setupInitialAuth();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Auth state determined
      console.log("AuthContext: Auth state changed. User UID:", currentUser ? currentUser.uid : "null");

      // Save user profile to Firestore if not anonymous
      if (currentUser && !currentUser.isAnonymous) {
        saveUserProfileToFirestore(currentUser, firestore);
      }
    });

    return () => unsubscribe(); // Cleanup auth listener on component unmount
  }, []); // Empty dependency array means this runs once on mount

  // Function to save user profile to Firestore (copied from SignIn.tsx)
  async function saveUserProfileToFirestore(user: User, firestore: any) {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const userRef = doc(firestore, "artifacts", appId, "users", user.uid, "profile", "data");
    
    try {
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email || null,
          displayName: user.displayName || null,
          phoneNumber: user.phoneNumber || null,
          createdAt: new Date(),
        });
        console.log("AuthContext: User profile saved to Firestore.");
      }
    } catch (error: any) {
      console.error("AuthContext: Error saving user profile to Firestore:", error);
    }
  }

  const signOutUser = async () => {
    try {
      if (auth.currentUser) { // Only try to sign out if there's a current user
        await auth.signOut();
        console.log("AuthContext: User signed out.");
      }
    } catch (error: any) {
      console.error("AuthContext: Error signing out:", error);
      throw error; // Re-throw for component to handle
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};