const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const db = require('./utils/db');
const axios = require('axios');

const USER_SERVICE = process.env.USER_SERVICE_URL;

// ──────────────── LOCAL STRATEGY ────────────────
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const { rows } = await db.query(
        `SELECT * FROM auth.auth_account WHERE provider = 'LOCAL' AND provider_uid = $1`,
        [email]
      );
      if (!rows.length) return done(null, false, { message: 'Unknown user' });

      const account = rows[0];
      const valid = await bcrypt.compare(password, account.password_hash);
      if (!valid) return done(null, false, { message: 'Wrong credentials' });

      const user = await axios.get(`${USER_SERVICE}/users/${account.user_id}`);
      return done(null, user.data);
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
        const providerUid = profile.id;
        const email = profile.emails[0].value;

        const { rows } = await db.query(
          `SELECT * FROM auth.auth_account WHERE provider = 'GOOGLE' AND provider_uid = $1`,
          [providerUid]
        );

        let user;
        if (rows.length) {
          user = await axios.get(`${USER_SERVICE}/users/${rows[0].user_id}`);
        } else {
          const createRes = await axios.post(`${USER_SERVICE}/users`, {
            username: email,
            email,
            full_name: profile.displayName,
            role: 'STUDENT',
          });
          user = createRes.data;

          await db.query(
            `INSERT INTO auth.auth_account (user_id, provider, provider_uid)
             VALUES ($1, 'GOOGLE', $2)`,
            [user.id, providerUid]
          );
        }

        return done(null, user.data || user);
      } catch (err) {
        done(err);
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
