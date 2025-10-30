# 🎬 Frontend - React Client

> Modern React application for managing your movies and TV shows collection with a beautiful, responsive UI.

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Development](#-development)
- [Building](#-building)
- [Features](#-features)
- [Architecture](#-architecture)
- [Styling](#-styling)
- [API Integration](#-api-integration)
- [Performance](#-performance)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Backend server running on http://localhost:3000

### Start Development Server

```bash
# From project root
npm run dev

# Frontend will be available at http://localhost:5173
```

---

## 📁 Project Structure

```
client/
├── src/
│   ├── components/                 # Reusable React components
│   │   ├── MovieCard.tsx          # Movie/TV show card component
│   │   ├── MovieForm.tsx          # Add/edit form
│   │   ├── MovieList.tsx          # List display
│   │   ├── Pagination.tsx         # Pagination controls
│   │   └── ...
│   │
│   ├── pages/                      # Page components
│   │   ├── HomePage.tsx           # Home/list page
│   │   ├── DetailPage.tsx         # Movie detail page
│   │   └── ...
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useMovies.ts           # Movies API hook
│   │   ├── useForm.ts             # Form handling
│   │   └── ...
│   │
│   ├── lib/                        # Utility functions
│   │   ├── api.ts                 # API client
│   │   ├── validators.ts          # Zod schemas
│   │   ├── constants.ts           # App constants
│   │   └── ...
│   │
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
│
├── public/                         # Static assets
│   └── favicon.png
│
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                       # This file
```

---

## 📦 Installation

### 1. Install Dependencies

```bash
npm install
```

This installs:
- React & React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Radix UI components
- React Query (data fetching)
- React Hook Form
- Zod (validation)
- And more...

### 2. Verify Dependencies

```bash
npm list react react-dom react-query typescript tailwindcss
```

---

## 🔧 Development

### Start Dev Server

```bash
npm run dev
```

**Features:**
- ⚡ Hot Module Replacement (HMR) - code changes appear instantly
- 🎯 Fast refresh - preserves component state during edits
- 🐛 Source maps - debug original TypeScript code
- 📊 Dev Banner - shows environment info

### TypeScript Checking

```bash
npm run check
```

Verifies type safety without building. Run this before committing.

### Development Workflow

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: In same directory, frontend already starts with backend

# Make code changes - they reload automatically
# Fix any TypeScript errors in IDE
# Test in browser at http://localhost:5173
```

---

## 🏗️ Building

### Build for Production

```bash
npm run build
```

This:
1. Compiles React & TypeScript
2. Bundles and minifies code
3. Optimizes assets
4. Outputs to root `/dist/public/`

### Build Output

```
dist/public/
├── index.html              # Main HTML file
├── assets/
│   ├── main-*.js          # JavaScript bundles
│   ├── main-*.css         # CSS bundles
│   └── ...                # Images & fonts
└── favicon.png
```

### Build Analysis

```bash
npm run build -- --analyze
```

Analyzes bundle size and dependencies.

---

## ✨ Features

### Core Features
- 📝 **Add Movies & TV Shows** - Create new entries with metadata
- ✏️ **Edit Entries** - Update movie information
- 🗑️ **Delete Entries** - Remove from collection
- 📋 **List View** - Browse all items with pagination
- 🔍 **Search & Filter** - Find movies by type, year, director
- 📱 **Responsive** - Works on all screen sizes
- 💾 **Real-time** - Live updates from API

### UI Components
- **Movie Cards** - Display with images and metadata
- **Forms** - Add/edit with validation
- **Dialogs** - Confirmation prompts
- **Pagination** - Navigate large lists
- **Toasts** - Success/error notifications
- **Loading States** - Skeleton loaders
- **Empty States** - User-friendly messaging

### User Experience
- ✅ Client-side validation with helpful error messages
- ✅ Loading indicators during API calls
- ✅ Error handling with retry options
- ✅ Optimistic updates for better feel
- ✅ Keyboard shortcuts (optional)
- ✅ Accessibility (WCAG compliant)

---

## 🏛️ Architecture

### Component Hierarchy

```
<App>
  ├── <Router>
  │   ├── <HomePage>
  │   │   ├── <MovieList>
  │   │   │   ├── <MovieCard>
  │   │   │   ├── <MovieCard>
  │   │   │   └── <Pagination>
  │   │   └── <MovieForm>
  │   │
  │   └── <DetailPage>
  │       ├── <MovieDetail>
  │       └── <MovieForm>
  │
  └── <Toast Provider>
```

### Data Flow

```
API Call (fetch) 
    ↓
useMovies() Hook (React Query)
    ↓
Component State Update
    ↓
UI Re-render
    ↓
User sees new data
```

### State Management

**React Query** handles:
- Fetching data from API
- Caching responses
- Automatic refetching
- Error handling
- Loading states

**Local Component State**:
- Form inputs
- UI interactions
- Modal visibility
- Filter selections

**Custom Hooks**:
- `useMovies()` - Movies list
- `useMovie(id)` - Single movie
- `useCreateMovie()` - Create operation
- `useUpdateMovie()` - Update operation
- `useDeleteMovie()` - Delete operation

---

## 🎨 Styling

### Tailwind CSS

Utility-first CSS framework for styling.

```tsx
// Example usage
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Add Movie
</button>
```

### Radix UI Components

Accessible component library building blocks.

```tsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>...</Dialog.Content>
</Dialog.Root>
```

### Custom Styles

Global styles in `src/index.css`:
- CSS variables for colors
- Base styles
- Responsive breakpoints
- Dark mode support

### Customization

Edit `tailwind.config.ts`:
```typescript
export default {
  theme: {
    colors: { /* ... */ },
    spacing: { /* ... */ },
  }
}
```

---

## 🔌 API Integration

### API Client

Located in `src/lib/api.ts`:

```typescript
// Get all movies
const movies = await api.getMovies(page, limit);

// Get single movie
const movie = await api.getMovie(id);

// Create movie
const newMovie = await api.createMovie(data);

// Update movie
const updated = await api.updateMovie(id, data);

// Delete movie
await api.deleteMovie(id);
```

### React Query Integration

```typescript
// In your component
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function MovieList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['movies', page],
    queryFn: () => api.getMovies(page)
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{/* Render movies */}</div>;
}
```

### Error Handling

```typescript
// Automatic retry on failure
// Fallback to cached data if available
// User-friendly error messages
// Optional: Manual retry button
```

---

## ⚡ Performance

### Optimizations

- **Code Splitting** - Components loaded on demand
- **Image Optimization** - Lazy loading & compression
- **Caching** - React Query caches API responses
- **Memoization** - `React.memo` for expensive components
- **Tree Shaking** - Unused code removed from bundle
- **CSS Purging** - Only used Tailwind styles included

### Bundle Size

Current bundle sizes (estimated):
- `main.js` - ~200KB (gzipped)
- `main.css` - ~40KB (gzipped)
- Total - ~240KB (gzipped)

### Load Time

Target metrics:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 3s
- Time to Interactive: < 2.5s

### Monitor Performance

```bash
# Use Lighthouse
# Chrome DevTools → Lighthouse → Analyze

# Build analysis
npm run build -- --analyze

# Performance budget
# Check bundle size regularly
```

---

## 🔍 Debugging

### Browser DevTools

1. **Open DevTools** - F12 or Ctrl+Shift+I
2. **Sources Tab** - See original TypeScript code (source maps)
3. **Console** - View logs and errors
4. **Network** - Monitor API calls
5. **Performance** - Analyze loading performance

### React DevTools

Install browser extension:
- Chrome: React DevTools
- Firefox: React DevTools

Features:
- Component tree inspection
- Props and state viewing
- Component highlighting
- Performance profiling

### Common Issues

**Blank Page:**
- Check browser console for errors
- Verify backend is running on :3000
- Clear browser cache

**Slow Performance:**
- Check Network tab for slow API calls
- Use Performance tab to find bottlenecks
- Check bundle size

**Styling Issues:**
- Verify Tailwind CSS is loaded
- Check for CSS conflicts
- Use browser inspector

---

## 📦 Dependencies

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3 | UI library |
| react-query | 5.60 | Data fetching |
| tailwindcss | 3.4 | Styling |
| radix-ui | * | Components |
| typescript | 5.6 | Type safety |
| vite | 5.4 | Build tool |

### Development Dependencies

```json
{
  "@types/react": "^18.3.11",
  "@vitejs/plugin-react": "^4.7.0",
  "tailwindcss": "^3.4.17",
  "typescript": "5.6.3"
}
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm install package@latest
```

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Kill process using port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Run type check
npm run check

# Fix types in src/ directory
# Add type annotations where needed
```

### API Connection Error

```bash
# Verify backend is running
# Check terminal where 'npm run dev' was executed

# Verify .env DATABASE_URL is correct
# Check network tab in browser DevTools
```

### Slow Page Load

```bash
# Analyze bundle
npm run build

# Check for large dependencies
npm ls | grep -E "^|-- " | head -20

# Remove unused dependencies
npm prune
```

### Blank White Screen

1. Open DevTools (F12)
2. Check Console tab for red errors
3. Check Network tab - are CSS/JS loading?
4. Hard refresh page (Ctrl+Shift+R)
5. Check if backend is running

---

## 📚 Resources

### Documentation
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [React Query](https://tanstack.com/query/latest/)
- [Vite Guide](https://vitejs.dev/guide/)

### Learning Resources
- **React Patterns** - https://react-patterns.com/
- **TypeScript Deep Dive** - https://basarat.gitbook.io/typescript/
- **Tailwind CSS Tips** - https://tailwindcss.com/docs/responsive-design

---

## 🤝 Contributing

See main [README.md](../README.md#-contributing) for contribution guidelines.

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

---

<div align="center">

**[⬆ Back to top](#-frontend---react-client)**

</div>