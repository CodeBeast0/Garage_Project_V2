import userModel from "../models/user.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};


const registerUser = async (req, res) => {
  try {
    const { name, email, password, role} = req.body; // Default role
    console.log(role)
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Validate role
    const validRoles = ["user", "mechanic", "owner"];
    const userRole = validRoles.includes(role) ? role : "user";

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with explicit role assignment
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: userRole, // Explicitly set the role
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    
    res.status(201).json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log("Registration error:", error);
    
    // Handle specific MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${errors.join(', ')}`
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export { registerUser };