# FoundrPilot (Backend) 🚀🤖

FoundrPilot is an enterprise-grade, generative artificial intelligence platform engineered to help startup founders instantly validate, stress-test, and refine their business ideas. 

By combining the highly structured architecture of **NestJS** with the intelligence of Google's **Gemini API** via **LangChain**, FoundrPilot acts as an automated, AI-driven venture analyst—evaluating market viability, identifying potential competitors, and generating strategic roadmaps.

---

## 🛠️ Technical Architecture & Stack

* **Framework:** **NestJS** (TypeScript) – Utilizing a highly modular, decoupled architecture (`Modules`, `Services`, `Controllers`, `Guards`).
* **AI Orchestration:** **LangChain** – Used to build structured prompt templates, manage LLM chain states, and handle conversational context.
* **Core LLM Engine:** **Google Gemini API** (`gemini-pro` / `gemini-1.5-flash`) – Leveraged for advanced reasoning, market synthesis, and validating business ideas.
* **Security & Access Control:** **JWT (JSON Web Tokens)** – Stateless, secure authentication paired with custom NestJS `AuthGuards` to protect user data and track API usage.
* **Database & Storage:** [PostgreSQL / MongoDB - *Optional: insert database type here*]
* **Validation:** `class-validator` & `class-transformer` – Enforcing strict type safety and request payload sanitation at the controller level.

---

## ✨ Key Features

* **🧠 Automated Idea Validation:** Translates raw founder ideas into full-scale feasibility reports, scoring market potential, technical difficulty, and revenue models using LangChain structured outputs.
* **🔐 Secure Auth Architecture:** Custom JWT strategy implementation ensuring that sensitive founder ideas and intellectual property remain securely isolated per user account.
* **📊 Competitive Intelligence Agent:** Leverages Gemini's wide context window to perform predictive competitive analysis, identifying market gaps that traditional search misses.
* **🧩 Modular AI Service:** Built a reusable `AiModule` inside NestJS, allowing the system to easily swap out underlying LLM chains without breaking downstream business logic.

---

## 🚀 REST API Architecture Overview

The backend enforces clean REST principles and is fully secured by JWT guards.

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Registers a new founder account | ❌ No |
| `POST` | `/api/v1/auth/login` | Authenticates user and returns access token | ❌ No |
| `POST` | `/api/v1/validate` | Submits a startup idea to the LangChain + Gemini pipeline | 🔒 **Yes (JWT)** |
| `GET` | `/api/v1/validations` | Fetches a historical list of validated ideas for the user | 🔒 **Yes (JWT)** |
| `GET` | `/api/v1/validations/:id`| Retrieves the detailed breakdown report of a specific idea | 🔒 **Yes (JWT)** |

---

## ⚙️ Local Setup and Installation

### Prerequisites
* Ensure you have **Node.js (v18 or higher)** installed.
* A valid **Google Gemini API Key** (obtained via Google AI Studio).

### 1. Clone the repository
```bash
git clone [https://github.com/Shukazuby/foundrpilot-backend.git](https://github.com/Shukazuby/foundrpilot-backend.git)
cd foundrpilot-backend
