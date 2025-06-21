-- Credits Service – PostgreSQL schema
-- Final version with automatic CONSUME transaction on balance decrease

BEGIN;

-- 0. Drop & recreate schema
DROP SCHEMA IF EXISTS credits_service CASCADE;
CREATE SCHEMA credits_service;
SET search_path TO credits_service;

-- 1. ENUM τύποι
CREATE TYPE credits_service.credit_tx_type AS ENUM ('PURCHASE', 'CONSUME');

-- 2. Πίνακας: Institutions
CREATE TABLE credits_service.institution (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(50)  NOT NULL,
    email           VARCHAR(80)  NOT NULL UNIQUE,
    credits_balance INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Πίνακας: Credit Transactions
CREATE TABLE credits_service.credit_transaction (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER         NOT NULL,
    amount          INTEGER         NOT NULL, -- θετικό = προσθήκη, αρνητικό = κατανάλωση
    tx_type         credits_service.credit_tx_type  NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ct_institution FOREIGN KEY (institution_id)
        REFERENCES credits_service.institution(id) ON DELETE CASCADE
);

-- 4. Trigger για συγχρονισμό υπολοίπου
CREATE OR REPLACE FUNCTION credits_service.fn_sync_institution_balance() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    -- Αν έχει ενεργοποιηθεί η σημαία προστασίας, μην ενημερώσεις το balance
    IF current_setting('credits_service.skip_sync_trigger', true) = 'on' THEN
        RETURN NEW;
    END IF;

    IF TG_OP = 'INSERT' THEN
        UPDATE credits_service.institution
        SET credits_balance = credits_balance + NEW.amount
        WHERE id = NEW.institution_id;
        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.institution_id = NEW.institution_id THEN
            UPDATE credits_service.institution
            SET credits_balance = credits_balance - OLD.amount + NEW.amount
            WHERE id = NEW.institution_id;
        ELSE
            UPDATE credits_service.institution
            SET credits_balance = credits_balance - OLD.amount
            WHERE id = OLD.institution_id;

            UPDATE credits_service.institution
            SET credits_balance = credits_balance + NEW.amount
            WHERE id = NEW.institution_id;
        END IF;
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        UPDATE credits_service.institution
        SET credits_balance = credits_balance - OLD.amount
        WHERE id = OLD.institution_id;
        RETURN OLD;
    END IF;

    RETURN NULL;
END;$$;


CREATE TRIGGER tg_ct_aiud
AFTER INSERT OR UPDATE OR DELETE ON credits_service.credit_transaction
FOR EACH ROW EXECUTE FUNCTION credits_service.fn_sync_institution_balance();

-- 5. Trigger για αυτόματη δημιουργία κατανάλωσης όταν μειώνεται το υπόλοιπο
CREATE OR REPLACE FUNCTION credits_service.fn_log_automatic_consume_tx() 
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    diff INTEGER;
BEGIN
    -- Αν έχει ενεργοποιηθεί η σημαία προστασίας, μην κάνεις τίποτα
    IF current_setting('credits_service.skip_consume_trigger', true) = 'on' THEN
        RETURN NEW;
    END IF;

    -- Υπολογίζουμε μείωση
    diff := OLD.credits_balance - NEW.credits_balance;

    IF diff > 0 THEN
        -- Θέτουμε session flag για αποφυγή recursion
        PERFORM set_config('credits_service.skip_sync_trigger', 'on', true);

        -- Καταχωρούμε αυτόματα την κατανάλωση
        INSERT INTO credits_service.credit_transaction (
            institution_id,
            amount,
            tx_type,
            created_at
        )
        VALUES (
            NEW.id,
            -diff,
            'CONSUME',
            now()
        );
    END IF;

    RETURN NEW;
END;
$$;


CREATE TRIGGER tg_institution_balance_consume
AFTER UPDATE ON credits_service.institution
FOR EACH ROW
WHEN (OLD.credits_balance > NEW.credits_balance)
EXECUTE FUNCTION credits_service.fn_log_automatic_consume_tx();

-- 6. Index για ιστορικό συναλλαγών
CREATE INDEX idx_ct_inst_created_at 
  ON credits_service.credit_transaction (institution_id, created_at DESC);

COMMIT;
