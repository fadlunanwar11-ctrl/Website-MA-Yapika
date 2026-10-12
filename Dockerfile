FROM php:8.2-fpm

# Instal dependensi sistem & ekstensi PHP yang dibutuhkan Laravel & PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    nodejs \
    npm

RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Instal Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Instal dependensi PHP & JS
RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

# Expose port & jalankan server bawaan
EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=8000