require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const passport = require("passport");
const cors = require("cors");

require("./config/passport");
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "https://univprephub.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// 🔑 Preflight request support (VERY IMPORTANT)
app.options("*", cors());


// Passport Init
app.use(passport.initialize());

app.use(
    "/admin/premium",
    require("./routes/premiumContentRoutes")
);

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/note", require("./routes/noteRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/admin/course-subjects", require("./routes/courseSubjectRoutes"));

// ✅ Logout (env based redirect)
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect(`${process.env.FRONTEND_URL}/`);
});

// Default API Home
app.get("/", (req, res) => {
    res.send("Server running...");
});

// ✅ PORT from env (Render ready)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
