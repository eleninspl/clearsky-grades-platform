-- 1. ENUM types
CREATE TYPE user_role AS ENUM ('STUDENT', 'INSTRUCTOR', 'INST_REP', 'ADMIN');
CREATE TYPE auth_provider AS ENUM ('LOCAL', 'GOOGLE', 'INSTITUTION');

-- Institution table

CREATE TABLE institution (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(50)  NOT NULL,
    email           VARCHAR(80)  NOT NULL UNIQUE,
    credits_balance INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--  Users table
CREATE TABLE users (
    id             SERIAL PRIMARY KEY,
    username       VARCHAR(30)   NOT NULL UNIQUE,
    email          VARCHAR(80)   NOT NULL UNIQUE,
    full_name      VARCHAR(80)   NOT NULL,
    role           user_role     NOT NULL,
    external_id    INTEGER,
    am             INTEGER,
    institution_id INTEGER,
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_users_am UNIQUE (am)
);

-- Partial unique index (μόνο ένας INST_REP ανά institution)
CREATE UNIQUE INDEX uq_one_rep_per_inst_idx
    ON users (institution_id)
    WHERE role = 'INST_REP';

-- Optional: index για external_id όταν δεν είναι null
CREATE UNIQUE INDEX uq_users_external_id ON users (external_id) WHERE external_id IS NOT NULL;

--  Auth accounts table
CREATE TABLE auth_account (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER       NOT NULL,
    provider        auth_provider NOT NULL,
    provider_uid    VARCHAR(128)  NOT NULL,
    password_hash   VARCHAR(255),
    password_salt   VARCHAR(255),
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login      TIMESTAMP,

    CONSTRAINT fk_auth_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_provider_uid UNIQUE (provider, provider_uid)
);

CREATE INDEX idx_auth_user ON auth_account (user_id);

-- 4. JWT blacklist table
CREATE TABLE blacklisted_tokens (
    token TEXT PRIMARY KEY,
    expiration TIMESTAMP NOT NULL
);

COMMIT;

-- ✅ init.sql loaded for auth-service
DO $$ BEGIN RAISE NOTICE '✅ auth-service schema loaded'; END $$;
