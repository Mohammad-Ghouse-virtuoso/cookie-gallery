
// src/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signInWithCustomToken, getRedirectResult, setPersistence, browserLocalPersistence, type User } from 'firebase/auth'; // Import User type
import { initializeApp, getApp, getApps } from 'firebase/app'; // Safe Firebase app init
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'; // For saving user profile


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app-id',
};

// Global variables provided by Canvas environment (if applicable)
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

// Define the shape of your AuthContext
interface AuthContextType {
  user: User | null; // Firebase User object or null
  loading: boolean; // True while initial auth state is being determined
  signOutUser: () => Promise<void>; // Function to sign out
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // True initially while checking auth state

  // Initialize Firebase and get auth/firestore instances
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // Set persistence once
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((e) => {
      console.warn('AuthContext: Failed to set local persistence, falling back to default.', e);
    });
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Auth state determined
      console.log("AuthContext: Auth state changed. User UID:", currentUser ? currentUser.uid : "null");

      (async () => {
        if (currentUser && !currentUser.isAnonymous) {
          try {
            await saveUserProfileToFirestore(currentUser, firestore);
          } catch (e) {
            console.warn('AuthContext: client Firestore save failed, trying backend /save-user', e);
            try {
              await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/save-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  uid: currentUser.uid,
                  email: currentUser.email,
                  displayName: currentUser.displayName,
                  phoneNumber: currentUser.phoneNumber,
                })
              });
              console.log('AuthContext: Saved user via backend /save-user');
            } catch (be) {
              console.error('AuthContext: Backend /save-user failed:', be);
            }
          }
        }
      })();
    });

    // You should check for redirect results inside onAuthStateChanged,
    // which is the recommended pattern.
    getRedirectResult(auth).catch((e) => {
      console.warn('AuthContext: getRedirectResult error', e);
    });
    
    // Perform initial sign-in if no user is present
    const init = async () => {
      if (!auth.currentUser) {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      }
    };

    init();

    return () => unsubscribe(); // Cleanup auth listener on component unmount
  }, [auth, firestore]);

  async function saveUserProfileToFirestore(user: User, firestore: any) {
    const userRef = doc(firestore, 'users', user.uid); // doc id = UID
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        phoneNumber: user.phoneNumber || null,
        updatedAt: new Date(),
      }, { merge: true }); // upsert to also handle "new data"
      console.log('AuthContext: Upserted user profile doc for', user.uid);
    } catch (error: any) {
      console.error("AuthContext: Error saving user profile to Firestore:", error);
      throw error; // IMPORTANT: triggers backend /save-user fallback
    }
  }

  const signOutUser = async () => {
    try {
      if (auth.currentUser) {
        await auth.signOut();
      }
    } catch (error: any) {
      console.error("AuthContext: Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
