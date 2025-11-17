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

---

# Backend Service (Sprint 2)

The backend is built with Node.js and implements the database logic as well as the real-time Publish/Subscribe system.

## Prereqs
- Node.js (see `backend/package.json` for dependencies)
- A running database instance (see above: `docker compose up -d`)
- A `.env` file in the `backend/` folder with the correct DB credentials (Host: `localhost` if the backend is running directly on the host machine).

## Run
Navigate to the `backend/` folder and start the server:

```bash
npm install 
npm run dev