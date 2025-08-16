# Adaptive RAG Explorer

This project is an interactive web application that demonstrates and visualizes an **Adaptive Retrieval-Augmented Generation (RAG)** pipeline. Inspired by concepts from LangGraph, the application intelligently decides how to answer a user's query by choosing between different strategies: querying a vector database, performing a web search, or answering directly.

The entire process, from the initial routing decision to the final answer generation, is visualized in real-time, providing a clear view into the AI's "thought process."

## 🚀 Features

-   **Interactive Chat Interface**: A familiar and intuitive way to interact with the AI.
-   **Real-time Graph Visualization**: See the AI's decision-making path light up as it progresses through the pipeline.
-   **Step-by-Step Thought Process**: A detailed log explains each action the AI takes and why.
-   **Adaptive Routing**: The AI analyzes the user's query to choose the most efficient path:
    -   **Vector Store**: For questions about specific, pre-loaded knowledge (e.g., React, Gemini API).
    -   **Web Search**: For up-to-the-minute information, recent events, or topics outside the local knowledge base.
    -   **Direct Answer**: For simple conversational queries or greetings.
-   **RAG Fusion**: The system generates multiple variations of the initial query to retrieve a more diverse and relevant set of documents from the vector store.
-   **Relevance Grading**: After retrieving documents, an AI-powered step grades them for relevance, filtering out unhelpful information before generating an answer.
-   **Source Citation**: Answers generated from external documents or web searches include links to the original sources.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`) for all language model tasks, including routing, query generation, grading, and final answer synthesis.

## 🔧 Setup & Running the Project

To run this project locally, you'll need a Google Gemini API key.

### 1. Get an API Key

-   Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create your free API key.

### 2. Set Up Environment Variables

-   In the project's root directory, you'll find a file named `.env.example`.
-   Create a copy of this file and rename it to `.env`.
-   Open the new `.env` file and replace `"your_gemini_api_key_here"` with the actual API key you obtained.

**File: `.env`**
```
API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 3. Run the Application

This project is set up to run directly in a browser without a complex build step.

1.  Make sure all the project files (`index.html`, `index.tsx`, etc.) are in the same folder.
2.  You will need a simple local server to handle the module imports correctly. If you have Node.js installed, you can use `serve`:
    ```bash
    # Install serve globally if you don't have it
    npm install -g serve

    # Run the server from your project folder
    serve
    ```
3.  Open your browser and navigate to the local address provided by the server (usually `http://localhost:3000`). The application should now be running!
