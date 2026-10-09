> Solution version: `0.0.0-alfa`

# 🚀 Angular App

## Requirements

An **Angular 22** compatible version with **Node.js** must be installed in your machine. Version `24.20.0` is recommended:
- https://angular.dev/reference/versions
- https://angular.dev/installation

## App set up

The Angular App was created with this **Angular CLI** command, 
executed from the solution's **root** path `tfm/`:

```Shell
ng new App --commit=false --inline-style --inline-template --package-manager=npm --routing=true --skip-git --skip-install --style=tailwind --ssr=false --zoneless=true --ai-config=none
```

## App dependencies installation

Once created, install the Angular project dependecies from the solution's **root** path:

```Shell
cd App
npm i
```

## 🧪 App unit tests (Vitest)

To opt in for **Vitest**, a `vitest.config,ts` config file was created at Angular's project root level:

```TypeScript
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8', // https://vitest.dev/guide/coverage
    },
    setupFiles: ['src/test-setup.ts'],
  },
});
``` 

Then the a **Setup** file for Vitest (`test-setup.ts`) was created at Angular's project path `src/`:

```TypeScript
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
``` 

Finally, these **NPM scripts** where added to the **package.json** file:

```JSON
"test": "vitest",
"coverage": "vitest --coverage"
```

As well as this entry (which enables ESM imports of vitest config files): 

```JSON
"type": "module
```

To install Vitest Coverage tool, the coverage command was executed:

```Shell
npm run coverage
```

And the Vitest CLI suggested then in Terminal to add that dependency.

## 👉 App NPM scripts for development

Be sure to be located at the App path: `tfm/App/`. Once there, execute the following **NPM scripts** to:

* Run the App in dev mode: 
  ```Shell
  npm start
  ```
* Run unit tests:
  ```Shell
  npm test
  ```
* Coverage of unit tests: 
    ```Shell  
  npm run coverage
  ```
* Use available schematics (such as `components`, `directives`, or  `pipes`) scaffold project files:
  ```bash
  ng generate --help
  ```
📌 Remember to use the `--dry-run` flag to preview location and file genration before actually scaffolding.
  
## 👉 App NPM scripts for production

Be sure to be located at the App path: `tfm/App/`. Once there, execute the following **NPM scripts** to build the production-ready compile: 

```Shell  
npm run build
```

That compilation will be created at the App's `dist/` folder. The subfolder to be deployed to a web server is `broswer/`.

> [!NOTE] Angular Resources
> * **CLI reference**: https://angular.dev/tools/cli
> * **Documentation**: https://angular.dev

<br>


# 🌐 .NET API 

## Requirements
The **SDK** for **.NET** version `10.0.112` must be installed in your machine:

https://dotnet.microsoft.com/es-es/download/dotnet/10.0   

## API set up

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

## 🧪 API unit tests (xUnit)

For testing with xUnit version 3, the Solution must use the modern **Microsoft Testing Platform (MTP)**.

A `Api/global.json` file wa screated to enable **MTP**:

```json
{
  "test": {
    "runner": "Microsoft.Testing.Platform"
  }
}
```

## 👉 API commands for development

From the root `Api/` folder, execute this command to serve the API locally:

```bash
dotnet run --project src
``` 

And thi sone to test the previous `Api` project:

```bash
dotnet test --project tests
``` 

## 👉 API Scaffolding

From the path `Api/`, use the `--project` **flag** apropiately to decide where the create the new scaffodled files.

Use also the `--help` **flag** to show assitence and decide more thorougly how to scaffold new project files.

📌 Remember to use the `--dry-run` **flag** to preview location and file generation before actually scaffolding.

* Llist of all **creational commands**:
  ```bash
  dotnet new list --project src
  ``` 
* Example of creating a Record in the project `Api.csproj`
  ```bash
  dotnet new record --project src/Api.csproj --output src/Dtos      
  ``` 
* The previous example but in the project `Api.Tests.csproj`
  ```bash
  dotnet new record --project tests/Api.Tests.csproj --output tests/Dtos
  ``` 

> [!NOTE] .NET Resources
> **Documentation**: https://dotnet.microsoft.com/en-us/apps/aspnet

<br>


# 💾 Infrastructure as Code (IaC)

## 🐘 PostgreSQL DB

### 👉 Local development with Docker Compose

Docker `compose.yaml` files have been used to virtualize a PostgrSQL database and persist DB data in this same project by mounting its volumes.

First, *dry-run* the Docker `compose.dev.yaml` from the `Api/` foder:

```bash
docker compose --file compose.dev.yaml up --detach --dry-run
```
If no errors occurred during the simulation, then execute...

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

🚨 Be carefull though! 

This command will remove all peristed data from your local volume!

```bash
sudo rm -r data-postgres
```
