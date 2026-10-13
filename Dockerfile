FROM node:22-bookworm-slim AS frontend

WORKDIR /var/www

COPY . .

RUN npm ci && npm run build

FROM php:8.4-fpm

# Instal dependensi sistem & ekstensi PHP
RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Instal Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .
COPY --from=frontend /var/www/public/build ./public/build

# Instal dependensi PHP
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

ENV APP_ENV=production APP_DEBUG=false PORT=10000
EXPOSE ${PORT}

CMD ["sh", "-c", "exec php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]