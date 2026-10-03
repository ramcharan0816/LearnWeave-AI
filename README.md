# LearnWeave-AI


### Adaptive AI-Powered Personalized Learning Platform

LearnWeave AI is an AI-driven learning platform designed to personalize the learning experience by adapting to each student's knowledge, learning pace, and progress. It aims to combine Retrieval-Augmented Generation (RAG), knowledge graphs, machine learning, and multi-agent AI to support more effective learning.

## Project Vision

To build an intelligent learning environment that helps students understand concepts, identify knowledge gaps, receive personalized guidance, and revise topics at the right time.

## Planned Features

* **AI Learning Assistant:** Ask questions and receive context-aware explanations.
* **Document-Based Learning:** Upload learning materials and interact with their content.
* **Retrieval-Augmented Generation (RAG):** Generate responses grounded in relevant learning resources, with citations.
* **Knowledge Graph:** Represent concepts, prerequisites, and relationships between topics.
* **Adaptive Learning:** Adjust learning activities and difficulty based on estimated mastery.
* **AI Learning Agents:** Coordinate tutoring, assessment, learning planning, and revision tasks.
* **Progress Dashboard:** Track learning goals, performance, and areas for improvement.

> The platform is under active development. Planned features will be implemented and evaluated incrementally.

## Technology Stack

| Layer                | Technologies                      |
| -------------------- | --------------------------------- |
| Frontend             | Next.js, TypeScript, Tailwind CSS |
| Backend              | Python, FastAPI                   |
| AI and Orchestration | LLMs, LangGraph                   |
| Retrieval            | RAG, embeddings, vector search    |
| Database             | PostgreSQL, pgvector              |
| Knowledge Graph      | Neo4j                             |
| Machine Learning     | Scikit-learn, PyTorch             |
| Version Control      | Git, GitHub                       |

## Project Structure

```text
LearnWeave-AI/
├── backend/
│   └── app/
│       ├── __init__.py
│       └── main.py
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

* Python 3.10+
* Node.js and npm
* Git

### Backend Setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install fastapi "uvicorn[standard]" pydantic-settings
python -m uvicorn app.main:app --reload
```

The backend API will be available at:

* API: http://127.0.0.1:8000
* Interactive API documentation: http://127.0.0.1:8000/docs

### Frontend Setup

Open a separate terminal:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000.

## Development Roadmap

* [x] Initialize project repository
* [x] Set up FastAPI backend
* [x] Scaffold Next.js frontend
* [ ] Build the initial student dashboard
* [ ] Connect frontend with backend APIs
* [ ] Implement authentication and student profiles
* [ ] Add document ingestion and RAG-based tutoring
* [ ] Build the learning knowledge graph
* [ ] Implement adaptive mastery estimation
* [ ] Develop coordinated AI learning agents
* [ ] Evaluate learning outcomes and system performance
* [ ] Deploy the application

## Research Direction

The project will explore knowledge-graph-guided and uncertainty-aware selection of learning activities. The system's performance can be evaluated using mastery estimation, knowledge retention, recommendation relevance, response grounding, and system efficiency.

## Current Status

**Early development:** The initial FastAPI backend and Next.js frontend have been scaffolded. Core learning and AI capabilities are planned for subsequent development stages.

## Contribution

This is an actively developed academic major project. Development is tracked using Git and GitHub.

## License

A license will be selected and added as the project progresses.
