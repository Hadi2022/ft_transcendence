
all: run

run: down build
	docker compose -f ./docker-compose.yml up

build: down
	docker compose -f ./docker-compose.yml build

cleanbuild: down fclean
	docker compose -f ./docker-compose.yml build --no-cache

down:
	docker compose -f ./docker-compose.yml down

.PHONY: all run build cleanbuild down fclean