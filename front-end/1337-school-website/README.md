# 1337 Frontend (React + Tailwind v4 + Vite)

    npm install
    npm run dev

- Put 2 images in /public: `hero.jpg` (building) and `students.jpg` (students). Without them a gradient is shown.
- Backend (FastAPI) expected on http://localhost:8000. Endpoint:
  POST /api/chat  { "question": "..." }  ->  { "answer": "...", "sources": [{ "title": "...", "page": 2, "url": "..." }] }
  Empty `answer` => "No results" state. Network failure => "Error" state with Try again.
