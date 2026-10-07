# Serve PostgreSQL with Docker Compose files

```bash
docker compose --file compose.dev.yaml up --detach --dry-run
```
If no errors occurred during the simulation, then...

```bash
docker compose --file compose.dev.yaml up --detach
```

Once the virtualized server is running, access to any created DB is granted. The default DB is 'postgres'. Further DB must be created by the **Backend**, by using the **PSQL Terminal** or by using a **Client** like `pgAdmin`.

Connect to default `postgres` Maintenance DB running inside the composed container `tfm-server-postgres psql`.

```bash
docker exec -it tfm-server-postgres psql --username postgres 
```
List DB on the **PSQL Terminal** with `\l`.
Then exit the PSQL Terminal with `\q`.

Then create a custom DB with the **SQL script** located at `scripts/**/*.sql`. Finally connect to the custom DB `db_tfm` with custom user `isk` recently added to the Server...

```bash
docker exec -it tfm-server-postgres psql --username isk --dbname db_tfm
```
...and keep using **PSQL comands** like the previous `\l` or `\q`.

To stop the cointanier and remove volumes, pass in the `-v` **flag**. 

```bash
docker compose --file compose.dev.yaml down -v
```

To remove local volume "db-postgres/" persitence, execute command at `Api/` root level. This might be needed when the `POSTGRES_PASSWORD` has changed in the `.env` file. If a volume exists locally, the old password might still exist. Delete local volume folder before mouting the new one with the new password. 

🚨 Be carefull though! This command will remove all peristed data from your local volume!

```bash
sudo rm -r data-postgres
```
