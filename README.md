# 20_NewsCenter
NewsCenter is a web-based communication platform that uses the publish–subscribe model to deliver relevant information to users. It allows users to publish tagged messages, subscribe to topics, and receive updates through a simple and responsive interface.


# NewsCenter DB (Sprint 1)

## Prereqs
- Docker + Docker Compose

## Run
docker compose up -d  #starts the containers in the background (-d) and triggers auto-init (runs .sql on first boot).

Adminer: http://localhost:8080
System: PostgreSQL | Server: db | User: newscenter | Pass: nc_secret | DB: newscenter

## Reset database (DANGER: deletes data)
docker compose down -v && docker compose up -d


## Backend connection URL (Node/PHP)
postgres://newscenter:nc_secret@db:5432/newscenter