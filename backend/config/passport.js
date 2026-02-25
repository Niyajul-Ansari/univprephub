const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

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
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const avatar = profile.photos?.[0]?.value;

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email,
                        googleId: profile.id,
                        avatar,
                        secretCode: await generateSecretCode(),
                        role: "user",
                        isApproved: true
                    });
                } else {
                    if (!user.avatar && avatar) {
                        user.avatar = avatar;
                        await user.save();
                    }
                }

                return done(null, user);
            } catch (err) {
                console.error("Google Auth Error:", err);
                return done(err, null);
            }
        }
    )
);

// session not used
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});