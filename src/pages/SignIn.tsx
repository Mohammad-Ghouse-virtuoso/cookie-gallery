// src/pages/SignIn.tsx

import { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
  RecaptchaVerifier
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Google SVG component (inline fallback)
const GoogleSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.24 10.21V14.12H18.47C18.36 14.86 18.06 15.6 17.65 16.29C17.24 16.98 16.7 17.62 16.03 18.19C15.36 18.76 14.6 19.25 13.78 19.64C12.96 20.03 12.08 20.32 11.16 20.48C9.52 20.76 7.78 20.67 6.18 20.21C4.58 19.75 3.16 18.93 2.02 17.82C0.88 16.71 0.1 15.34 0.01 13.88H4.01C4.01 14.65 4.19 15.39 4.54 16.08C4.89 16.77 5.39 17.38 5.99 17.89C6.59 18.4 7.28 18.79 8.02 19.08C8.76 19.37 9.55 19.49 10.35 19.49C11.15 19.49 11.94 19.37 12.68 19.08C13.42 18.79 14.11 18.4 14.71 17.89C15.31 17.38 15.81 16.77 16.16 16.08C16.51 15.39 16.69 14.65 16.69 13.88H12.24V10.21Z" fill="#EA4335"/>
    <path d="M0.01 13.88C0.1 12.42 0.88 11.05 2.02 9.94C3.16 8.83 4.58 8.01 6.18 7.55C7.78 7.09 9.52 7.00 11.16 7.28C12.96 7.67 14.6 8.36 16.03 9.38C17.46 10.4 18.66 11.75 19.5 13.31L15.47 16.29C15.06 15.6 14.76 14.86 14.65 14.12H12.24V10.21H18.47V14.12H12.24V10.21Z" fill="#FBBC05"/>
    <path d="M12.24 10.21V14.12H18.47V10.21H12.24Z" fill="#4285F4"/>
    <path d="M12.24 10.21V14.12H18.47C18.36 14.86 18.06 15.6 17.65 16.29C17.24 16.98 16.7 17.62 16.03 18.19C15.36 18.76 14.6 19.25 13.78 19.64C12.96 20.03 12.08 20.32 11.16 20.48C9.52 20.76 7.78 20.67 6.18 20.21C4.58 19.75 3.16 18.93 2.02 17.82C0.88 16.71 0.1 15.34 0.01 13.88H4.01C4.01 14.65 4.19 15.39 4.54 16.08C4.89 16.77 5.39 17.38 5.99 17.89C6.59 18.4 7.28 18.79 8.02 19.08C8.76 19.37 9.55 19.49 10.35 19.49C11.15 19.49 11.94 19.37 12.68 19.08C13.42 18.79 14.11 18.4 14.71 17.89C15.31 17.38 15.81 16.77 16.16 16.08C16.51 15.39 16.69 14.65 16.69 13.88H12.24V10.21Z" fill="#34A853"/>
    <path d="M12.24 10.21V14.12H18.47V10.21H12.24Z" fill="#4285F4"/>
  </svg>
);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier | null;
    confirmationResult?: any;
  }
}

export default function SignIn() {
  const [user, setUser] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [authInstance, setAuthInstance] = useState<any>(null);

  // Initialize Firebase Auth and Firestore once
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    setAuthInstance(auth);

    const setupAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
          console.log("Signed in with custom token.");
        } else {
          await signInAnonymously(auth);
          console.log("Signed in anonymously.");
        }
      } catch (error: any) {
        console.error("Initial authentication failed:", error);
        setMessage(`Auth error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && !currentUser.isAnonymous && firestore) {
        saveUserProfileToFirestore(currentUser, firestore);
      }
      if (currentUser && !currentUser.isAnonymous && !loading) {
        navigate('/');
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, navigate]);

  async function saveUserProfileToFirestore(user: any, firestore: any) {
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
        console.log("User profile saved to Firestore.");
      }
    } catch (error: any) {
      console.error("Error saving user profile to Firestore:", error);
      setMessage(`Firestore error: ${error.message}`);
    }
  }

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setMessage('');
    try {
      if (!authInstance) throw new Error("Firebase Auth not initialized.");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(authInstance, provider);
      setMessage('Successfully signed in with Google!');
      navigate('/');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        setMessage('Google Sign-In cancelled.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setMessage('Google Sign-In already in progress.');
      } else {
        setMessage(`Google Sign-In failed: ${error.message}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Fix for reCAPTCHA: Properly clear previous reCAPTCHA before re-initializing
  const handleSendOtp = async () => {
    setAuthLoading(true);
    setMessage('');
    try {
      if (!authInstance) throw new Error("Firebase Auth not initialized.");
      if (!phoneNumber) {
        setMessage("Please enter a phone number.");
        setAuthLoading(false);
        return;
      }
      if (!recaptchaContainerRef.current) {
        setMessage("reCAPTCHA container not found. Ensure the div with id='recaptcha-container' is in your index.html.");
        setAuthLoading(false);
        return;
      }
      // Clean up old reCAPTCHA if exists (prevents duplicate re-render error)
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {}
        window.recaptchaVerifier = null;
      }
      // Now create a new one
      window.recaptchaVerifier = new RecaptchaVerifier(authInstance, recaptchaContainerRef.current, {
        'size': 'normal',
        'callback': () => {},
        'expired-callback': () => {
          setMessage("reCAPTCHA expired. Please try again.");
          setAuthLoading(false);
        }
      });
      await window.recaptchaVerifier.render();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(authInstance, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setMessage('OTP sent successfully! Please enter the code.');
    } catch (error: any) {
      if (error.code === 'auth/invalid-phone-number') {
        setMessage('Invalid phone number format. Please include country code (e.g., +91).');
      } else if (error.code === 'auth/too-many-requests') {
        setMessage('Too many OTP requests. Please try again later.');
      } else if (error.code === 'auth/admin-restricted-operation') {
        setMessage('Phone authentication is restricted. Please check Firebase project settings (reCAPTCHA, domains).');
      } else if (error.code === 'auth/web-storage-unsupported') {
        setMessage('Web storage is not supported in this browser. Please enable cookies.');
      } else if (
        error.message?.includes('recaptcha has already been rendered') // Covers odd cases
      ) {
        setMessage("Phone authentication is temporarily unavailable. Please reload the page and try again.");
      } else {
        setMessage(`Failed to send OTP: ${error.message}`);
      }
    } finally {
      setAuthLoading(false);
      // Clean up on error/finally for reliability
      if (window.recaptchaVerifier && window.recaptchaVerifier.clear) {
        try { window.recaptchaVerifier.clear(); } catch {}
        window.recaptchaVerifier = null;
      }
    }
  };

  const handleVerifyOtp = async () => {
    setAuthLoading(true);
    setMessage('');
    try {
      if (!confirmationResult) {
        setMessage('No confirmation result found. Please send OTP first.');
        setAuthLoading(false);
        return;
      }
      if (!otp) {
        setMessage('Please enter the OTP.');
        setAuthLoading(false);
        return;
      }
      await confirmationResult.confirm(otp);
      setMessage('Phone number verified successfully!');
      setOtp('');
      if (window.recaptchaVerifier && window.recaptchaVerifier.clear) {
        try { window.recaptchaVerifier.clear(); } catch {}
        window.recaptchaVerifier = null;
      }
      navigate('/'); // Redirect to Home on success
    } catch (error: any) {
      if (error.code === 'auth/invalid-verification-code') {
        setMessage('Invalid OTP. Please try again.');
      } else if (error.code === 'auth/code-expired') {
        setMessage('OTP expired. Please resend.');
      } else {
        setMessage(`OTP verification failed: ${error.message}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    setMessage('');
    try {
      if (!authInstance) throw new Error("Firebase Auth not initialized.");
      await authInstance.signOut();
      setMessage('Signed out successfully.');
      navigate('/signed-out');
    } catch (error: any) {
      setMessage(`Sign out failed: ${error.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 font-inter antialiased">
        <div className="text-gray-700 text-xl">Loading authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4 font-inter antialiased">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 max-w-md w-full space-y-6 text-center">
        {/* Page Header */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to Cookie Gallery!</h1>
        <p className="text-lg text-gray-600 mb-6">Sign in to unlock exclusive sweet deals.</p>

        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          {user && !user.isAnonymous ? "You're Logged In!" : "Sign In / Sign Up"}
        </h2>

        {user && !user.isAnonymous ? (
          <div className="space-y-4">
            <p className="text-gray-700 text-lg">
              Logged in as: <span className="font-semibold">{user.displayName || user.email || user.phoneNumber || user.uid}</span>
            </p>
            <button
              onClick={handleSignOut}
              disabled={authLoading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              {authLoading ? 'Signing Out...' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Google Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              {authLoading ? (
                <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Signing In...</span>
              ) : (
                <>
                  {/* Use your imported GoogleSVG - or paste SVG inline here */}
                  <GoogleSVG className="w-5 h-5" />
                  Sign in with Google
                </>
              )}
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or sign in with phone</span>
              </div>
            </div>
            {/* Phone Number Sign-In */}
            {!confirmationResult ? (
              <div className="space-y-4">
                <input
                  type="tel"
                  placeholder="Enter phone number (e.g., +919876543210)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-transparent text-gray-800 bg-white"
                  autoComplete="tel"
                  disabled={authLoading}
                />
                <button
                  onClick={handleSendOtp}
                  disabled={authLoading || !phoneNumber}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300"
                >
                  {authLoading ? (
                    <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Sending OTP...</span>
                  ) : (
                    'Send OTP'
                  )}
                </button>
                <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-transparent text-gray-800 bg-white"
                  autoComplete="one-time-code"
                  disabled={authLoading}
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={authLoading || !otp}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300"
                >
                  {authLoading ? (
                    <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Verifying OTP...</span>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg ${message.toLowerCase().includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
