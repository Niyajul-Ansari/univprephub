const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

/* ===============================
   GENERATE UNIQUE 5 DIGIT SECRET
================================ */
const generateSecretCode = async () => {
    let code, exists = true;

    while (exists) {
        code = Math.floor(10000 + Math.random() * 90000).toString();
        exists = await User.findOne({ secretCode: code });
    }

    return code;
};

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email,
                        googleId: profile.id,

                        // 🔐 REQUIRED FIELDS
                        secretCode: await generateSecretCode(),
                        token: uuidv4(),
                        role: "user",
                        isApproved: false // admin will approve later
                    });
                }

                return done(null, user);
            } catch (err) {
                console.error("Google Auth Error:", err);
                return done(err, null);
            }
        }
    )
);

// session not used, but safe to keep
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
