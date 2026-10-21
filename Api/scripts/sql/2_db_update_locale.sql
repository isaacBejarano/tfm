-- Script: Add locale 'en_US' to the project's DB
-- Creation: Isaac Bejarano, 2026/10/21

-- mod DB encoding details (only after DB creation)
ALTER DATABASE db_tfm SET
    LC_NUMERIC = 'en_US.utf8' -- e.g. 1,000.00
    LC_TIME= 'en_US.utf8' -- e.g. 2026/10/21
    LC_MONETARY = 'en_US.utf8' -- e.g. 1,000.00 €
