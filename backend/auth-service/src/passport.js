const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');
const axios = require('axios');

const USER_SERVICE = process.env.USER_SERVICE_URL;

// ──────────────── LOCAL STRATEGY ────────────────
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      // Step 1: Find account by email
      const { rows } = await db.query(
        `SELECT * FROM auth_account WHERE provider = 'LOCAL' AND provider_uid = $1`,
        [email]
      );
      if (!rows.length) return done(null, false, { message: 'Unknown user' });

      const account = rows[0];

      // Step 2: Verify password
      const valid = await bcrypt.compare(password, account.password_hash);
      if (!valid) return done(null, false, { message: 'Wrong credentials' });

      // Step 3: Get user from local 'users' table
      const { rows: userRows } = await db.query(
        `SELECT * FROM users WHERE id = $1`,
        [account.user_id]
      );
      if (!userRows.length) return done(null, false, { message: 'User record not found' });

      const user = userRows[0];
      return done(null, user);

    } catch (err) {
      return done(err);
    }
  })
);


// ──────────────── GOOGLE STRATEGY ────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleEmail = profile.emails[0].value;
        const googleId = profile.id;
        const displayName = profile.displayName;

        console.log(`🔍 Google OAuth attempt for email: ${googleEmail}`);

        // First, check if user exists with this Google email in auth_account
        let { rows } = await db.query(
          `SELECT aa.*, u.* FROM auth_account aa 
           JOIN users u ON aa.user_id = u.id 
           WHERE aa.provider = 'GOOGLE' AND aa.provider_uid = $1`,
          [googleEmail]
        );

        if (rows.length > 0) {
          console.log(`✅ Found existing Google user: ${googleEmail}`);
          return done(null, rows[0]);
        }

        // If not found by Google provider, check if user exists with this google_email in users table
        const { rows: userRows } = await db.query(
          `SELECT * FROM users WHERE google_email = $1`,
          [googleEmail]
        );

        if (userRows.length > 0) {
          const user = userRows[0];
          console.log(`✅ Found user with matching google_email: ${googleEmail}, linking account`);
          
          // Create Google auth_account entry for this existing user
          await db.query(
            `INSERT INTO auth_account (user_id, provider, provider_uid)
             VALUES ($1, 'GOOGLE', $2)
             ON CONFLICT (provider, provider_uid) DO NOTHING`,
            [user.id, googleEmail]
          );

          return done(null, user);
        }

        // If no existing user found, reject authentication
        console.log(`❌ No user found with Google email: ${googleEmail}. User must be pre-registered.`);
        return done(null, false, { 
          message: `No account found for ${googleEmail}. Please contact your institution to register your Google account.` 
        });

      } catch (err) {
        console.error('Google OAuth Error:', err);
        return done(err);
      }
    }
  )
);

// ──────────────── SESSION HANDLING ────────────────
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await axios.get(`${USER_SERVICE}/users/${id}`);
    done(null, user.data);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
