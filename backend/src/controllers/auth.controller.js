import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import transporter from "../utils/nodemailer.js";
import crypto from "crypto";
import OTP from "../models/otp.model.js";

function generateOtp() {
    return crypto.randomInt(100000, 1_000_000).toString();
}


export const register = async (req, res) => {
    try {
        
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Please provide all fields!",
                success: false
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        console.log(token);
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        await newUser.save();

        const user = newUser.toObject();
        delete user.password;
        return res.status(201).json({user,success:true,message:"Register Successfull"});
    } catch (error) {
        console.log("Error in register controller ", error);
        res.status(500).json({ message: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Please Provide all fields",
                success: false
            })
        }
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "Email doesn't exist",
                success: false
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        delete user.password;
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });
        return res.status(200).json({
            message: "Login successful",
            success: true,
            user
        })
    } catch (error) {
        console.log("Error in login controller ", error);
        res.status(500).json({ message: error.message });
    }
}
export const me = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            message: "Fetched you!",
            success: true,
            user
        });
    } catch (error) {
        console.log("Error in me controller ", error);
        res.status(500).json({ message: error.message });
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller ", error);
        res.status(500).json({ message: error.message });
    }
};

export const googleLogin = async (req, res) => {
    try {

    } catch (error) {

    }
}

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email not found!",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found!",
                success: false
            })
        }
        const code = generateOtp();
        const otp = new OTP({
            userId: user._id,
            attempts: 3,
            otpValue: code
        })
        await otp.save();
        const htmlTemplate = `<div style="font-family: Arial, sans-serif; background:#f7f7f7; padding:20px;">
  <div style="
    max-width:400px;
    margin:auto;
    background:white;
    padding:20px;
    border-radius:8px;
    box-shadow:0 2px 6px rgba(0,0,0,0.1);
  ">
    
    <h2 style="text-align:center; color:#333; margin-bottom:10px;">
      Your Verification Code
    </h2>

    <p style="font-size:15px; color:#555; text-align:center;">
      Please use the following OTP to verify your account:
    </p>

    <h1 style="
      text-align:center;
      letter-spacing:4px;
      color:#2c7be5;
      margin:20px 0;
    ">
      {{code}}
    </h1>

    <p style="font-size:13px; text-align:center; color:#777;">
      This code is valid for 5 minutes. Do not share it with anyone.
    </p>

  </div>
</div>`
        const finalHtml = htmlTemplate.replace("{{code}}", code);

        const mailOptions = {
            from: "Gaurav Yadav",
            to: "23je0352@iitism.ac.in",
            subject: "Verification Code for webapp",
            html: finalHtml
        }
        console.log(otp.otpValue);
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            message: "mail sent successfully!",
            success: true
        })
    } catch (error) {
        console.log("Error in sending mail ", error);
    }
}
export const verifyOtp = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code || code.length !== 6) {
            return res.status(400).json({
                message: "Please enter valid code",
                success: false
            })
        }
        const userId = req.user._id;
        const otp = await OTP.findOne({ userId: userId });

        if (!otp) {
            return res.status(400).json({
                message: "Please generate a otp first",
                success: false
            })
        }
        if (otp.attempts <= 0) {
            return res.status(400).json({
                message: "Please generate a otp first",
                success: false
            })
        }
        if (code !== otp.otpValue) {
            otp.attempts -= 1;
            if (otp.attempts === 0) {
                await OTP.deleteOne({ _id: otp._id });
                return res.status(400).json({
                    message: "You reached your limit, try again later",
                    success: false
                })
            }
            await otp.save();
            return res.status(400).json({
                message: "Wrong otp!",
                success: false
            })
        }
        const user = await User.findByIdAndUpdate(
            userId,
            { isVerified: true },
            { new: true }
        ).select("-password");
        return res.status(200).json({
            message:"Email Verification done",
            success:true,
            user
        })
    } catch (error) {
        console.log("Error in verifying mail ", error);
    }
}