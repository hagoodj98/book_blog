# Jaiquez’s Book Blog

A full‑stack book‑blog application using:
- **Backend:** Node.js + Express + PostgreSQL
- **Frontend:** Next.js 13 (App Router) + React + Material‑UI

---

## 🚀 Quickstart

### 1. Clone & install

```bash
git clone https://github.com/hagoodj98/book_blog.git
cd book_blog

Copy the example env file, then edit it with your own credentials:

cp server/.env.example server/.env

In server/.env set:

# your full connection string, including ssl config if needed
DBConfigLink=postgres://<USER>:<PASS>@<HOST>:<PORT>/<DATABASE>?sslmode=require

# install server deps
cd server
npm install

# start your Postgres (locally) or ensure your remote DB is up

# launch with auto‑reload
npm nodemon index.js

	•	“Connection terminated unexpectedly”
If your free‑tier Postgres on Render (or wherever) has paused, you’ll see that error because the free/tier has expired on my account. You could switch to a local Postgres connection in your .env.

By default the API listens on port 4000.

Run the frontend

In a second terminal:

cd ../my-app
npm install
npm run dev

Your Next.js app will start on port 3000. Open:

http://localhost:3000

and you should see the Book Blog homepage.

