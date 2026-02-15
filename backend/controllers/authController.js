const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");


const generateSecretCode = async () => {
  let code, exists = true;
  while (exists) {
    code = Math.floor(10000 + Math.random() * 90000).toString();
    exists = await User.findOne({ secretCode: code });
  }
  return code;
};


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be 8 chars" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const secretCode = await generateSecretCode();

    await User.create({
      name,
      email,
      password: hash,
      secretCode,
      role: "user",
      isApproved: false
    });

    return res.json({ success: true });

  } catch (err) {
    return res.json({ success: false, message: "Registration failed" });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send("Invalid email or password");
    }

    if (!user.password) {
      return res.send("This account was created using Google login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send("Invalid email or password");
    }

    if (user.role !== "admin" && !user.isApproved) {
      return res.json({
        success: false,
        pending: true,
        message: "Wait for admin approval"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000
    });

    return res.json({
      success: true,
      role: user.role
    });


  } catch (err) {
    console.log(err);
    res.send("Login error");
  }
};
