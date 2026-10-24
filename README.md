# 1337 Campus Assistant Chatbot (RAG-powered)

A smart, local Retrieval-Augmented Generation (RAG) chatbot designed specifically for the 1337 campus. It answers questions for both prospective visitors/students and current students regarding campus rules, campus life, procedures, and more.

## 👥 Team Members

* Khalid Boumaghdar

* Achraf Kouiss

* Yassine Bajdou

* Mohamed Bidlal

## ⚡ Why FastAPI?

We chose **FastAPI** to build our chat backend endpoint (`/api/chat`) because it is exceptionally fast, highly performant, and automatically generates interactive API documentation. It serves as a seamless, reliable communication layer between our React frontend and the RAG system, securely processing user questions and returning generated answers as JSON in real-time.

## 🚀 Quick Start Guide (For Judges)

Follow these simple steps to run the backend and frontend locally.

### 1. Run the Back-End (FastAPI)

Open your terminal in the backend directory and run:

```
uv run uvicorn src.api:app --reload

```

### 2. Run the Front-End (React)

Open another terminal in the frontend directory and run:

```
npm run dev

```

## 📂 Managing Knowledge Base (Local Data)

To add, update, or remove knowledge base files (accepted formats: `.txt` or `.md`), place your documents directly in this path:

```
back-end\rag\data\raw\vllm-0.10.1

```