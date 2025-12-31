const signupModel = require("../model/SignupModel");
const LoginModel = require("../model/LoginModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpSchema = require("../model/OTPSchema");

// ======================= SIGNUP =======================
const UserSignup = async (req, res) => {
    try {
        const { email, password, ...rest } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const existingUser = await signupModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await signupModel.create({
            ...rest,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Signup failed" });
    }
};

// ======================= LOGIN =======================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await signupModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "Galu_0106",
            { expiresIn: "30m" }
        );

        await LoginModel.findOneAndUpdate(
            { email: user.email },
            { lastLogin: new Date(), role: user.role },
            { upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user,
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Login failed" });
    }
};

// ======================= SEND OTP =======================
const SendOTPOnForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "Email required" });

        const user = await signupModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email not found" });

        const otp = Math.floor(100000 + Math.random() * 900000);

        await otpSchema.create({
            email,
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000
        });

        // OPTIONAL: send mail here

        res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

// ======================= VERIFY OTP =======================
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const record = await otpSchema.findOne({ email });

        if (!record) {
            return res.status(404).json({ message: "OTP not found" });
        }

        if (Date.now() > record.expiresAt) {
            await otpSchema.deleteOne({ email });
            return res.status(400).json({ message: "OTP expired" });
        }

        if (otp.toString() !== record.otp.toString()) {
            return res.status(401).json({ message: "Invalid OTP" });
        }

        await otpSchema.deleteOne({ email });

        res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.error("OTP Verify Error:", error);
        res.status(500).json({ message: "OTP verification failed" });
    }
};

// ======================= RESET PASSWORD =======================
const updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const updated = await signupModel.findOneAndUpdate(
            { email },
            { password: hashed },
            { new: true }
        );

        if (!updated) {
            return res.status(400).json({ message: "User not found" });
        }

        await otpSchema.deleteOne({ email });

        res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Update Password Error:", error);
        res.status(500).json({ message: "Password update failed" });
    }
};

module.exports = {
    UserSignup,
    loginUser,
    SendOTPOnForgotPassword,
    verifyOTP,
    updatePassword,
};
