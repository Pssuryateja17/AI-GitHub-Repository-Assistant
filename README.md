# 🚀 AI-Powered GitHub Repository Analysis Platform

An AI-powered full-stack web application that analyzes GitHub repositories and helps developers understand unfamiliar codebases through automated summaries, technology stack identification, architecture insights, repository comparisons, and AI-powered chat.

## 📌 About the Project

Understanding a large GitHub repository can be challenging, especially for beginners and developers working with unfamiliar technologies. Manually exploring source files, dependencies, and folder structures takes considerable time.

The **AI-Powered GitHub Repository Analysis Platform** simplifies this process by analyzing public GitHub repositories and presenting useful information in an understandable format. Users can explore repository summaries, technologies, architecture, installation instructions, recommendations, and more through an interactive web interface.

## 📸 Screenshots

### 🔐 Login_Interface
![Login Interface](https://github.com/Pssuryateja17/AI-GitHub-Repository-Assistant/blob/e89db660eaedc815f4d9841266d314464621eaa0/screenshots/Login_Interface.png)

### 📊 Dashboard
![Dashboard](https://github.com/Pssuryateja17/AI-GitHub-Repository-Assistant/blob/9036dce7359add41db28d01d66729a3b6bf20dd9/screenshots/Dashboard.png)

### 🔍 Repository Analyzer
![Repository Analyzer](screenshots/Repository_Analyzer.png)

### 📑 Repository Analyzer2

### ⚖️ Compare Repositories

### 🤖 Ai_assistant_chatbox

### 🕘 History

## ✨ Features

- **Repository Analysis:** Analyze public GitHub repositories by entering their URLs.
- **AI-Powered Summaries:** Generate understandable summaries explaining a repository's purpose and functionality.
- **Technology Stack Detection:** Identify the programming languages, frameworks, and dependencies used in a project.
- **Architecture Insights:** Explore repository folder structures and understand project organization.
- **Installation Guidance:** Generate installation instructions and setup information.
- **Repository Comparison:** Compare multiple repositories to understand their features, technologies, and differences.
- **Analysis History:** Access previously analyzed repositories.
- **Saved Repositories:** Save repositories for quick access later.
- **AI Repository Chat:** Ask questions about an analyzed repository and get AI-generated explanations.
- **Dashboard:** Access repository analysis and related information from a centralized interface.
- **Report Export:** Export analysis results in PDF, JSON, and Markdown formats.
- **User Authentication:** Register, log in, and access personalized application features.

## 🛠️ Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- TypeScript

### Database and ORM
- PostgreSQL
- Prisma ORM

### AI and Repository Integration
- GitHub API
- Ollama
- Locally hosted large language models (LLMs)

### Authentication and Validation
- JSON Web Tokens (JWT)
- HTTP-only cookies
- bcrypt
- Zod

### Deployment and Development Tools
- Git
- GitHub
- Docker
- Neon PostgreSQL
- Vercel
- Render

## 🏗️ System Architecture

The application follows a full-stack architecture that connects the frontend, backend, database, GitHub API, and AI model.

1. **User Input:** The user enters a public GitHub repository URL through the web interface.
2. **Frontend Processing:** The React frontend sends requests to the backend using Axios.
3. **Repository Data Retrieval:** The Express.js backend communicates with the GitHub API to retrieve repository information.
4. **Repository Analysis:** The application processes the available repository data, including file structures and relevant project information.
5. **AI-Powered Insights:** The configured language model generates explanations, summaries, and recommendations based on the information provided to it.
6. **Database Operations:** PostgreSQL stores application data, including user information, analysis history, and saved repositories.
7. **Results Presentation:** The frontend displays the analysis in an organized and user-friendly format.
8. **Additional Features:** Users can compare repositories, ask questions through AI chat, revisit previous analyses, and export reports.

## 💻 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/) or access to a configured PostgreSQL database
- [Ollama](https://ollama.com/), if required for the AI features

### 1. Clone the Repository

```bash
git clone https://github.com/Pssuryateja17/AI-GitHub-Repository-Assistant.git
```

Navigate to the project directory:

```bash
cd AI-GitHub-Repository-Assistant
```

### 2. Install Dependencies

Install the frontend dependencies:

```bash
cd client
npm install
```

Install the backend dependencies:

```bash
cd ../server
npm install
```

**Note:** These commands assume that the frontend directory is named `client` and the backend directory is named `server`. Adjust the paths if your project uses different directory names.

### 3. Configure Environment Variables

Create the necessary `.env` files in the appropriate directories.

Configure the environment variables required by your application, such as:

- PostgreSQL database connection URL
- JWT secret
- Cookie configuration
- Backend port
- Frontend API URL
- Ollama endpoint and model configuration

Use your project's existing environment variable names and configuration.

**Security:** Never commit passwords, database credentials, JWT secrets, or other sensitive information to GitHub.

### 4. Configure the Database

Ensure that your PostgreSQL database is running and that the database connection URL is configured correctly.

If your project uses Prisma migrations, run the appropriate migration command from the backend directory:

```bash
npx prisma migrate deploy
```

Use this command when the required Prisma migration files are available. Follow your project's existing database setup instructions if additional steps are necessary.

### 5. Start the Backend

Navigate to the backend directory and run the development command configured in its `package.json` file.

For example:

```bash
npm run dev
```

### 6. Start the Frontend

Open another terminal, navigate to the frontend directory, and run:

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal.

**Note:** Verify the directory names, environment variables, database commands, and available npm scripts against your actual project configuration.

## 🌐 Live Demo

- **Frontend Application:** https://ai-github-repository-assistant.vercel.app
- **Backend API:** https://ai-github-repository-assistant.onrender.com

## 🎯 Project Objectives

- Simplify the process of understanding unfamiliar GitHub repositories.
- Reduce the time required to explore large codebases.
- Help developers identify technologies, dependencies, and project structure.
- Provide AI-powered explanations and repository insights.
- Enable users to compare repositories and make informed technology choices.
- Improve the accessibility of software project analysis for students and developers.

## 💡 Use Cases

- **Students:** Understand open-source projects and learn how applications are structured.
- **Developers:** Explore unfamiliar repositories before contributing to them.
- **Beginners:** Learn about technologies, dependencies, and installation procedures.
- **Project Teams:** Compare repositories and evaluate different implementation approaches.
- **Open-Source Contributors:** Get an initial overview of a project before exploring its code in detail.

## 🔮 Future Enhancements

- Advanced code quality analysis.
- More detailed dependency and relationship visualization.
- Improved support for large repositories.
- Enhanced repository recommendations.
- Additional AI models and analysis capabilities.
- More detailed security and maintainability insights.

## 👨‍💻 Author

**P Sai Surya Teja**

- **GitHub:** [Pssuryateja17](https://github.com/Pssuryateja17)

## ⭐ Support

If you find this project useful, consider giving the repository a star!

---

*Built to make GitHub repository exploration easier, faster, and more accessible through AI.*
