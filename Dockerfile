# Stage 1: Build Asset Frontend
FROM node:22-bookworm-slim AS frontend

WORKDIR /var/www

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Runtime PHP
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

# Instal ekstensi PHP yang dibutuhkan
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

# Copy Composer dari official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy kode aplikasi
COPY . .
COPY --from=frontend /var/www/public/build ./public/build

# Instal dependensi PHP (Composer)

# Instal dependensi PHP (Composer)
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Buat symbolic link storage Laravel
RUN php artisan storage:link


# Atur permission untuk folder Storage dan Cache Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 10000

CMD ["sh", "-c", "exec php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]