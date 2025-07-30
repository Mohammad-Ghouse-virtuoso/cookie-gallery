// src/App.tsx

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// Import your components
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Checkout from "./pages/CheckOut";
import OrderSuccess from "./pages/OrderSuccess"; // Assuming you have created this page
import SignIn from "./pages/SignIn"; // Your new SignIn page
import SignedOut from "./pages/Signout"; // Your new Signout page

// Import the AuthProvider
import { AuthProvider } from "./context/AuthContext"; // Make sure this path is correct

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/signed-out' || location.pathname === '/signin';

  return (
    <>
      {!hideNavbar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signed-out" element={<SignedOut />} />
        {/* Add more routes as your app grows */}
      </Routes>
    </>
  );
}

function App() {
  return (
    // BrowserRouter is needed for routing
    <BrowserRouter>
      {/* AuthProvider wraps your entire application to provide auth context */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;