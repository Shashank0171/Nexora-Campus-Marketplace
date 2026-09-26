import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AnimatedRoutes from "./components/layout/AnimatedRoutes";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white text-black">

        {/* TOAST NOTIFICATIONS */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: "12px", fontFamily: "Inter, sans-serif" },
          }}
        />

        {/* NAVBAR */}
        <Navbar />

        {/* ROUTES WITH ANIMATION */}
        <main className="flex-1 pt-16">
          <AnimatedRoutes />
        </main>

        {/* FOOTER */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;