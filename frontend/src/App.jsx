import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AnimatedRoutes from "./components/layout/AnimatedRoutes";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white text-black">

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