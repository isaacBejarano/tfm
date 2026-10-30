-- SCRIPT: Create the project's DB with UTF-8 encoding and Backend OWNER 'isk'
--
-- INSTRUCTIONS:
--   * 1st - Create this Postgres DB
--   * 2nd - Run the API so the seeding proces starts and automatically inserts initial records in the DB
--
-- Creation: Isaac Bejarano, 2026/10/29

-- create user for Backend != 'postgres'
CREATE USER isk;

DROP DATABASE IF EXISTS db_tfm;

CREATE DATABASE db_tfm
    WITH
    OWNER = isk
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

ALTER DATABASE db_tfm
    SET lc_numeric TO 'en_US.utf8'; -- e.g. 1,000.00
ALTER DATABASE db_tfm
    SET lc_time TO 'en_US.utf8'; -- e.g. 2026/10/21
ALTER DATABASE db_tfm
    SET lc_monetary TO 'en_US.utf8'; -- e.g. 1,000.00 €
