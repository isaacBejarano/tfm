-- Script: Create a DB with UTF-8 encoding, locale 'en_US' and Backend OWNER
-- Creation: Isaac Bejarano, 2026/10/07

-- create user for Backend != postgres
CREATE USER isk;

-- create DB with Backend user
CREATE DATABASE db_tfm WITH
    OWNER = isk
    ENCODING = UTF8 -- all alphabets
    CONNECTION LIMIT = -1
    LC_CTYPE = 'en_US.utf8' -- accents
    LC_COLLATE = 'en_US.utf8' -- ORDER BY
    TEMPLATE = template0
    TABLESPACE = pg_default
    IS_TEMPLATE = False;

-- mod DB encoding details (only after DB creation)
ALTER DATABASE db_tfm SET
    LC_NUMERIC = 'en_US.utf8' -- e.g. 1,000.00
    LC_TIME= 'en_US.utf8' -- e.g. 2026/10/07
    LC_MONETARY = 'en_US.utf8' -- e.g. 1,000.00 €
