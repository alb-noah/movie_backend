dev:
	docker-compose up --build
prod:
	docker-compose -f docker-compose.yml up --build -d
down:
	docker-compose down
prune:
	docker system prune && docker volume prune
