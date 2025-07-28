import { CartProvider } from "./context/CartContext";
import App from "./App";
import React from "react";
import './index.css'
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
<React.StrictMode>
  <CartProvider>
    <App />
  </CartProvider>
</React.StrictMode>
)
