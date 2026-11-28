
all: run

run: down build
	docker compose -f ./docker-compose.yml up

build: down
	docker compose -f ./docker-compose.yml build

cleanbuild: down
	docker compose -f ./docker-compose.yml build --no-cache

down:
	docker compose -f ./docker-compose.yml down

fclean:
	docker compose -f ./docker-compose.yml down --rmi local --volumes --remove-orphans
	rm -rf ./uploads/posts ./uploads/avatars

.PHONY: all run build cleanbuild down fclean