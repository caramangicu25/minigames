# MiniGames

A mini games platform with authentication, leaderboards, and user profiles.

## Games
- Sudoku
- Memory Game (flip cards)
- Click Speed Test
- Snake (classic)
- Tic Tac Toe (vs player or bot)

## Stack
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4, Zustand, Zod
- **Backend**: .NET 10, ASP.NET Core Web API, PostgreSQL, JWT Auth

## Structure
\`\`\`
minigames/
├── frontend/   # Next.js app
└── backend/    # .NET solution (4-layer architecture)
\`\`\`

## Getting Started

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### Backend
\`\`\`bash
cd backend
dotnet run --project MiniGames.Api
\`\`\`
