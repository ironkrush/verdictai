import { useState } from "react";
import Light from "../assets/light.svg";
import { Check } from "lucide-react";

const Pricing = () => {
    const [isYearly, setIsYearly] = useState(true);

    // Pricing Data
    const pricing = {
        yearly: {
            starter: { price: "₹999", duration: "/ month" },
            professional: { price: "₹1,599", duration: "/ month" },
        },
        monthly: {
            starter: { price: "₹1,299", duration: "/ month" },
            professional: { price: "₹2,499", duration: "/ month" },
        },
    };

    return (
        <div className="bg-black h-screen text-white w-full">
            <div className="mx-36 pt-20">
                <h1 className="text-4xl text-center font-bold">Pricing</h1>
                <div className="text-xl text-center text-gray-500 px-56 pt-3">
                    Get started with AI-powered legal assistance for free.
                    Upgrade for advanced features and expert collaboration.
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center justify-center mt-8">
                    <div className="relative flex bg-[#25262b] p-1 rounded-full w-72 h-10 shadow-lg">
                        <div
                            className={`absolute top-0 left-0 h-full w-1/2 bg-[#303136] rounded-full transition-all duration-300 ${isYearly ? "translate-x-0" : "translate-x-full"
                                }`}
                        ></div>

                        {/* Yearly Button */}
                        <button
                            className={`relative flex-1 py-1 text-sm font-medium z-10 flex items-center justify-center transition-all duration-300 cursor-pointer ${isYearly ? "text-white" : "text-gray-400"
                                }`}
                            onClick={() => setIsYearly(true)}
                        >
                            Yearly
                            <span
                                className={`ml-2 bg-purple-500 text-[10px] text-white px-2 py-[2px] rounded-md shadow-md transition-opacity duration-300 ${isYearly ? "opacity-100" : "opacity-0"
                                    }`}
                            >
                                SAVE 20%
                            </span>
                        </button>

                        {/* Monthly Button */}
                        <button
                            className={`relative flex-1 py-1 text-sm font-medium z-10 flex items-center justify-center transition-all duration-300 cursor-pointer ${!isYearly ? "text-white" : "text-gray-400"
                                }`}
                            onClick={() => setIsYearly(false)}
                        >
                            Monthly
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="flex gap-7 justify-center">
                    {/* Free Plan */}
                    <div className="w-[30%] py-6 px-5 my-10 bg-[#191a1d] rounded-xl">
                        <div className="font-bold text-2xl">Free</div>
                        <div className="mt-5 mb-2">
                            <span className="text-3xl font-bold">₹0</span>{" "}
                            <span className="text-gray-500">/ month</span>
                        </div>
                        <div className="text-sm">Free forever</div>
                        <ul className="text-white text-sm my-4 space-y-2">
                            {[
                                "Basic AI legal assistance",
                                "Limited legal document generation",
                                "General legal FAQs",
                                "Access to legal knowledge base",
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <Check className="text-[#909192] w-4 h-4" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#202124] w-full py-3 mt-20 rounded-xl cursor-pointer">
                            Start for Free
                        </button>
                    </div>

                    {/* Starter Plan */}
                    <div className="w-[30%] py-6 px-5 my-10 bg-[#191a1d] rounded-xl">
                        <div className="flex gap-2 font-bold text-2xl">
                            <span className="bg-[#008cff] w-8 h-8 rounded-full flex justify-center items-center">
                                <img src={Light} alt="" />
                            </span>
                            Starter
                        </div>
                        <div className="mt-5 mb-2">
                            <span className="text-3xl font-bold">
                                {isYearly ? pricing.yearly.starter.price : pricing.monthly.starter.price}
                            </span>{" "}
                            <span className="text-gray-500">
                                {isYearly ? pricing.yearly.starter.duration : pricing.monthly.starter.duration}
                            </span>
                        </div>
                        <div className="text-sm">
                            {isYearly ? "Billed Annually" : "Billed Monthly"}
                        </div>
                        <div className="mt-4 mb-1 text-gray-400">Everything in Free, plus:</div>
                        <ul className="text-white text-sm my-4 space-y-2">
                            {[
                                "Up to 5 legal consultations per month",
                                "AI-powered document drafting",
                                "Priority response time",
                                "Secure cloud storage for documents",
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <Check className="text-blue-400 w-4 h-4" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#008cff] w-full py-3 mt-10 rounded-xl cursor-pointer">
                            Upgrade
                        </button>
                    </div>

                    {/* Professional Plan */}
                    <div className="w-[30%] py-6 px-5 my-10 bg-[#191a1d] rounded-xl">
                        <div className="flex gap-2 font-bold text-2xl">
                            <span className="bg-[#00a67b] w-8 h-8 rounded-full flex justify-center items-center">
                                <img src={Light} alt="" />
                            </span>
                            Professional
                        </div>
                        <div className="mt-5 mb-2">
                            <span className="text-3xl font-bold">
                                {isYearly ? pricing.yearly.professional.price : pricing.monthly.professional.price}
                            </span>{" "}
                            <span className="text-gray-500">
                                {isYearly ? pricing.yearly.professional.duration : pricing.monthly.professional.duration}
                            </span>
                        </div>
                        <div className="text-sm">
                            {isYearly ? "Billed Annually" : "Billed Monthly"}
                        </div>
                        <div className="mt-4 mb-1 text-gray-400">Everything in Free, plus:</div>
                        <ul className="text-white text-sm my-4 space-y-2">
                            {[
                                "Unlimited legal consultations",
                                "Advanced AI legal analysis",
                                "Custom contract generation",
                                "API access for integrations",
                                "Case tracking system",
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <Check className="text-[#00a67b] w-4 h-4" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#00a67b] w-full py-3 mt-3 rounded-xl cursor-pointer">
                            Upgrade
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;