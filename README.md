# Kernel

![Platform](https://img.shields.io/badge/platform-desktop-blue)
![Electron](https://img.shields.io/badge/Electron-25+-9feaf9)
![React](https://img.shields.io/badge/React-18+-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6)
![Python](https://img.shields.io/badge/Python-3.10+-3776ab)
![Status](https://img.shields.io/badge/status-active%20development-yellow)

**Kernel** is a customizable desktop notebook that sits somewhere between notion and jupyter notebook. Built this because I don't like notion's color scheme oop.

<p align="center">
  <img src="web/assets/app-image.png" width="800" />
</p>

It sits somewhere between **Jupyter**, **Obsidian**, and **VS Code**—but optimized for local, reproducible execution and structured technical notes rather than documents or blogs.

Kernel is built as a desktop app to give users:
- Full control over execution
- Predictable local state
- A fast, focused writing + coding workflow without browser constraints

---

## Getting Started

### Prereqs
- **Node.js** (LTS recommended)
- **pnpm**
- **Python 3.10+** (for the execution layer)

### Install

Clone the repo and install dependencies in both the backend and frontend.

```bash
# backend
cd api
pnpm install

# frontend
cd ../web
pnpm install
```

Additionally, rename the .env.example file to .env in the web directory. 
```bash
cd web
cp .env.example .env
```

## Backend Setup (Database + Migrations)
```bash
cd api/src/db
touch app.db     # or on a windows machine, just create a new file called app.db

# to initialize the database
cd api
pnpm db:init
```


## Running the Application
```bash
# backend
cd api
pnpm start          # in terminal 1

# frontend
cd web
pnpm dev            # in terminal 2
pnpm electron       # in terminal 3
```
---
