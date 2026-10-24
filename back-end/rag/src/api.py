
from fastapi import FastAPI
# from fastapi.?
from pydantic import BaseModel
from .__main__ import CLI


app = FastAPI()
rag = CLI()


class ChatRequest(BaseModel):
    question: str


@app.post("/api/chat")
def chat(request: ChatRequest):
    answer = rag.answer(request.question, k=4)
    return {"answer": answer}
