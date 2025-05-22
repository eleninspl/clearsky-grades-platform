FROM postgres:17

COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY seed.sql /docker-entrypoint-initdb.d/02-seed.sql

EXPOSE 5432
