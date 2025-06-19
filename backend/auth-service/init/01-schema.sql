-- Δημιουργία ENUM τύπων (αν χρειάζονται)
CREATE TYPE auth_provider AS ENUM ('LOCAL', 'GOOGLE');

-- Πίνακας για λογαριασμούς authentication
CREATE TABLE auth_account (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    provider auth_provider NOT NULL DEFAULT 'LOCAL',
    provider_uid VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),  -- Μόνο για LOCAL login
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (provider, provider_uid)
);