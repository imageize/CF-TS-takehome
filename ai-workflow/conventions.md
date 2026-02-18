
# Naming Conventions and Code Layout
Ciarans general naming convention file. Created for personal projects - tweaked and resued here.

## File Naming
All files shouldl be verbosly named for what they do

- Follow these conventions religiously
-- Components -> PascalCase -> `SystemCard.tsx`, `DataMapFilters.tsx`, `Header.tsx`
-- Routes -> lowercase or `index` -> `index.tsx`, `__root.tsx`
-- Routes (layout) -> `__` prefix -> `__root.tsx`
-- Utils -> camelCase -> `dataMap.ts`
-- Types -> camelCase -> `dataMap.ts`
-- Data -> camelCase -> `sampleData.json`
-- Docs -> lowercase with hyphens -> `types-and-utils.md`, `contact-us.md`


## Component Conventions

### Export style
- Default export for components: `export default function ComponentName`
- Named exports for route config: `export const Route = createFileRoute(...)`

### Props interface
- Props interface named for the ComponentName and Appended with 'Props' 
-- ✔️ ContactUs -> `ContactUsProps`
-- 🛑 ContactUs -X-> `FormProps`
- Use `interface` for props (Personal preference)

```tsx
interface SystemCardProps {
  system: System
}

export default function SystemCard({ system }: SystemCardProps) {
```

### Component layout order
1. Imports (external first, then internal)
2. Type/interface definitions
3. Helper functions or constants (if local to component)
4. Component body
5. Export

### Callback props
- `onSomethingChange` for handlers that update state
-- ✔️ `onFilterChange`
-- 🛑 `changedFilters`


```tsx
onSelectedUsesChange: (uses: string[]) => void
```

## Type Conventions

- Use `type` for object shapes and unions (ES6 style)
- Use `export type` for shared types
- Names: PascalCase for types, camelCase for type params

```ts
export type System = { ... }
export type LayoutMode = 'system_type' | 'data_use'
```

## Function Naming#

- Functions sould be named for what they do
-- ✔️ `updateFilters`, `toggleTheme`, `handleClickOutside`, `isDescExpanded`
-- 🛑 `update`, `toggle`, `clickedOutside`, `expanded`

- Follow this religously
-- Pure utils -> camelCase, verb-first ->  `parseAndDedupeSampleData`, `getUniqueDataCategories`
-- Event handlers -> `handle` prefix -> `handleClickOutside`
-- Toggle/select -> `toggle` or `set` -> `toggle`, `setSelectedUses`
-- Boolean state -> `is` prefix -> `isExpanded`, `isOpen`


## Constants
- `SCREAMING_SNAKE_CASE` for module-level constants
- `camelCase` for local constants

```ts
const SYSTEM_TYPE_COLORS: Record<string, string> = { ... }
const DEFAULT_COLOR = 'border-slate-600 bg-slate-800/50'
```

## State Management

- **useState** for user-driven state (filters, UI toggles)
- **useMemo** for derived values (filtered lists, grouped data)
- Avoid `useState` + `useEffect` for derived data; use `useMemo` instead

## Import Order

1. React / framework imports
2. Third-party (lucide-react, etc.)
3. Types (`import type`)
4. Internal components
5. Utils
6. Data

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import SystemCard from '../components/SystemCard'
import { applyFilters, ... } from '../utils/dataMap'
import type { LayoutMode } from '../types/dataMap'
```

## Styling

- Tailwind CSS (utility classes)
- No inline styles except for dynamic values (e.g. `animationDelay`)
- Template literals for conditional classes: `` className={`base ${condition ? 'a' : 'b'}`} ``

## Keys

- Prefer stable, unique keys over array index
- Use composite keys when needed: `` key={`${groupKey}-${system.fides_key}`} ``

## Comments

- Use `//` for single-line comments
- Brief inline comments for non-obvious logic
- TODO comments for future work: `// TODO - description`
