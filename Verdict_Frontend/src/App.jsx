import { useEffect, useState, useRef } from 'react';
import Nav from './components/Nav';
import Scroll from './components/Scroll';
import Footer from './components/Footer';
import Features from './components/Features';
import Bento from './components/Bento';
import Faq from './components/Faq';
import Partical from './components/Partical';
import VerdictAI from './components/Verdictai';
import Pricing from './components/Pricing';

function App() {
  // Refs for each section
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const servicesRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);
  const verdictRef = useRef(null);

  // State to track authentication
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Show Navbar only if not logged in */}
      {!token && (
        <Nav
          homeRef={homeRef}
          featuresRef={featuresRef}
          servicesRef={servicesRef}
          pricingRef={pricingRef}
          faqRef={faqRef}
        />
      )}

      {/* Verdict AI Section (Always Visible) */}
      <div ref={verdictRef}>
        <VerdictAI />
      </div>

      {/* Show other sections only if not logged in */}
      {!token && (
        <>
          <div ref={homeRef}>
            <Scroll />
          </div>
          <Partical />
          <div ref={featuresRef}>
            <Features />
          </div>
          <div ref={servicesRef}>
            <Bento />
          </div>
          <div ref={pricingRef}>
            <Pricing />
          </div>
          <div ref={faqRef}>
            <Faq />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
