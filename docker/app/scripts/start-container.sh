#!/usr/bin/env bash
set -euo pipefail

usermod -u "$HOST_UID" neoscrypts

RUN="gosu $HOST_UID"

if [ -n "$APP_INSTALLED_FILE" ] && [ ! -e "$APP_INSTALLED_FILE" ]; then
	eval "$RUN" mkdir -p storage/backups
	eval "$RUN" npm install
	eval "$RUN" php artisan optimize:clear

	if [ "$APP_ENV" != "production" ]; then
		eval "$RUN" composer install
		eval "$RUN" npm run development
	else
		ENV_BACKUP_PATH="storage/backups/.env.backup."
		eval "$RUN" rm -f "$(ls -td ${ENV_BACKUP_PATH}* | awk 'NR>5')"
        eval "$RUN" cp .env "${ENV_BACKUP_PATH}$(date +%s)"

		eval "$RUN" composer install --optimize-autoloader --no-dev
		eval "$RUN" php artisan view:cache
		eval "$RUN" php artisan config:cache
		eval "$RUN" php artisan route:cache
		eval "$RUN" npm run production
	fi

	eval "$RUN" php artisan storage:link

	if [ -e "/var/scripts/install.script.sh" ]; then
        eval "$RUN" /var/scripts/install.script.sh
    fi

	touch "$APP_INSTALLED_FILE"
fi

if [ -e "/var/scripts/start.script.sh" ]; then
	eval "$RUN" /var/scripts/start.script.sh
fi

if [ "$APP_SCHEDULE" == "true" ]; then
	eval "$RUN" crontab /var/cron.schedule
	service cron restart
fi

if [ $# -gt 0 ]; then
	exec gosu "$HOST_UID" "$@"
else
	/usr/bin/supervisord --nodaemon \
		--configuration=/var/supervisord.conf \
		--user="$HOST_UID" \
		--logfile=storage/logs/supervisord.log \
		--logfile_maxbytes=5MB
fi

