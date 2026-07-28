<div align="center">
  <h1>✨ Dhananjeyan's AI-Powered Portfolio ✨</h1>
  <p>A modern, highly interactive portfolio featuring <b>Studio Orb</b>—a custom Agentic AI assistant powered by Retrieval-Augmented Generation (RAG).</p>

  ![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>

---

## 🚀 About the Project
This is not just a static portfolio website. It acts as an interactive resume and showcase, featuring an embedded AI assistant named **Studio Orb**. Visitors can chat with the AI to ask questions about my skills, work experience, and past projects. 

The AI is powered by **RAG (Retrieval-Augmented Generation)**, meaning it directly reads and references my actual PDF resume securely stored in a vector database, guaranteeing accurate and hallucination-free answers about my professional background!

---

## 🌟 Key Features
- **🤖 Studio Orb AI Assistant:** A custom-styled, interactive chat interface built into the portfolio.
- **📚 RAG-Powered Knowledge:** Automatically parses and vectorizes a PDF resume into chunks for semantic search.
- **⚡ Ultra-Fast Inference:** Utilizes **Groq** for lightning-fast LLM responses and **Cohere** for high-quality text embeddings.
- **🎨 Modern UI/UX:** Built with Tailwind CSS, featuring glassmorphism, dynamic gradients, and smooth Framer Motion animations.
- **💬 Smart Suggestions:** Dynamic chat suggestions guiding visitors to ask the right questions.

---

## 🛠️ Tech Stack
**Frontend:**
- [Next.js](https://nextjs.org/) (React Framework)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Zustand](https://github.com/pmndrs/zustand) (State Management)

**Backend & AI:**
- Node.js & Express.js
- [Supabase](https://supabase.com/) (`pgvector` for vector database)
- [Groq API](https://groq.com/) (LLM Chat Completions)
- [Cohere API](https://cohere.com/) (Text Embeddings)

---

## 💻 Getting Started

### 1. Install Dependencies
This project uses `pnpm` as the package manager.
```bash
pnpm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory and add your secret keys. 
*(**Note:** If your Supabase password contains special characters like `@`, be sure to URL-encode it to `%40`!)*

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
COHERE_API_KEY="your_cohere_api_key_here"
GROQ_API_KEY="your_groq_api_key_here"
NEXT_PUBLIC_API_URL="http://localhost:10000" # Use live Render URL for production
```

### 3. Embed Your Resume (RAG Setup)
To give the AI your data, place your resume PDF in the root folder as `Resume_.pdf` and run the embedding script. This will parse the PDF, generate embeddings via Cohere, and save them to Supabase.

```bash
pnpm run embed:resume
```

### 4. Run Locally
Start both the Next.js frontend and the Express backend simultaneously:
```bash
pnpm run dev
```
- Frontend will run on: `http://localhost:3000`
- Backend will run on: `http://localhost:10000`

---

## 🌍 Deployment
- **Frontend:** Hosted on [Vercel](https://vercel.com/) for fast edge delivery.
- **Backend:** Hosted on [Render](https://render.com/) as a Node Web Service.
*(Remember to update environment variables on both platforms when deploying!)*
