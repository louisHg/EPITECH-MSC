#!/bin/bash

# Attendre que la base de données soit accessible
while ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; do
    echo "$(date) - En attente du démarrage de la base de données"
    sleep 2
done

npx prisma db push
npx prisma generate
npm run seed
npm run dev