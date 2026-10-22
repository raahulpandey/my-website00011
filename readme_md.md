# Assessment Demo Platform

A frontend-only interactive assessment simulation platform built with Vite. It features timed multi-section tests (MCQ and coding simulation), persistent session recovery, zero-rebuild question database updates, and support for on-the-fly JSON/TXT question imports.


## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Configuration & State Management](#-configuration--state-management)
  - [Timer & Section Rules](#timer--section-rules)
  - [Session & Anti-Refresh Mechanism](#session--anti-refresh-mechanism)
- [Question Bank Setup](#-question-bank-setup)
  - [1. Static JSON Database](#1-static-json-database)
  - [2. MCQ Format Specification](#2-mcq-format-specification)
  - [3. Dynamic Import (JSON & TXT)](#3-dynamic-import-json--txt)
  - [4. Target Question Distribution](#4-target-question-distribution)
- [Known Limitations & Architecture Decisions](#-known-limitations--architecture-decisions)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Key Features

- **Multi-Section Assessments:** Built-in support for English, Aptitude, Logical Reasoning, Technical, Core Engineering, and Coding modules.
- **Tamper-Resistant Timers:** Timers utilize fixed start epoch timestamps in storage, preventing candidates from resetting clocks via browser refresh.
- **Dynamic File Ingestion:** Upload custom tests in `.json` or human-readable `.txt` formats directly from the UI Instructions screen.
- **Zero-Rebuild Data Updates:** Edit default static questions in `public/data/questions.json` without having to trigger a new application build.
- **Coding Simulation Environment:** Interactive code layout simulation with standard multi-language editor aesthetics.

---

## 🛠 Tech Stack

- **Runtime Environment:** Node.js (v18+)
- **Bundler & Tooling:** Vite
- **Frontend Architecture:** Modern JavaScript (ES Modules), HTML5, CSS3
- **Storage Layer:** `sessionStorage` (active attempt state) & `localStorage` (custom question bank uploads)

---

## 📁 Project Structure

```text
my-website00011/
├── public/
│   └── data/
│       ├── questions.json     # Default questions loaded by the app
│       └── questions.txt      # Reference structure for text imports
├── src/
│   ├── data/
│   │   ├── config.js          # Timers, thresholds, section target counts
│   │   └── questions.js       # Fallback mock questions & code problems
│   └── ...                    # UI components, styling, logic scripts
├── index.html                 # Main single-page application entry point
├── package.json               # Dependencies and runner scripts
├── package-lock.json          # Dependency lockfile
└── vite.config.js             # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or later installed
- **Browser**: Google Chrome (strongly recommended for best rendering and dialog support)

### Installation

Clone the repository and install the project dependencies:

```bash
git clone <repository-url>
cd my-website00011
npm install
```

> **Note for macOS/Linux users:** If Vite throws a `Permission denied` error on initial execution, ensure binary execute permissions are granted:
> ```bash
> chmod +x node_modules/.bin/vite
> ```

### Development Server

Start the local development server:

```bash
npm run dev
```

Open the displayed local URL in your browser (typically `http://localhost:5173/`).

### Production Build

To build the static distribution bundle for hosting:

```bash
npm run build
```

The output will be placed in the `dist/` directory, ready to deploy to any static host (Netlify, Vercel, GitHub Pages, Nginx, or AWS S3).

---

## ⚙️ Configuration & State Management

### Timer & Section Rules

- Main rules and target quotas are located in **`src/data/config.js`**.
- Here you can configure:
  - Duration per section (in minutes/seconds).
  - Target question counts per category.
  - Section transition behaviors and warning thresholds.

### Session & Anti-Refresh Mechanism

- Candidate progress is tracked inside **`sessionStorage`**.
- Timers record absolute start timestamps:
  $$\text{Remaining Time} = \text{Total Allocated Time} - (\text{Current Timestamp} - \text{Start Timestamp})$$
- Closing or reloading the tab continues to deplete elapsed time, preventing test resets.

---

## 📝 Question Bank Setup

### 1. Static JSON Database

Default questions reside in `public/data/questions.json`. Any changes made directly to this file will immediately reflect upon page reload—**no project recompilation (`npm run build`) is required**.

Supported high-level keys:
- `english`
- `aptitude`
- `logical`
- `technical`
- `core`
- `coding` (Object with `coding` and `automata` arrays)

### 2. MCQ Format Specification

MCQ items must strictly follow this structure:

```json
{
  "q": "What will be the output of console.log(typeof NaN)?",
  "o": [
    "number",
    "undefined",
    "object",
    "NaN"
  ],
  "a": 0
}
```

- `q` (*string*): The question statement.
- `o` (*array of strings*): List of 4 multiple-choice options.
- `a` (*number*): Zero-indexed indicator of the correct choice (`0` for A, `1` for B, `2` for C, `3` for D).

### 3. Dynamic Import (JSON & TXT)

Candidates or administrators can supply custom questions from the **Instructions** screen without codebase modification:

1. **JSON Imports:** Must match the standard structure of `questions.json`.
2. **Plain Text (`.txt`) Imports:** Must follow the tagging standard illustrated in `public/data/questions.txt`:

```text
[technical]
Q: Which protocol operates on port 443 by default?
A) HTTP
B) HTTPS
C) FTP
D) SSH
ANS: B

[english]
Q: Choose the correct synonym for "Benevolent":
A) Hostile
B) Kind
C) Arrogant
D) Passive
ANS: B
```

- Imported banks are saved to browser `localStorage`.
- Click **"Reset to default"** on the instructions page to clear local storage overrides and restore the base question bank.

### 4. Target Question Distribution

The configuration defaults expect the following balance:

| Section | Target Item Count |
| :--- | :--- |
| **English** | 18 |
| **Aptitude** | 15 |
| **Logical Reasoning** | 15 |
| **Technical** | 15 |
| **Core Engineering** | 15 |
| **Coding & Automata** | Configured in `src/data/config.js` |

*(The starter sample set contains 3 demo items per section. Populate `QS` or `questions.json` to reach full capacity).*

---

## 🔒 Known Limitations & Architecture Decisions

- **Frontend-Only Execution:** Source code entered in the coding sections is simulated for assessment workflows; it is not dispatched to an isolated remote sandbox (e.g., Judge0 or Docker).
- **Proctoring Scope:** The application runs exclusively client-side. It does not enforce OS-level lockdown, webcam tracking, or external hardware monitoring.
- **Browser Scoping:** Storage relies on client-side Web APIs (`localStorage` / `sessionStorage`). Clearing browser cache will reset imported custom questions.

---

## ❓ Troubleshooting

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| `Permission denied` on `npm run dev` | Missing execute rights on the Vite binary | Run `chmod +x node_modules/.bin/vite` |
| `Missing script: "dec"` | Typo in terminal command | Run `npm run dev` instead |
| Port `5173` already in use | Previous process suspended via `Ctrl+Z` | Terminate with `killall -9 node` or run on another port |
| Custom questions not appearing | Old cache or invalid formatting | Click **"Reset to default"** on Instructions and inspect console for syntax errors |