# Variables
COMPOSE_DEV = docker-compose -f ./project/docker-compose.dev.yml
COMPOSE_PROD = docker-compose -f ./project/docker-compose.yml

.PHONY: all dev up-prod down-dev down-prod build-dev logs-dev shell

# --- DEV COMMANDS ---
dev: 
	@echo "Starting DEV environment (Hot Reload)..."
	$(COMPOSE_DEV) up --build

down:
	@echo "Stopping DEV containers..."
	$(COMPOSE_DEV) down

logs:
	$(COMPOSE_DEV) logs -f

migrate:
	$(COMPOSE_DEV) exec backend python manage.py migrate

makemigrations:
	$(COMPOSE_DEV) exec backend python manage.py makemigrations

shell:
	$(COMPOSE_DEV) exec backend python manage.py shell

# --- PROD COMMANDS ---
prod:
	@echo "Starting PRODUCTION environment..."
	$(COMPOSE_PROD) up -d --build

down-prod:
	$(COMPOSE_PROD) down