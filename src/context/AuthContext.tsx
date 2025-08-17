
// src/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signInWithCustomToken, getRedirectResult, setPersistence, browserLocalPersistence, type User } from 'firebase/auth'; // Import User type
import { initializeApp, getApp, getApps } from 'firebase/app'; // Safe Firebase app init
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // For saving user profile


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
  bootChecked: boolean; // True after /health boot id is checked
  signOutUser: () => Promise<void>; // Function to sign out
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Detect backend restarts to refresh auth once
async function getServerBootId(): Promise<string | null> {
  try {
    const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/health', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.boot_id || null;
  } catch { return null; }
}


// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // True while auth state resolving
  const [bootChecked, setBootChecked] = useState(false); // Becomes true after /health processed
  const [reloadChecked, setReloadChecked] = useState(false); // ensures we process refresh policy exactly once


  // Initialize Firebase and get auth/firestore instances
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // Detect backend restart and refresh auth once after reload
  useEffect(() => {
    let mounted = true;
    (async () => {
      const bootId = await getServerBootId();
      const stored = sessionStorage.getItem('server_boot_id');
      if (mounted) {
        if (!stored && bootId) {
          sessionStorage.setItem('server_boot_id', bootId);
        } else if (stored && bootId && stored !== bootId) {
          try { await auth.signOut().catch(() => {}); }
          finally { sessionStorage.setItem('server_boot_id', bootId); }
        }
        setBootChecked(true);
      }
  // Enforce sign-out-on-refresh policy (to reset user like cart resets) once per browser load
  useEffect(() => {
    if (reloadChecked) return;
    const already = sessionStorage.getItem('cg_reload_done');
    const doReset = !already; // first load after refresh
    (async () => {
      if (doReset && auth.currentUser) {
        try { await auth.signOut().catch(() => {}); } catch {}
      }
      sessionStorage.setItem('cg_reload_done', '1');
      setReloadChecked(true);
    })();
  }, [auth, reloadChecked]);

    })();
    return () => { mounted = false };
  }, [auth]);

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
              const token = await currentUser.getIdToken();
              await fetch(import.meta.env.VITE_API_BASE_URL + '/save-user', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
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
    <AuthContext.Provider value={{ user, loading, bootChecked, signOutUser }}>
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
