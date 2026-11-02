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
`docker exec -t tfm-server-postgres` will access the container, while `pg_dump` or `pg_restore` are tool commands. For example, the following command will use the Linux `ls` comand inside the container. Use of flag `-it` is required to execute the Bash commands within the container correclty.

```Bash
docker exec -it tfm-server-postgres ls
``` 

Then, one can go to the `./tmp` folder and copy the backup file's name, to remove it for example.
To do so, init the **Bash** shell from within the container, in order to be able to use file system comands like `cd`, or the `ls` command can be used straightforward instead, to access that path:

```Bash
docker exec -it tfm-server-postgres ls tmp
``` 

```Bash
docker exec -it tfm-server-postgres bash
``` 

Once running the container's bash, just use file sys navigation as usual and copy the **.tar** backup file's name. Then exit the session.

```Bash
cd temp
ls  
exit
``` 

Use this command to remove failed dumps saved in the `./tmp/` folder inside the container:

```Bash
docker exec -t tfm-server-postgres rm ./tmp/backup_db_tfm_20261102_1430.tar
``` 

NOTE:
<br>
Use this file naming format for maintainability: `backup_<DBNAME>_<JAPANDATE_MILITARTIME>.tar`
<br>
e.g. `backup_db_tfm_20261102_1430.tar` 

# Backup Flow

1. Make the **DUMP**
  - ```Bash
    docker exec -t tfm-server-postgres pg_dump -U postgres -d db_tfm -F tar -f ./tmp/backup_db_tfm_20261102_1430.tar
    ```
2. Now, use `pgAdmin` to make a silly change to a record. Then...
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
    - Close pgAdmin so it does not interfere with docker
3. Apply the **RESTORE**
  -  
    ```Bash
    docker exec -t tfm-server-postgres pg_restore -U postgres -c -C -d postgres -v ./tmp/backup_db_tfm_20261102_1430.tar
    ```
  - Enter the DB from within the container and check the silly change was replaced by the backed up original data:
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
