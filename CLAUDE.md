# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dreamer's Brush (童梦画笔) is an AI-powered children's storybook illustration generator. Users input a character description and an action, and the app generates whimsical watercolor-style illustrations using Alibaba Cloud's DashScope API (Qwen/Wanxiang models).

## Development Commands

```bash
# Frontend (React + Webpack, runs on port 3266)
npm run dev           # Start frontend dev server
npm run build         # Build production bundle
npm run typecheck     # TypeScript type checking

# Backend (Express, runs on port 3001)
npm run server        # Start backend server
npm run server:dev    # Start backend with nodemon hot-reload

# Database (MySQL)
npm run db:init       # Interactive database initialization script
```

Both frontend and backend must be running simultaneously for full functionality.

## Architecture

### Frontend (`client/`)
- **React 18** with TypeScript, bundled by Webpack 5
- **Tailwind CSS** for styling with custom warm/dreamy color palette
- Entry point: `client/src/index.tsx` → `App.tsx`
- API client: `client/src/services/api.ts` - all HTTP requests to backend
- Image generation logic: `client/src/services/imageGen.ts` - prompt building and response parsing

### Backend (`server/`)
- **Express 5** with CommonJS modules
- Single entry point: `server/index.js`
- MySQL connection pool via `mysql2/promise`
- File uploads handled by Multer, stored in `server/uploads/`
- DashScope API integration with automatic retry on 429 rate limits

### Database (`database/`)
- MySQL 8.0 with utf8mb4 encoding
- Three tables: `images`, `users`, `generation_history`
- Schema defined in `database/migrations/init-mysql.sql`

## Environment Configuration

Two environment files are required:

**`.env`** (backend):
```
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
DASHSCOPE_API_KEY, DASHSCOPE_DEFAULT_MODEL
PORT=3001
```

**`.env.local`** (frontend):
```
VITE_API_URL=http://localhost:3001
```

## Key API Endpoints

- `POST /api/generate-image` - Generate AI illustration (calls DashScope)
- `POST /api/upload` - Upload image file (multipart/form-data)
- `GET /api/images` - List uploaded images
- `GET /api/health` - Health check

## AI Image Generation

The app uses Alibaba Cloud DashScope API with two models:
- `qwen-image-2.0-pro-2026-03-03` (default, high quality)
- `wan2.7-image` (stronger artistic style)

Prompt construction adds a fixed style suffix: "柔和发光的水彩风格，经典儿童绘本插画..." (see `imageGen.ts`).

Generated image URLs are temporary (typically 24 hours). The response structure is: `output.choices[0].message.content[0].image`.

## Build Configuration Notes

**Tailwind CSS paths**: The `tailwind.config.js` uses relative paths (`./client/src/...`) instead of absolute paths because `fast-glob` (used internally by Tailwind) cannot handle paths containing apostrophes (the project directory is `Dreamer's Brush`). If the project is moved to a directory without special characters, absolute paths can be used.

**Webpack context**: Webpack runs with `context: __dirname` set to `client/`, but the dev server is started from the project root. PostCSS/Tailwind config paths must be relative to the project root.
