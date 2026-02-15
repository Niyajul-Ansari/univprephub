const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { register, login } = require("../controllers/authController");

/* NORMAL AUTH */
router.post("/register", register);
router.post("/login", login);

/* GOOGLE AUTH */
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",
        session: false
    }),
    (req, res) => {
        const token = jwt.sign(
            {
                id: req.user._id,
                role: req.user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
        });

        // ✅ env-based redirect
        if (req.user.role === "admin") {
            return res.redirect(`${process.env.FRONTEND_URL}/admin`);
        } else {
            return res.redirect(`${process.env.FRONTEND_URL}/user-dashboard`);
        }
    }
);

module.exports = router;
