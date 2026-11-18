#!/bin/bash

echo "DB Backup $(date +"%Y-%m-%d_%H-%M")"

# backups db
sudo docker exec ${DB_CONTAINER_NAME} pg_dump -U postgres -d db_tfm -F tar > ${VPS_PATH_DB_COMPOSE}/data-postgres-dumps/backup_db_tfm_$(date +"%Y-%m-%d_%H-%M").tar
# delete all backups except the 7 newest
sudo ls -1t ${VPS_PATH_DB_COMPOSE}/data-postgres-dumps/*.tar | tail -n +8 | xargs -r rm -f
