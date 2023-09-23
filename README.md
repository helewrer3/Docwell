[![Azure](https://github.com/helewrer3/Docwell/actions/workflows/azure.yml/badge.svg?branch=test)](https://github.com/helewrer3/Docwell/actions/workflows/azure.yml)
[![Build](https://github.com/helewrer3/Docwell/actions/workflows/build.yml/badge.svg?branch=test)](https://github.com/helewrer3/Docwell/actions/workflows/build.yml)
[![Deploy](https://github.com/helewrer3/Docwell/actions/workflows/deploy.yml/badge.svg?branch=test)](https://github.com/helewrer3/Docwell/actions/workflows/deploy.yml)

# Docwell

## A WIP nursing home management app

Made in accordance with [Gazette of India [CG-DL-E-09082023-247951]](https://egazette.gov.in/WriteReadData/2023/247951.pdf)

## Functionality:

1. Admin approved login
   - Every new account's request must first be approved by the admin user (referred to as "First User").
   - Only after the approval can the user use the app.
2. Create, filter and view records of patients and their visits.
3. Upload all the related presicriptions/reports pertaining to a particular visit safely on the cloud for later consumption and record keeping.
4. Backup your data to your local machine in form of `CSV` files whenever you wish.

## ToDos:

1. Digitized prescription maker.
2. Ironing out frontend.
3. Logging statistics.

## Prerequisites:

### Necessary

1. [Docker](https://docs.docker.com/get-docker/)
2. [Node.js](https://nodejs.org/en/download/current)
3. [Python](https://www.python.org/downloads/)
4. [MySQL](https://dev.mysql.com/downloads/mysql/)

### Optional

1. [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
2. [Visual Studio Code](https://code.visualstudio.com/Download)

## Local Deployment / Testing:

1. Fill out the `.env.development.local` using the `env.local.template` as your reference.
2. Run `development.local.sh`
3. Frontend is available at port `3000` and backend at port `8080`.

## Prod Deployment:

1. The project uses [Github Actions](https://docs.github.com/en/actions/using-workflows) to handle deployment onto Azure, namely `azure.yml`, `build.yml`, and `deploy.yml`, with each branch in this repository referring to a different deployment.
2. TLS certificate provision is enabled by [Automatic Https](https://caddyserver.com/docs/automatic-https) by installing & configuring Caddy in a sidecar container.
3. Fill out Github variables and secrets -
   - Reposiory Secrets
     1. `AZ_SUBSCRIPTION_ID` - Azure Subscription ID
     2. `AZ_SECURITY_CREDS` - Security credentials JSON of your service principal having contributor scope set to above subscription
        - Run the below commands in your local machine to obtain the required JSON (replace values accordingly).
          ```
          az login
          az ad sp create-for-rbac --name <<Service Principal Name>> --role contributor --scopes /subscriptions/<<Subscription ID>> --sdk-auth
          ```
   - Repository Variables
     1. `DEFAULT_ENV` // Optional
   - Environment Secrets
     1. `AZ_STORAGE_ACCOUNT_CONNECTION_STRING` - Connection string of the storage account that would be produced after running `azure.yml`
     2. `DB_FIRST_PASSWORD` - First user password
     3. `DB_PASSWORD` - Database password
   - Environment Variables
     1. `AZ_DOMAIN_NAME` - Your custom domain name to map the FQDN with
     2. `AZ_LOCATION` - Location of Resource group / resources
     3. `AZ_REGISTRY_NAME` - Name for your Azure container registry
     4. `AZ_RESOURCE_GROUP` - Name for your resource group
     5. `AZ_STORAGE_ACCOUNT_NAME` - Name for your storage account
     6. `AZ_STORAGE_ACCOUNT_SHARE` - Name of file share inside the storage account
     7. `DB_DATABASE` - Name of database
     8. `DB_FIRST_USER` - Name of first user
4. Run the workflows `azure.yml`, `build.yml`, and `deploy.yml` in this order (Don't forget to fill the connection string value after the `azure.yml` workflow)
5. Add a CNAME Record in your DNS management tool mapping your provided value for `AZ_DOMAIN_NAME` with the FQDN of your container group.
