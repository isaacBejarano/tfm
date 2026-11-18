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
    - `-U` -> user (use postgres default master user)
    - `-c` -> fresh clean DB data before restoring it
    - `-C` -> create the named DB -> flag -d must be used!
    - `-d` targeted DB name
    - `-v` verbose

REMEMBER:
<br>
`docker exec -t <cotainer-name>` will access the container, while `pg_dump` or `pg_restore` are tool commands. For example, the following command will use the Linux `ls` comand inside the container. Use of flag `-it` is required to execute the Bash commands within the container correclty.

```Bash
sudo docker exec -it <cotainer-name> ls
``` 

Then, one can go to the `./tmp` folder and copy the backup file's name, to remove it for example.
To do so, init the **Bash** shell from within the container, in order to be able to use file system comands like `cd`, or the `ls` command can be used straightforward instead, to access that path:

```Bash
sudo docker exec -it <cotainer-name> ls tmp
``` 

```Bash
sudo docker exec -it <cotainer-name> bash
``` 

Once running the container's bash, just use file sys navigation as usual and copy the **.tar** backup file's name. Then exit the session.

```Bash
cd tmp
ls  
exit
``` 

Use this command to remove failed dumps saved in the `./tmp/` folder inside the container:

```Bash
sudo docker exec -t <cotainer-name> rm ./tmp/backup_db_tfm_20261102_1430.tar
``` 

NOTE:
<br>
Use this file naming format for maintainability: `backup_<DBNAME>_<JAPANDATE_MILITARTIME>.tar`
<br>
e.g. `backup_db_tfm_20261102_1430.tar` 


To save the dump within the container, the flag `-f` is used.

  e.g.
  `sudo docker exec -t <cotainer-name> pg_dump -U postgres -d db_tfm -F tar -f ./tmp/backup_db_tfm_20261102_1430.tar`

  But, it's more recommendable to backup the DB in our host. So don't use the `-f` flag. Use `>` instead!

# Backup Flow

0. Be sure the DB is virtualized and running with Docker.
   
   Also, the folder `data-postgres-dumps` must exist in the root path of the VPS deployment folder. 

1. Make the **DUMP**
  - Be sure to be in the backup folder! `${VPS_PATH_DB_COMPOSE}/data-postgres-dumps` 
  - e.g.
    ```Bash
    sudo docker exec <cotainer-name> pg_dump -U postgres -d db_tfm -F tar > backup_db_tfm_20261116_2145.tar
    ```
3. Now, use `pgAdmin` or `psql` within the container to make a silly change to a record.
    ```SQL
    UPDATE public.tfm_users
	  SET "Name"='XXX'
	  WHERE "Email"='XXX@yopmail.com';
    ```       
  - Then, enter the DB from within the container and check the silly change persisted:
    ```Bash
    sudo docker exec -it <cotainer-name> psql -U postgres -d db_tfm
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
4. Apply the **RESTORE**
  - Be sure to be in the backup folder! `${VPS_PATH_DB_COMPOSE}/data-postgres-dumps` 
  - Be sure to close any connection to the Postgres Server before applying the restore. Otherwise, it wil fail! 
  - e.g.
    ```Bash
    sudo docker exec -i <cotainer-name> pg_restore -U postgres -d postgres -c -C < backup_db_tfm_20261116_2145.tar
    ```
  - Enter the DB from within the container and check the silly change was replaced by the backed up original data:
    ```Bash
    sudo docker exec -it <cotainer-name> psql -U postgres -d db_tfm
    ```
    - `\l` 
    - `\c` 
    - `\d` 
    - `\d tfm_users` 
    - ```SQL
      SELECT * FROM tfm_users;
      ```
    - And quit **PSQL** again `\q`.
