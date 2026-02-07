# Kernel

![Platform](https://img.shields.io/badge/platform-desktop-blue)
![Electron](https://img.shields.io/badge/Electron-25+-9feaf9)
![React](https://img.shields.io/badge/React-18+-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6)
![Python](https://img.shields.io/badge/Python-3.10+-3776ab)
![Status](https://img.shields.io/badge/status-active%20development-yellow)

**Kernel** is a desktop notebook application that combines markdown-based note-taking with executable code blocks, designed for technical thinking, experimentation, and iterative work.

![Kernel demo](assets/app-image.png)

It sits somewhere between **Jupyter**, **Obsidian**, and **VS Code**—but optimized for local, reproducible execution and structured technical notes rather than documents or blogs.

Kernel is built as a desktop app to give users:
- Full control over execution
- Predictable local state
- A fast, focused writing + coding workflow without browser constraints

---

## Why Kernel?

Most tools force a tradeoff:
- **Markdown apps** are great for writing, but weak for computation
- **Jupyter notebooks** are powerful, but fragile, messy, and browser-bound
- **Code editors** are great for code, but awkward for narrative thinking

Kernel is an attempt to close that gap:
- Write like you’re thinking
- Run code inline
- Keep outputs deterministic
- Stay local, fast, and debuggable

---

## Core Features

- **Markdown-first notes**  
  Write structured notes with headings, lists, math, and code blocks.

- **Executable code blocks**  
  Run code directly inside notes and render outputs inline.

- **Isolated execution model**  
  Code execution is sandboxed from the UI via IPC, avoiding UI freezes and keeping runs deterministic.

- **Local-first persistence**  
  Notes and outputs are stored locally—no cloud dependency, no sync surprises.

- **Modular architecture**  
  The app is designed so execution backends, rendering logic, and UI components are cleanly separated.

---

## Architecture Overview

Kernel is built as a **desktop Electron application** with a clear separation of concerns:

### Frontend
- React + TypeScript
- Markdown rendering with executable blocks
- Deterministic output rendering
- Local state management (no backend server)

### Execution Layer
- Python execution isolated from the UI
- IPC-based communication between renderer and execution process
- Controlled input/output handling for reproducibility

### Desktop Runtime
- Electron provides filesystem access, process isolation, and native performance
- Designed to feel like a real app, not a wrapped website

---

## Current Status

Kernel is under active development.

Current focus areas:
- Stabilizing the execution model
- Improving block-level UX (editing, running, re-running)
- Making output rendering predictable and debuggable
- Refining the desktop experience (layout, performance, polish)

This is not yet a packaged, end-user product—it’s a systems-oriented project exploring better tooling for technical work.

---

## Non-Goals (For Now)

Kernel is **not currently trying to be**:
- A cloud notebook platform
- A collaborative editor
- A replacement for full IDEs
- A publishing tool

These tradeoffs are intentional.

---

## Motivation

Kernel grew out of frustration with existing tools when working on:
- Machine learning experiments
- Technical notes tightly coupled with code
- Research-style workflows where clarity and reproducibility matter

The goal is not to do *everything*, but to do one workflow extremely well.

---

## Roadmap

- [ ] Robust execution lifecycle management  
- [ ] Improved error surfacing and debugging output  
- [ ] Block reordering and richer interactions  
- [ ] Stronger persistence and project structure  
- [ ] Desktop packaging and distribution  

---

## Tech Stack

- Electron  
- React  
- TypeScript  
- Python  

