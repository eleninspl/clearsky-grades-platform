// Διαμορφώνει Passport για LOCAL & GOOGLE στρατηγικές σύμφωνα με το schema v4
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const db = require('./utils/db');

// ───────────────── LOCAL ─────────────────
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const { rows } = await db.query(
        `SELECT u.*, aa.password_hash
           FROM clearsky.auth_account aa
           JOIN clearsky.users u ON u.id = aa.user_id
          WHERE aa.provider = 'LOCAL' AND aa.provider_uid = $1`,
        [email]
      );
      if (!rows.length) return done(null, false, { message: 'Unknown user' });
      const user = rows[0];
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return done(null, false, { message: 'Wrong credentials' });
      return done(null, user);
    } catch (err) { return done(err); }
  }
));

// ───────────────── GOOGLE ────────────────
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  '/auth/google/callback'
  },
  async (_at, _rt, profile, done) => {
    try {
      const providerUid = profile.id;
      const email       = profile.emails[0].value;
      // ψάχνουμε αν υπάρχει auth_account
      const lookup = await db.query(
        `SELECT u.*
           FROM clearsky.auth_account aa
           JOIN clearsky.users u ON u.id = aa.user_id
          WHERE aa.provider='GOOGLE' AND aa.provider_uid=$1`,
        [providerUid]
      );
      let user;
      if (lookup.rowCount) {
        user = lookup.rows[0];
      } else {
        // first-time Google login ⇒ δημιουργούμε STUDENT
        const userIns = await db.query(
          `INSERT INTO clearsky.users (username,email,full_name,role,institution_id)
           VALUES ($1,$2,$3,'STUDENT',1)    -- default institution=1 ή βάλε λογική εντοπισμού
           RETURNING *`,
          [email, email, profile.displayName]
        );
        user = userIns.rows[0];
        await db.query(
          `INSERT INTO clearsky.auth_account
             (user_id, provider, provider_uid) VALUES ($1,'GOOGLE',$2)`,
          [user.id, providerUid]
        );
      }
      return done(null, user);
    } catch (err) { done(err); }
  }
));

// ───────────────── Serialize ─────────────
passport.serializeUser((u, done) => done(null, u.id));
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await db.query(
      `SELECT id, role, institution_id FROM clearsky.users WHERE id=$1`, [id]);
    if (!rows.length) return done(null, false);
    done(null, rows[0]);
  } catch (err) { done(err); }
});

module.exports = passport;
