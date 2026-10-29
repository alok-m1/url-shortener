COMPOSE ?= docker compose
SERVICE ?= app

.DEFAULT_GOAL := help
.PHONY: help env build up run down stop restart logs ps shell migrate kafka-ui studio clean wipe

# Printed after the stack starts so you don't have to guess the ports.
define print-urls
	@echo ""
	@echo "  App:       http://localhost:3000  (health: http://localhost:3000/health)"
	@echo "  Postgres:  localhost:5434  (user/pass/db: postgres)"
	@echo "  Kafka:     localhost:9092  (internal: kafka:29092)"
	@echo "  Kafka UI:  make kafka-ui   ->  http://localhost:8080"
	@echo "  Studio:    make studio     ->  https://local.drizzle.studio?host=localhost:4983"
	@echo ""
endef

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

env: ## Create .env from .env.example if missing
	@test -f .env || (cp .env.example .env && echo "Created .env - fill in your credentials")

build: ## Build the Docker image
	$(COMPOSE) build

up: build ## Build and start the stack in the background
	$(COMPOSE) up -d
	$(print-urls)

run: ## Start the stack in the foreground with logs attached
	$(print-urls)
	$(COMPOSE) up --build

down: ## Stop and remove containers/network (keeps data)
	$(COMPOSE) down

stop: ## Stop a container (make stop SERVICE=studio)
	$(COMPOSE) stop $(SERVICE)

restart: down up ## Restart the stack

logs: ## Follow logs (make logs SERVICE=kafka)
	$(COMPOSE) logs -f $(SERVICE)

ps: ## Show container status
	$(COMPOSE) ps

shell: ## Open a shell in a container (make shell SERVICE=kafka)
	$(COMPOSE) exec $(SERVICE) sh

migrate: ## Run database migrations in a one-off container
	$(COMPOSE) run --rm migrate

kafka-ui: ## Start Kafka UI at http://localhost:8080
	$(COMPOSE) --profile ui up -d kafka-ui
	@echo "Kafka UI: http://localhost:8080"

studio: ## Start Drizzle Studio (opens https://local.drizzle.studio)
	$(COMPOSE) --profile ui up -d studio
	@echo "Drizzle Studio: https://local.drizzle.studio?host=localhost:4983"

clean: ## Stop the stack and remove the app image
	$(COMPOSE) down --rmi local

wipe: ## Stop and DELETE the app image, Postgres data, and Kafka data
	$(COMPOSE) down --rmi local -v
	docker builder prune -f
