- **DUMP**:
  - *FLAGS*:
    - `-U` -> user (usa postgres default master user)
    - `-d` targeted DB name
    - `-F` -> specify format
    - `-f` -> path to export file. (start with ./ and select place)

- **RESTORE**:
  - NOTE: For this to work, disconnect all current connections to Postgres Server. i.e.
    - Stop API running
    - Close clients like pgAdmin
  - *FLAGS*:
    - `-U` -> user (usa postgres default master user)
    - `-c` -> fresh clean DB data before restoring it
    - `-C` -> create the named DB -> flag -d must be used!
    - `-d` targeted DB name
    - `-v` verbose

REMEMBER:
<br>
`docker exec -t tfm-server-postgres` will access the container, while `pg_dump` or `pg_restore` are tool commands.

NOTE:
<br>
Use this file naming format for maintainability: `backup_<DBNAME>_<JAPANDATE_MILITARTIME.tar`
<br>
e.g. `backup_db_tfm_20261030_0208.tar` 

Use this command to remove failed dumps saved in the `./tmp/` folder inside the container:

```Bash
docker exec -t tfm-server-postgres rm ./tmp/backup_db_tfm_3.tar
``` 

# Backup Flow

1. Make the **DUMP**
  - ```Bash
    docker exec -t tfm-server-postgres pg_dump -U postgres -d db_tfm -F tar -f ./tmp/backup_db_tfm_20261030_0208.tar
    ```
2. Now, use `pgAdmin` to make a silly change to a record. Then...
  - Close pgAdmin so it does not interfere with docker
3. Apply the **RESTORE**
  -  
    ```Bash
    docker exec -t tfm-server-postgres pg_restore -U postgres -c -C -d postgres -v ./tmp/backup_db_tfm_20261030_0208.tar
    ```
  - Enter the DB from within the container and check the silly change was replaced by the backed up original data:
    ```Bash
    docker exec -it tfm-server-postgres psql -U postgres -d db_tfm
    ```
  - Enter the DB from within the container and check the silly change persisted:
    ```Bash
    docker exec -it tfm-server-postgres psql -U postgres -d db_tfm
    ```
  - `\l` 
  - `\c` 
  - `\d` 
  - `\d tfm_users` 
  - ```SQL
    SELECT * FROM tfm_users;
    ```
  - And quit **PSQL** again `\q`.
