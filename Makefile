.PHONY: dev build prod prod-build prod-down prod-logs health-prod

# ── Development ──

dev:
	npm run dev

build:
	npm run build

# ── Production ──

prod:
	docker compose -f docker-compose.prod.yml up -d

prod-build:
	docker compose -f docker-compose.prod.yml up -d --build

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f web

health-prod:
	curl -sf http://localhost:3001 > /dev/null && echo "OK" || echo "FAIL"
