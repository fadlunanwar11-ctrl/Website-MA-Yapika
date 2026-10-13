FROM php:8.3-fpm

# Instal dependensi sistem & ekstensi PHP
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip

# Pasang Node.js 20.x LTS dari NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Instal Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Instal dependensi PHP & JS
RUN cp .env.example .env 2>/dev/null || true
RUN composer install --no-dev --optimize-autoloader --no-scripts
RUN npm install && npm run build

ENV PORT=10000
EXPOSE ${PORT}

CMD php artisan serve --host=0.0.0.0 --port=${PORT}