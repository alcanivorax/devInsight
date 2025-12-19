# DevInsight

> A small tool to help understand GitHub repositories a bit faster.

DevInsight is an early-stage project that experiments with using AI to **summarize and explain GitHub repositories** in a more structured way.

It focuses on extracting useful signals from a repo and presenting them clearly — without over-claiming or guessing.

---

## Why DevInsight

When exploring a new repository, you often have to:

- Read a long README
- Jump across folders
- Guess how things fit together

DevInsight tries to reduce that initial friction by giving a **quick, cautious overview** of a repo.

It prefers being incomplete over being wrong.

---

## What it currently does

DevInsight analyzes a repository in small, separate parts:

- **Basic identity**
  Name, description, and general intent (app / library / tool)

- **Tech stack hints**
  Language, framework, runtime, and package manager — only when detectable from files

- **Structure overview**
  High-level folder signals and the presence of Docker, CI, or tests

- **Setup notes**
  Extracts the most common setup path when available, or states when setup is unclear or not intended for users

Planned but not fully built yet:

- File and folder click-through summaries (one level at a time)

---

## How it works (high level)

1. Fetches data from GitHub (metadata, tree, README, configs)
2. Filters and normalizes that data into strict internal types
3. Builds small context objects
4. Sends only necessary context to the AI
5. Validates the response before showing it

---

## Project status

This project is **work in progress**.

- Core extraction: working
- Structured AI output: working
- UI and deeper exploration: ongoing

Expect rough edges.

---

## Tech stack

- Next.js
- TypeScript
- GitHub REST API
- AI via API (OpenRouter)
- Zod for validation

---

## Installation

### Prerequisites

- **pnpm**
  Install pnpm: [https://pnpm.io/installation](https://pnpm.io/installation)

### Setup

1. **Clone the repository**

   Option 1: Clone directly

   ```bash
   git clone https://github.com/alcanivorax/devInsight
   ```

   Option 2: Fork the repository and clone your fork

2. **Move into the project directory**

   ```bash
   cd devInsight
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the required variables in `.env`. Each variable includes a short description in the example file.

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

The app should now be running locally.

---

## Contributing

This project is still evolving, so contributions are super welcome...

- Open issues for bugs, ideas, or improvements
- Keep changes small and focused
- Prefer clarity over cleverness

More contribution guidelines will be added as the project stabilizes.

### Branching

- Create a new branch for each issue or change
- Use a short, descriptive branch name  
  (e.g. `fix-readme-parser`, `docs-env-vars`)
- Open a pull request against `main`

## License

`MIT`
