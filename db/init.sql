-- clearSKY – PostgreSQL schema (v4)
-- Authentication‑ready version
-- Updated: 2025‑05‑04 — adds full login/register support for:
--   • Institutional SSO (eg. Shibboleth / CAS)
--   • Google OAuth 2.0
--   • Optional local (username/password) accounts
-- ------------------------------------------------------------------------------
-- Changelog vs v3
-- ➊ New ENUM  auth_provider  ('LOCAL','GOOGLE','INSTITUTION')
-- ➋ New table auth_account  (maps one‑to‑many identities → user)
-- ➌ Unique (provider, provider_uid) constraint & helpful indexes
-- ------------------------------------------------------------------------------

BEGIN;

-- 0. Safety & search_path --------------------------------------------------
SET client_min_messages TO warning;
DROP SCHEMA IF EXISTS clearsky CASCADE;
CREATE SCHEMA clearsky;
SET search_path TO clearsky;

-- 1. ENUM types ------------------------------------------------------------
CREATE TYPE grade_status           AS ENUM ('VOID', 'OPEN', 'FINAL');
CREATE TYPE grade_type             AS ENUM ('INITIAL', 'FINAL');
CREATE TYPE review_request_status  AS ENUM ('PENDING', 'ANSWERED', 'CLOSED');
CREATE TYPE user_role              AS ENUM ('STUDENT', 'INSTRUCTOR', 'INST_REP', 'ADMIN');
CREATE TYPE credit_tx_type         AS ENUM ('PURCHASE', 'CONSUME', 'REFUND');
CREATE TYPE auth_provider          AS ENUM ('LOCAL', 'GOOGLE', 'INSTITUTION');

-- 2. Core entities ---------------------------------------------------------
CREATE TABLE institution (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(50)  NOT NULL,
    email           VARCHAR(80)  NOT NULL UNIQUE,
    credits_balance INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user" (
    id             SERIAL PRIMARY KEY,
    username       VARCHAR(30)   NOT NULL UNIQUE,
    email          VARCHAR(80)   NOT NULL UNIQUE,
    full_name      VARCHAR(80)   NOT NULL,
    role           user_role     NOT NULL,
    external_id    INTEGER,
    am             INTEGER,
    institution_id INTEGER       NOT NULL,
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_institution FOREIGN KEY (institution_id)
        REFERENCES institution(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE UNIQUE INDEX uq_user_external_id ON "user" (external_id) WHERE external_id IS NOT NULL;

-- 2b. Authentication & identities -----------------------------------------
-- Each user may have multiple auth accounts (eg. Google + institutional SSO)
CREATE TABLE auth_account (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER       NOT NULL,
    provider        auth_provider NOT NULL,
    provider_uid    VARCHAR(128)  NOT NULL,        -- Google sub, eppn, local username etc.
    password_hash   VARCHAR(255),                  -- filled only when provider='LOCAL'
    password_salt   VARCHAR(255),
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login      TIMESTAMP,
    CONSTRAINT fk_auth_user FOREIGN KEY (user_id)
        REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT uq_provider_uid UNIQUE (provider, provider_uid)
);
CREATE INDEX idx_auth_user ON auth_account (user_id);

-- 3. Courses & teaching ----------------------------------------------------
CREATE TABLE course (
    id             SERIAL PRIMARY KEY,
    code           VARCHAR(10)  NOT NULL UNIQUE,
    title          VARCHAR(50)  NOT NULL,
    instructor_id  INTEGER      NOT NULL,
    institution_id INTEGER      NOT NULL,
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_instructor  FOREIGN KEY (instructor_id)  REFERENCES "user"(id),
    CONSTRAINT fk_course_institution FOREIGN KEY (institution_id) REFERENCES institution(id)
);

CREATE TABLE teaches (
    user_id   INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, course_id),
    CONSTRAINT fk_teaches_user   FOREIGN KEY (user_id)   REFERENCES "user"(id)   ON DELETE CASCADE,
    CONSTRAINT fk_teaches_course FOREIGN KEY (course_id) REFERENCES course(id)     ON DELETE CASCADE
);

-- 4. Credits ledger --------------------------------------------------------
CREATE TABLE credit_transaction (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER         NOT NULL,
    amount          INTEGER         NOT NULL,    -- +ve purchase, -ve consumption
    tx_type         credit_tx_type  NOT NULL,
    description     TEXT,
    reference       VARCHAR(60),                 -- e.g. COURSEID_YEAR_INITIAL
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by      INTEGER,
    CONSTRAINT fk_ct_institution FOREIGN KEY (institution_id) REFERENCES institution(id),
    CONSTRAINT fk_ct_user        FOREIGN KEY (created_by)     REFERENCES "user"(id)
);
CREATE INDEX idx_ct_inst_date ON credit_transaction (institution_id, created_at DESC);

-- 5. Grade uploads (batch) -------------------------------------------------
CREATE TABLE grade_batch (
    id              SERIAL PRIMARY KEY,
    course_id       INTEGER      NOT NULL,
    uploader_id     INTEGER      NOT NULL,
    type            grade_type   NOT NULL,
    original_file   VARCHAR(120),
    rows_parsed     INTEGER,
    uploaded_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    academic_year   SMALLINT GENERATED ALWAYS AS (EXTRACT(YEAR FROM uploaded_at)) STORED,
    CONSTRAINT fk_gb_course   FOREIGN KEY (course_id)   REFERENCES course(id),
    CONSTRAINT fk_gb_uploader FOREIGN KEY (uploader_id) REFERENCES "user"(id)
);
CREATE INDEX idx_gb_course_year ON grade_batch (course_id, academic_year);

-- 6. Statistics ------------------------------------------------------------
CREATE TABLE grade_statistic (
    id          SERIAL PRIMARY KEY,
    course_id   INTEGER      NOT NULL,
    type        grade_type   NOT NULL,
    mean        NUMERIC(5,2),
    median      NUMERIC(5,2),
    std_dev     NUMERIC(5,2),
    generated_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stat_course FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE,
    CONSTRAINT uq_stat_course_type UNIQUE (course_id, type)
);

-- 7. Grades ---------------------------------------------------------------
CREATE TABLE grade (
    id                 SERIAL PRIMARY KEY,
    type               grade_type     NOT NULL,
    value              INTEGER        NOT NULL CHECK (value BETWEEN 0 AND 100),
    status             grade_status   NOT NULL DEFAULT 'VOID',
    uploaded_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detailed_grade_json JSONB,
    user_id            INTEGER        NOT NULL,
    course_id          INTEGER        NOT NULL,
    grade_batch_id     INTEGER        NOT NULL,
    grade_statistic_id INTEGER,
    CONSTRAINT fk_grade_user    FOREIGN KEY (user_id)        REFERENCES "user"(id)          ON DELETE CASCADE,
    CONSTRAINT fk_grade_course  FOREIGN KEY (course_id)      REFERENCES course(id)           ON DELETE CASCADE,
    CONSTRAINT fk_grade_batch   FOREIGN KEY (grade_batch_id) REFERENCES grade_batch(id)      ON DELETE CASCADE,
    CONSTRAINT fk_grade_stat    FOREIGN KEY (grade_statistic_id) REFERENCES grade_statistic(id) ON DELETE SET NULL,
    CONSTRAINT uq_grade_user_course_type UNIQUE (user_id, course_id, type)
);

-- 8. Review workflow ------------------------------------------------------
CREATE TABLE review_request (
    id            SERIAL PRIMARY KEY,
    grade_id      INTEGER       NOT NULL,   -- relates to INITIAL grade
    message       VARCHAR(256)  NOT NULL,
    status        review_request_status NOT NULL DEFAULT 'PENDING',
    submitted_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id       INTEGER       NOT NULL,
    CONSTRAINT fk_rr_grade FOREIGN KEY (grade_id) REFERENCES grade(id) ON DELETE CASCADE,
    CONSTRAINT fk_rr_user  FOREIGN KEY (user_id)  REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT uq_rr_grade UNIQUE (grade_id)
);

CREATE TABLE review_response (
    id              SERIAL PRIMARY KEY,
    review_request_id INTEGER    NOT NULL UNIQUE,
    responder_id    INTEGER      NOT NULL,
    message         VARCHAR(256) NOT NULL,
    response_date   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resp_rr   FOREIGN KEY (review_request_id) REFERENCES review_request(id) ON DELETE CASCADE,
    CONSTRAINT fk_resp_user FOREIGN KEY (responder_id)     REFERENCES "user"(id)         ON DELETE CASCADE
);

-- 9. Functions & triggers -------------------------------------------------
-- 9.1 Sync institution balance when ledger changes (unchanged)
CREATE OR REPLACE FUNCTION clearsky.fn_sync_institution_balance() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE clearsky.institution SET credits_balance = credits_balance + NEW.amount WHERE id = NEW.institution_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.institution_id = NEW.institution_id THEN
            UPDATE clearsky.institution SET credits_balance = credits_balance - OLD.amount + NEW.amount WHERE id = NEW.institution_id;
        ELSE
            UPDATE clearsky.institution SET credits_balance = credits_balance - OLD.amount WHERE id = OLD.institution_id;
            UPDATE clearsky.institution SET credits_balance = credits_balance + NEW.amount WHERE id = NEW.institution_id;
        END IF;
        RETURN NEW;
    ELSE
        UPDATE clearsky.institution SET credits_balance = credits_balance - OLD.amount WHERE id = OLD.institution_id;
        RETURN OLD;
    END IF;
END;$$;
CREATE TRIGGER tg_ct_aiud AFTER INSERT OR UPDATE OR DELETE ON clearsky.credit_transaction FOR EACH ROW EXECUTE FUNCTION clearsky.fn_sync_institution_balance();

-- 9.2  BEFORE INSERT on grade_batch: verify credits ≥1 when type=INITIAL and not yet consumed (unchanged)
CREATE OR REPLACE FUNCTION clearsky.fn_check_balance_before_batch() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_inst_balance INTEGER;
    v_inst_id      INTEGER;
    v_exists       BOOLEAN;
    v_year         SMALLINT := EXTRACT(YEAR FROM NEW.uploaded_at)::SMALLINT;
BEGIN
    IF NEW.type <> 'INITIAL' THEN RETURN NEW; END IF;
    SELECT c.institution_id INTO v_inst_id FROM clearsky.course c WHERE c.id = NEW.course_id;
    SELECT EXISTS (SELECT 1 FROM clearsky.credit_transaction ct WHERE ct.institution_id = v_inst_id AND ct.tx_type='CONSUME' AND ct.reference = NEW.course_id::text || '_' || v_year || '_INITIAL') INTO v_exists;
    IF v_exists THEN RETURN NEW; END IF;
    SELECT credits_balance INTO v_inst_balance FROM clearsky.institution WHERE id = v_inst_id;
    IF v_inst_balance < 1 THEN RAISE EXCEPTION 'Insufficient credits for institution % (balance=%).', v_inst_id, v_inst_balance; END IF;
    RETURN NEW;
END;$$;
CREATE TRIGGER tg_gb_bi_check_balance BEFORE INSERT ON clearsky.grade_batch FOR EACH ROW EXECUTE FUNCTION clearsky.fn_check_balance_before_batch();

-- 9.3  AFTER INSERT on grade_batch: consume 1 credit once per course-year (INITIAL only) (unchanged)
CREATE OR REPLACE FUNCTION clearsky.fn_consume_credit_on_initial_batch() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_inst_id INTEGER;
    v_year    SMALLINT := EXTRACT(YEAR FROM NEW.uploaded_at)::SMALLINT;
    v_ref     TEXT := NEW.course_id::text || '_' || v_year || '_INITIAL';
    v_exists  BOOLEAN;
BEGIN
    IF NEW.type <> 'INITIAL' THEN RETURN NEW; END IF;
    SELECT c.institution_id INTO v_inst_id FROM clearsky.course c WHERE c.id = NEW.course_id;
    SELECT EXISTS(SELECT 1 FROM clearsky.credit_transaction ct WHERE ct.institution_id = v_inst_id AND ct.tx_type='CONSUME' AND ct.reference=v_ref) INTO v_exists;
    IF v_exists THEN RETURN NEW; END IF;
    INSERT INTO clearsky.credit_transaction (institution_id, amount, tx_type, description, reference, created_by) VALUES (v_inst_id, -1, 'CONSUME', 'Initial grades upload', v_ref, NEW.uploader_id);
    RETURN NEW;
END;$$;
CREATE TRIGGER tg_gb_ai_consume_credit AFTER INSERT ON clearsky.grade_batch FOR EACH ROW EXECUTE FUNCTION clearsky.fn_consume_credit_on_initial_batch();

-- 9.4  Mark review_request as ANSWERED when response is created (unchanged)
CREATE OR REPLACE FUNCTION clearsky.fn_mark_rr_answered() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN UPDATE clearsky.review_request SET status = 'ANSWERED' WHERE id = NEW.review_request_id; RETURN NEW; END;$$;
CREATE TRIGGER tg_rr_answered_ai AFTER INSERT ON clearsky.review_response FOR EACH ROW EXECUTE FUNCTION clearsky.fn_mark_rr_answered();

-- 9.5  Refresh statistics after grade changes (unchanged)
CREATE OR REPLACE FUNCTION clearsky.fn_refresh_grade_stats() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    WITH stats AS (
        SELECT g.course_id, g.type, AVG(g.value)::NUMERIC(5,2) AS mean, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY g.value)::NUMERIC(5,2) AS median, STDDEV_POP(g.value)::NUMERIC(5,2) AS std_dev
          FROM clearsky.grade g WHERE g.course_id = NEW.course_id AND g.type = NEW.type GROUP BY g.course_id, g.type
    )
    INSERT INTO clearsky.grade_statistic (course_id, type, mean, median, std_dev)
    SELECT course_id, type, mean, median, std_dev FROM stats
    ON CONFLICT (course_id, type) DO UPDATE SET mean=EXCLUDED.mean, median=EXCLUDED.median, std_dev=EXCLUDED.std_dev, generated_at=CURRENT_TIMESTAMP;
    RETURN NEW;
END;$$;
CREATE TRIGGER tg_grade_aiud_refresh_stats AFTER INSERT OR UPDATE OR DELETE ON clearsky.grade FOR EACH ROW EXECUTE FUNCTION clearsky.fn_refresh_grade_stats();

-- 10. Helpful indexes ------------------------------------------------------
CREATE INDEX idx_grade_user_course       ON grade (user_id, course_id);
CREATE INDEX idx_rr_user_status          ON review_request (user_id, status);
CREATE INDEX idx_course_institution      ON course (institution_id);


-- 11. ------------------------------------------------
BEGIN;

ALTER TABLE "user" RENAME TO users;
ALTER INDEX uq_user_external_id RENAME TO uq_users_external_id;

COMMIT;
-- End of schema v4 --------------------------------------------------------

-- Insert default institution for testing
INSERT INTO clearsky.institution (name, email)
VALUES ('Default Institution', 'info@institution.edu');
