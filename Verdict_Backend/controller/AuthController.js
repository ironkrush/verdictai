const signupModel = require("../model/SignupModel");
const LoginModel = require("../model/LoginModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mailer = require("../util/MailUtil")
const otpSchema = require("../model/OTPSchema")
const otpsender = require("../util/OTPSender")

const UserSignup = async (req, res) => {
    try {
        console.log(req.body);

        const { email, password } = req.body;

        // Check if the email already exists in the signup table
        const existingUser = await signupModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists. Please use a different email.",
            });
        }

        // Encrypt the password (✅ Corrected)
        const hashedPassword = await bcrypt.hash(password, 10); // ✅ Added 'await'

        // Create user object for the signup table
        const UserObject = { ...req.body, password: hashedPassword };

        // Save user to the signup table
        const saveUser = await signupModel.create(UserObject);

        if (saveUser) {
            return res.status(201).json({
                success: true,
                message: "User created successfully",
                userData: saveUser,
                redirectUrl: "/signin",
            });
        }
        else {
            return res.status(400).json({
                message: "Failed to create user",
            });
        }
    } catch (error) {
        console.error("Error during signup:", error);

        return res.status(500).json({
            message: "An error occurred during signup. Please try again later.",
        });
    }
};
const SendOTPOnForgotPassword = async (req, res) => {
    try {
        const userEmail = req.body.email;
        if (!userEmail) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if the email exists in LoginModel
        const emailRecord = await signupModel.findOne({ email: userEmail });
        console.log("Email Record:", emailRecord); // Debug
        if (!emailRecord) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Generate OTP
        const myotp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        console.log("Generated OTP:", myotp); // Debug

        // Save OTP in the database
        // await otpSchema.create({ email: userEmail, otp: myotp, createdAt: Date.now() });
        await otpSchema.create({
            email: userEmail,
            otp: myotp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes validity
        });
        // Retrieve user details from signupModel
        const user = await signupModel.findOne({ email: userEmail });
        console.log("User Record:", user); // Debug
        if (!user) {
            return res.status(404).json({ message: "User not found in signup records" });
        }

        // Send OTP email
        try {
            await otpsender.sendMail(
                userEmail,
                "OTP to Create a New Password",
                `Hello ${user.firstname}, Your One - Time Password(OTP) for BloodSync is: ${myotp}.`
            );
            console.log("OTP email sent successfully");
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            throw new Error("Failed to send OTP email");
        }

        res.status(200).json({
            message: "OTP Sent Successfully!!",
            redirectUrl: "/Otppage",
        });


    } catch (err) {
        console.error("Error in SendOTPToMail:", err);
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await signupModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Email ID Doesn't Exist",
                status: 404,
            });
        }

        // Check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Email or Password Not Found",
                status: 400,
            });
        }

        // Generate JWT token
        const createdToken = jwt.sign(
            { email: user.email, id: user._id, role: user.role },
            "Galu_0106",
            { expiresIn: "30m" }
        );

        // Update or create login record
        const loginData = { role: user.role, lastLogin: new Date() };

        const existingLogin = await LoginModel.findOneAndUpdate(
            { email: user.email },
            { $set: loginData },
            { upsert: true, new: true }
        );

        // Send email notification (optional)
        await mailer.sendMail(user.email, "Welcome to VerdictAI!", "You have logged in successfully.");

        // Set cookie securely
        res.cookie("authToken", createdToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
        });

        return res.status(200).json({
            success: true,
            message: "You Have Logged In Successfully",
            token: createdToken,
            user,  // Fixed casing
            redirectUrl: "/landingpage"
        });

    } catch (error) {
        console.error("Error during login:", error);

        res.status(500).json({
            message: "Something Went Wrong!!",
            error: error.message,
            status: 500,
        });
    }
};
const verifyOTP = async (req, res) => {
    try {
        const { otp, email } = req.body;

        console.log("Request OTP:", otp);

        // Validate input
        if (!otp || !email) {
            return res.status(400).json({ message: "OTP and email are required." });
        }

        // Fetch stored OTP from database (case-insensitive email match)
        const storedOtp = await otpSchema.findOne({ email: new RegExp(`^${email}$`, "i") });

        if (!storedOtp) {
            return res.status(404).json({ message: "OTP not found for this email." });
        }

        console.log("Stored OTP from DB:", storedOtp);

        // Ensure stored OTP exists before comparison
        if (!storedOtp.otp) {
            return res.status(400).json({ message: "Invalid OTP record." });
        }

        // ✅ Convert OTP to string before comparison to prevent trim error
        if (otp.toString().trim() !== storedOtp.otp.toString().trim()) {
            return res.status(401).json({ message: "Invalid OTP." });
        }

        // Check if OTP is expired
        if (new Date(storedOtp.expiresAt) < new Date()) {
            return res.status(400).json({ message: "OTP has expired." });
        }

        // OTP verification successful
        res.status(200).json({ message: "OTP verified successfully." });

        // Delete OTP after successful verification
        await otpSchema.deleteOne({ email: new RegExp(`^${email}$`, "i") });

    } catch (err) {
        console.error("Error in VerifyOTP:", err);
        res.status(500).json({
            message: "Error in verifying OTP.",
            error: err.message,
        });
    }
};
const updatePassword = async (req, res) => {
    try {
        const { password, email } = req.body;

        // Validate input
        if (!password && !email) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password
        const updatedUser = await signupModel.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "Failed to update password." });
        }

        // Delete OTP after successful password update
        await otpSchema.deleteOne({ email });

        // Return success message
        res.status(200).json({
            message: "Password updated successfully.",
            redirectUrl: "/login",
        });
    } catch (err) {
        res.status(500).json({
            message: "Error in updating password.",
            error: err.message,
        });
    }
};

module.exports = {
    UserSignup,
    loginUser,
    SendOTPOnForgotPassword,
    updatePassword,
    verifyOTP
};


// Code for testing
/*
const signupModel = require("../model/SignupModel");
const LoginModel = require("../model/LoginModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../util/MailUtil");
const otpSchema = require("../model/OTPSchema");
const otpsender = require("../util/OTPSender");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await signupModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email ID Doesn't Exist" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Email or Password Not Found" });
        }

        const createdToken = jwt.sign(
            { email: user.email, id: user._id, role: user.role },
            "Galu_0106",
            { expiresIn: "1h" }
        );

        await LoginModel.updateOne(
            { email: user.email },
            { $set: { password: user.password, role: user.role, lastLogin: new Date() } },
            { upsert: true }
        );

        await mailer.sendMail(user.email, "Welcome to VerdictAI!", "You have logged in successfully.");

        res.cookie("authToken", createdToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
        });

        return res.status(200).json({
            success: true,
            message: "You Have Logged In Successfully",
            token: createdToken,
            User: user,
            redirectUrl: "/landingpage"
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Something Went Wrong!!" });
    }
};

const SendOTPOnForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await signupModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email not found" });

        const myotp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

        await otpSchema.create({
            email,
            otp: myotp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
        });

        await otpsender.sendMail(
            email,
            "OTP to Create a New Password",
            `Hello ${user.firstname}, Your One-Time Password (OTP) for BloodSync is: ${myotp}.`
        );

        res.status(200).json({ message: "OTP Sent Successfully!!", redirectUrl: "/Otppage" });

    } catch (err) {
        console.error("Error in SendOTPOnForgotPassword:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { otp, email } = req.body;

        const storedOtp = await otpSchema.findOne({ email: new RegExp(`^${email}$`, "i") });
        if (!storedOtp) return res.status(404).json({ message: "OTP not found for this email." });

        if (storedOtp.expiresAt < Date.now()) {
            await otpSchema.deleteOne({ email });
            return res.status(400).json({ message: "OTP has expired." });
        }

        if (otp.trim() !== storedOtp.otp.toString().trim()) {
            return res.status(401).json({ message: "Invalid OTP." });
        }

        await otpSchema.deleteOne({ email });
        res.status(200).json({ message: "OTP verified successfully." });

    } catch (err) {
        res.status(500).json({ message: "Error in verifying OTP." });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (!password || !confirmPassword) return res.status(400).json({ message: "All fields are required." });
        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match." });

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await LoginModel.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) return res.status(400).json({ message: "Failed to update password." });

        await otpSchema.deleteOne({ email });

        res.status(200).json({ message: "Password updated successfully.", redirectUrl: "/login" });

    } catch (err) {
        res.status(500).json({ message: "Error in updating password." });
    }
};

module.exports = {
    UserSignup,
    loginUser,
    SendOTPOnForgotPassword,
    updatePassword,
    verifyOTP
};


*/