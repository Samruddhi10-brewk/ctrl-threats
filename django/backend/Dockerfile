FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Environment settings
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first (for caching)
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Use gunicorn (PRODUCTION SERVER)
CMD ["sh", "-c", "python manage.py migrate && gunicorn backend.wsgi:application --bind 0.0.0.0:8000"]