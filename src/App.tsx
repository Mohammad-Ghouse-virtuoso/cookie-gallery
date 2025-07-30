import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Checkout from "./pages/CheckOut";  // If you don't need this yet, remove this line and its <Route>.
import OrderSuccess from "./pages/OrderSuccess";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} /> {/* Optional; remove if not needed */}
        <Route path="/OrderSuccess" element={<OrderSuccess />} ></Route>
        <Route path="/signin" element={<SignIn />} ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
