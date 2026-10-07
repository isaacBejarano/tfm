# IaC - PostgreSQL with Docker Compose

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
<br>

# .NET API 

## Requirements
The **SDK** for **.NET** version `10.0.112` must be installed in your machine:

https://dotnet.microsoft.com/es-es/download/dotnet/10.0 



## Scaffolding
The `Api.csproj` project was created within the `Api/` folder with this command:

```bash
dotnet new webapi --name=Api --output=src -controllers=true
```

And the `Api.Tests.csproj` project was created within the `Api/` folder with this command:

```bash
dotnet new xunit3 --name=Api.Tests --output=tests --language="C#" --framework=net10.0
```

From within the `Api/` folder, a refere from the **Api** project was linked to the **Api.Tests** project by using:

```bash
dotnet add tests/Api.Tests.csproj reference src/Api.csproj
```

## Unit Testing with xUnit

For testing with xUnit version 3, the Solution must use the modern **Microsoft Testing Platform (MTP)**.

A `Api/global.json` file wa screated to enable **MTP**:

```json
{
  "test": {
    "runner": "Microsoft.Testing.Platform"
  }
}
``` 

## Commands for development

Fro the root `Api/` folder, esexute this command to serve the API locally:

```bash
dotnet run --project src
``` 

And thi sone to test the previous `Api` project:

```bash
dotnet test --project tests
``` 
