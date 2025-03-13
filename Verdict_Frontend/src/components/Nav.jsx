import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import AuthForm from "./AuthForm.jsx";

function Nav({ onLogout }) {  // Accept onLogout function from App.jsx
    const [isOpen, setIsOpen] = useState(false);
    const [showAuthForm, setShowAuthForm] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
            setUserEmail(localStorage.getItem("userEmail") || "");
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Logout function (calls the function from App)
    const logoutFunction = () => {
        onLogout();  // Call the logout function from App.jsx
        toast.success("Logged out successfully!", { position: "top-right" });
    };

    return (
        <>
            <header className="sticky top-0 w-full bg-black/50 backdrop-blur-md text-white border-b border-gray-700 shadow-md z-50">
                <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <div className="text-xl font-bold">Verdict.ai</div>

                    <div className="hidden md:flex space-x-6">
                        <a href="#" className="hover:text-gray-400">Home</a>
                        <a href="#" className="hover:text-gray-400">Features</a>
                        <a href="#" className="hover:text-gray-400">Services</a>
                        <a href="#" className="hover:text-gray-400">Pricing</a>
                    </div>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <span className="block text-gray-300 font-semibold">{userEmail}</span>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                onClick={logoutFunction}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                            onClick={() => setShowAuthForm(true)}
                        >
                            Get Started
                        </button>
                    )}

                    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>

                {isOpen && (
                    <div className="md:hidden bg-black text-white py-4 px-6 space-y-4">
                        <a href="#" className="block">Home</a>
                        <a href="#" className="block">Features</a>
                        <a href="#" className="block">Services</a>
                        <a href="#" className="block">Pricing</a>
                        {isLoggedIn ? (
                            <button
                                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                onClick={logoutFunction}
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                className="w-full bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                                onClick={() => setShowAuthForm(true)}
                            >
                                Get Started
                            </button>
                        )}
                    </div>
                )}
            </header>

            {showAuthForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 p-4">
                    <AuthForm onClose={() => setShowAuthForm(false)} />
                </div>
            )}
        </>
    );
}

export default Nav;


// New Code 

