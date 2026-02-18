# Test Conventions

This project uses Vitest with React Testing Library and jsdom. Run tests with `npm run test`.

## File Naming

- Test files sit next to the source: `ComponentName.test.tsx` or `utilsName.test.ts`
- Or in a `__tests__` folder mirroring `src`: `__tests__/utils/dataMap.test.ts`

```text
src/
├── components/
│   ├── ComponentName.tsx
│   └── ComponentName.test.tsx
├── utils/
│   ├── utilsName.ts
│   └── utilsName.test.ts
```

## What to Test

- **Utils** – Pure functions. Fast, no React.
- **Components** – Rendering, user interactions, accessibility.
- **Integration** – Critical flows (e.g. filter + display).

## Utils

- Use `describe` for the module, `it` or `test` for each case
- Name tests by behaviour: `it('deduplicates systems by fides_key')`
- Prefer small, focused tests over large ones

```ts
import { describe, it, expect } from 'vitest'
import { parseAndDedupeSampleData, extractShortCategory } from './dataMap'

describe('parseAndDedupeSampleData', () => {
  it('deduplicates systems by fides_key', () => {
    const result = parseAndDedupeSampleData()
    const keys = result.map((s) => s.fides_key)
    expect(keys).toHaveLength(new Set(keys).size)
  })
})

describe('extractShortCategory', () => {
  it('returns the last segment of a dotted path', () => {
    expect(extractShortCategory('user.derived.identifiable.location')).toBe('location')
  })
})
```

## Components

- Use `@testing-library/react` for rendering and queries
- Prefer `getByRole`, `getByLabelText`, `getByText` over `getByTestId`
- Use `userEvent` for interactions when available

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SomeComponent from './SomeComponent'

describe('SomeComponent', () => {
  it('renders system name', () => {
    render(<SomeComponent system={mockThing} />)
    expect(screen.getByText(mockThing.name)).toBeInTheDocument()
  })

  it('expands description when Show description is clicked', async () => {
    const user = userEvent.setup()
    render(<SomeComponent system={mockThing} />)
    await user.click(screen.getByRole('button', { name: /show description/i }))
    expect(screen.getByText(mockThing.description)).toBeVisible()
  })
})
```

## Naming

- `describe` – module or component name
- `it` / `test` – behaviour in plain language
- ✔️ `it('filters systems when data use is selected')`
- 🛑 `it('works')`, `it('test1')`

## Structure

1. Arrange – set up data and render
2. Act – perform the action (click, type)
3. Assert – check the outcome

## Mocking

- Mock external deps (fetch, router) when needed
- Use minimal fixtures for components
- Prefer real implementations for utils
