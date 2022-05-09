ARG PHP_VERSION

FROM php:${PHP_VERSION}-fpm

LABEL maintainer="NeoScrypts"

ARG APP_ENV
ARG COMPOSER_VERSION=2
ARG PHP_VERSION
ARG DEBIAN_FRONTEND=noninteractive
ARG HOST_GID

ENV TZ=UTC
ENV APP_INSTALLED_FILE=/var/app.installed

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install system dependencies
RUN apt-get update && apt-get install -y sqlite3 curl nano \
    cron zip unzip git supervisor ca-certificates gosu mariadb-client postgresql-client

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions && sync && \
    install-php-extensions mysqli pgsql sqlite3 curl memcached opcache swoole \
    xml zip pcntl bcmath soap readline msgpack igbinary ldap gd imap ctype redis \
    fileinfo json pdo pdo_mysql pdo_pgsql tokenizer mbstring intl @composer-${COMPOSER_VERSION}

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/log/supervisor;
RUN mkdir -p /var/scripts;

# Install node
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    apt-get install -y postgresql-client && \
    apt-get install -y mariadb-client && \
    apt-get -y autoremove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN if [ "$APP_ENV" = "local" -o "$APP_ENV" = "testing" ]; then \
    mv "${PHP_INI_DIR}/php.ini-development" "${PHP_INI_DIR}/php.ini"; \
    install-php-extensions xdebug; else \
    mv "${PHP_INI_DIR}/php.ini-production" "${PHP_INI_DIR}/php.ini"; fi

COPY scripts/*.script.sh /var/scripts/
COPY scripts/start-container.sh /usr/local/bin/start-container
COPY supervisord.conf /var/supervisord.conf
COPY php.ini ${PHP_INI_DIR}/conf.d/xx-neoscrypts.ini
COPY cron.schedule /var/cron.schedule

RUN chmod +x -R /var/scripts
RUN chmod u+x /usr/local/bin/start-container
RUN chmod 0644 /var/cron.schedule

RUN groupadd --force -g $HOST_GID neoscrypts
RUN useradd -mg $HOST_GID neoscrypts

WORKDIR /var/www/html

EXPOSE 8080

ENTRYPOINT ["start-container"]
