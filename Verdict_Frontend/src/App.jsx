import { useEffect, useState } from "react";
import VerdictAI from "./components/Verdictai";
import Nav from "./components/Nav";
import Scroll from "./components/Scroll";
import Features from "./components/Features";
import Bento from "./components/Bento";
import Pricing from "./components/Pricing";
import Faq from "./components/Faq";
import Footer from "./components/Footer"
import Partical from "./components/Partical";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // 🔹 login handler (call this after successful login)
  const handleLogin = (token) => {
    setLoading(true);
    localStorage.setItem("token", token);

    setTimeout(() => {
      setToken(token);
      setLoading(false);
    }, 1000); // small delay for smooth UX
  };

  // 🔹 logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // -----------------------
  // LOADING SCREEN
  // -----------------------
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (token) {
    return (
      <div className="bg-black min-h-screen text-white">
        <VerdictAI />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Nav />
      <Scroll />
      <Partical />
      <Features />
      <Bento />
      <Pricing />
      <Faq />
      <Footer></Footer>
    </div>
  );
}

export default App;
