// L blasa lwahda fin kayn l'appel l backend (FastAPI).
// POST /api/chat { question } -> { answer: string, sources: [{ title, page, url }] }
export async function askBackend(question) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error("Network error");
  return res.json();
}
