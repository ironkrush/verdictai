import { useState, useEffect } from "react"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, KeyRound, CheckCircle } from "lucide-react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";



export default function AuthComponent({ onClose }) {
  const [view, setView] = useState("login")
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  })
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isloggedin, setisloggedin] = useState(false);
  const [text, settext] = useState("Sign in")
  const { register, handleSubmit, reset } = useForm();

  // Reset error and success messages when view changes
  useEffect(() => {
    setError("")
    setSuccess("")
  }, [view, forgotPasswordStep])

  useEffect(() => {
    if (localStorage.getItem("token")) {
      onClose();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const togglePasswordVisibility = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }


  const API = "http://localhost:3000/user";

  const handleLogin = async (data) => {
    try {
      settext("Signing...!")
      const response = await axios.post(`${API}/login`, data);
      console.log("response ->>", response.data);

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.username);

        console.log("Stored Email:", user.email);
        console.log("Stored Username:", user.username);
      }

      setSuccess("Login successful!");
      onClose();
     window.location.reload()

    } catch (error) {
      console.error("Error => ", error);

      const errorMessage =
        error.response?.data?.message || "Invalid credentials. Please try again.";

      setError(errorMessage);
    }
  };

  const handleSignup = async (data) => {
    setError("");
    setSuccess("");


    if (!data.username || !data.email || !data.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(`${API}/signup`, data);

      console.log("Full Response:", response);
      console.log("Response Data:", response.data);

      if (response.status >= 200 && response.status < 300 && (response.data?.success || response.data?.message)) {
        setSuccess(response.data.message || "Account created successfully!");
        reset(); // Clears form

        setTimeout(() => {
          setSuccess("");
          setView("login");
        }, 2000);
      } else {
        setError(response.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error =>", error);

      let errorMessage = "Signup failed. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "No response from the server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
    }
  };

  const handleForgotPasswordEmail = async (data) => {
    // Validate email
    if (!formData.email) {
      setError("Please enter your email")
      return
    }
    try {

      const response = await axios.post(`${API}/forgotpassword`, data);
      localStorage.setItem("userEmail", formData.email)
      console.log(response.data);


      setSuccess("Verification code sent!")
      console.log("Sending OTP to:", formData.email)
    } catch (error) {

    }
    // Simulate sending OTP

    // Move to next step
    setTimeout(() => {
      setSuccess("")
      setForgotPasswordStep(2)
    }, 1500)
  }

  const handleOtpSubmit = async (data) => {
    // Validate OTP
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }
    try {
      const response = await axios.post(`${API}/verify`, {
        email: localStorage.getItem("userEmail"),
        otp: otpValue
      });
      console.log(response.data);

      setSuccess("Code verified successfully!")
      console.log("Verifying OTP:", otpValue)
    } catch (error) {
      console.log("Error is => ", error);

    }
    // Simulate OTP verification
    // Move to next step
    setTimeout(() => {
      setSuccess("")
      setForgotPasswordStep(3)
    }, 1500)

  }
  const handleResetPassword = async (data) => {

    // Validate passwords
    if (!formData.password) {
      setError("Please fill in all fields")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    try {

      const response = await axios.post(`${API}/updatepassword`, {
        email: localStorage.getItem("userEmail"),
        password: formData.password
      });
      console.log(response.data);

      setSuccess("Password reset successfully!")
      console.log("Resetting password for:", formData.email)
    } catch (error) {
      console.log("Error is =>", error);

    }
    // Simulate password reset


    // Redirect to login after success
    setTimeout(() => {
      setSuccess("")
      setView("login")
      setForgotPasswordStep(1)
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        showPassword: false,
        showConfirmPassword: false,
      }))
    }, 2000)
  }

  const resetView = () => {
    if (view === "forgot-password" && forgotPasswordStep > 1) {
      setForgotPasswordStep(forgotPasswordStep - 1)
    } else {
      setView("login")
      setForgotPasswordStep(1)
    }
  }

  return (

    <div className="w-full max-w-md relative flex flex-col justify-center gap-5">
      {/* Card with silver gradient border */}
      <button className="w-full flex justify-center items-center group " onClick={onClose}>
        <div className="h-10 w-10 border border-neutral-300 flex items-center justify-center rounded-[50%] 
                  transition cursor-pointer group-hover:scale-105">
          ✕
        </div>
      </button>

      <div className="relative rounded-xl overflow-hidden p-[1px] bg-gradient-to-r from-zinc-400/20 via-white/40 to-zinc-400/20 shadow-2xl">
        <div className="bg-black rounded-xl p-8 backdrop-blur-xl">
          {/* Back button */}
          {(view !== "login" || (view === "forgot-password" && forgotPasswordStep > 1)) && (
            <button
              onClick={resetView}
              className="absolute top-4 left-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* Form header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-2">
              {view === "login" && <Lock className="h-8 w-8 text-white/80 mx-auto" />}
              {view === "signup" && <User className="h-8 w-8 text-white/80 mx-auto" />}
              {view === "forgot-password" && <KeyRound className="h-8 w-8 text-white/80 mx-auto" />}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {view === "login" && "Welcome Back"}
              {view === "signup" && "Create Account"}
              {view === "forgot-password" && forgotPasswordStep === 1 && "Reset Password"}
              {view === "forgot-password" && forgotPasswordStep === 2 && "Verify Code"}
              {view === "forgot-password" && forgotPasswordStep === 3 && "New Password"}
            </h1>
            <p className="text-zinc-400">
              {view === "login" && "Sign in to your account to continue"}
              {view === "signup" && "Fill in your details to get started"}
              {view === "forgot-password" &&
                forgotPasswordStep === 1 &&
                "Enter your email to receive a verification code"}
              {view === "forgot-password" && forgotPasswordStep === 2 && "Enter the 6-digit code sent to your email"}
              {view === "forgot-password" && forgotPasswordStep === 3 && "Create a new secure password"}
            </p>
          </div>

          {/* Error and success messages */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-200 text-sm flex items-center">
              <span className="mr-2">●</span> {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-emerald-900/30 border border-emerald-800 rounded-md text-emerald-200 text-sm flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> {success}
            </div>
          )}

          {/* Login Form */}
          {view === "login" && (
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    id="email"
                    {...register("email")}
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-md bg-zinc-900/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setView("forgot-password")}
                    className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    id="password"
                    {...register("password")}
                    type={formData.showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 rounded-md bg-zinc-900/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white transition-colors"
                    onClick={() => togglePasswordVisibility("showPassword")}
                  >
                    {formData.showPassword ? <EyeOff className="cursor-pointer" size={18} /> : <Eye className="cursor-pointer" size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 mt-6 cursor-pointer bg-gradient-to-r from-zinc-200 to-white text-black font-medium rounded-md hover:from-white hover:to-zinc-200 transition-all duration-300 shadow-lg shadow-white/10 transform hover:-translate-y-0.5"
              >
                {text}
              </button>

              <div className="text-center mt-6">
                <p className="text-zinc-400">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setView("signup")}
                    className="text-white hover:text-zinc-200 font-medium transition-colors cursor-pointer"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {view === "signup" && (
            <form onSubmit={handleSubmit(handleSignup)} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    id="username"
                    {...register("username")}
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-md bg-zinc-900/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    id="email"
                    {...register("email")}
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-md bg-zinc-900/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    id="password"
                    {...register("password")}
                    type={formData.showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 rounded-md bg-zinc-900/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white transition-colors"
                    onClick={() => togglePasswordVisibility("showPassword")}
                  >
                    {formData.showPassword ? <EyeOff className="cursor-pointer" size={18} /> : <Eye className="cursor-pointer" size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full py-3 px-4 mt-6 bg-gradient-to-r from-zinc-200 to-white text-black font-medium rounded-md hover:from-white hover:to-zinc-200 transition-all duration-300 shadow-lg shadow-white/10 transform hover:-translate-y-0.5"
              >
                Create Account
              </button>

              <div className="text-center mt-6">
                <p className="text-zinc-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="text-white hover:text-zinc-200 font-medium transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Forgot Password Flow */}
          {view === "forgot-password" && (
            <>
              {/* Step 1: Email Input */}
              {forgotPasswordStep === 1 && (
                <form onSubmit={handleSubmit(handleForgotPasswordEmail)} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-zinc-500" />
                      </div>
                      <input
                        id="email"
                        {...register("email")}
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-md bg-zinc-900/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-zinc-200 to-white text-black font-medium rounded-md hover:from-white hover:to-zinc-200 transition-all duration-300 shadow-lg shadow-white/10 transform hover:-translate-y-0.5"
                  >
                    Send Verification Code
                  </button>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {forgotPasswordStep === 2 && (
                <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-5">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-zinc-300">Verification Code</label>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="w-12 h-12 text-center text-xl rounded-md bg-zinc-900/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-zinc-200 to-white text-black font-medium rounded-md hover:from-white hover:to-zinc-200 transition-all duration-300 shadow-lg shadow-white/10 transform hover:-translate-y-0.5"
                  >
                    Verify Code
                  </button>
                </form>
              )}

              {/* Step 3: New Password */}
              {forgotPasswordStep === 3 && (
                <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-zinc-500" />
                      </div>
                      <input
                        id="password"
                        {...register("password")}
                        type={formData.showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-3 rounded-md bg-zinc-900/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white transition-colors"
                        onClick={() => togglePasswordVisibility("showPassword")}
                      >
                        {formData.showPassword ? <EyeOff className="cursor-pointer" size={18} /> : <Eye className="cursor-pointer" size={18} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-zinc-200 to-white text-black font-medium rounded-md hover:from-white hover:to-zinc-200 transition-all duration-300 shadow-lg shadow-white/10 transform hover:-translate-y-0.5"
                  >
                    Reset Password
                  </button>
                </form>
              )}
            </>
          )}

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>

      {/* Decorative glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 to-transparent blur-xl opacity-30 -z-10 rounded-xl"></div>
    </div>

  )
}

