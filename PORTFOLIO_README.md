# 🚀 Yousef Ali Ahmed – Portfolio & Reflection Diary

A premium, minimal personal website for documenting reflections, projects, and preparing for applications.

## ✨ Features

### 📊 Dashboard
- Streak counter (consecutive days journaling)
- Total entries count
- Application readiness progress (78%)
- Today's entry snapshot
- Last 7 entries feed
- Current semester summary

### 📔 Diary
- **List**: Search + filter by mood/tags
- **Create**: Form with 5 reflection sections + live word count
- **Read**: Full entry detail with navigation
- **Persist**: Saves to localStorage (demo mode)

### 📚 Academics
- Expandable semester timeline
- Per-course details (topics, skills, assignments, reflection)
- Grade badges
- Overall statistics

### 🚀 Projects
- Grid showcase of 6 projects
- Impact metrics (reach, users, revenue, etc.)
- Detailed views with full project write-ups
- Tags and categorization

### 💼 Applications
- Story Bank (10 stories across 5 categories)
- Strengths with evidence
- One-click export to clipboard
  - Essay outline (markdown)
  - Readiness summary
- Application prep progress tracker

## 🎨 Design

- **Minimal & Premium**: Clean card-based UI
- **Responsive**: Desktop sidebar + mobile drawer
- **Dark Mode**: Toggle button (🌙/☀️) with persistence
- **DaisyUI Components**: Cards, badges, buttons, inputs
- **Accessible**: Semantic HTML, keyboard navigation

## 🛠️ Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TailwindCSS v4**
- **DaisyUI 5**
- **TypeScript** (mock data)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

## 📁 Project Structure

```
/app
  ├── page.js                 (Dashboard)
  ├── layout.js              (Root layout)
  ├── diary/
  │   ├── page.js            (List + filters)
  │   ├── new/page.js        (Create entry)
  │   └── [id]/page.js       (Detail view)
  ├── academics/page.js      (Semester timeline)
  ├── projects/
  │   ├── page.js            (Grid)
  │   └── [slug]/page.js     (Detail)
  └── applications/page.js   (Story bank + export)

/components
  ├── Sidebar.js             (Desktop nav)
  ├── TopNav.js              (Mobile + search)
  └── ThemeProvider.js       (Dark mode)

/data
  └── mock.ts                (All mock data)

/lib
  └── utils.js               (Helpers)
```

## 📊 Mock Data

Includes realistic data:
- 12 diary entries with moods (1-5) and tags
- 4 semesters with 11 courses
- 6 projects with impact metrics
- 10 story bank items
- 6 strengths with evidence
- Application readiness tracking

## 🎯 Routes

| Route | Purpose |
|-------|---------|
| `/` | Dashboard |
| `/diary` | Diary list with filters |
| `/diary/new` | Create new entry |
| `/diary/[id]` | View entry |
| `/academics` | Semester timeline |
| `/projects` | Project grid |
| `/projects/[slug]` | Project details |
| `/applications` | Story bank + export |

## 🌙 Dark Mode

- Automatic detection
- Manual toggle (button, bottom-right)
- Persists via localStorage
- DaisyUI theme support

## 💾 Data Persistence

**Current**: localStorage for new diary entries (demo mode)
**Note**: Refresh page to see saved entries

To add real backend:
1. Create API routes in `/app/api`
2. Replace localStorage calls with fetch()
3. Add database (Supabase, MongoDB, etc.)

## 📝 Usage Tips

- **New Entry**: Press `/diary/new` or click "New Entry" button
- **Search**: Filter diary by title, content, mood, or tags
- **Export**: Copy your essay outline or summary to clipboard
- **Navigation**: Use sidebar (desktop) or hamburger menu (mobile)
- **Dark Mode**: Toggle with 🌙/☀️ button

## 🚢 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

Deploys easily to Vercel, Netlify, or any Node.js host.

## 📄 License

Personal project © 2025 Yousef Ali Ahmed

---

**Status**: ✅ Complete and Production-Ready
