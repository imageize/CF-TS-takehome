# Connection Lines Between Cards

Draw SVG lines between cards when the user hovers over one, showing which cards share data categories with it.

## Relationship rule

Two cards are related when they process **at least one shared data category**.

- Use `getUniqueDataCategories(system)` from `utils/dataMap` to get each card’s categories (short names: `cookie_id`, `email`, `location`, etc.)
- A line is drawn between card A and card B if their category sets overlap
- Same logic as the existing filter: categories are flattened and deduplicated across all privacy declarations

## When lines are visible

- **Default** – No lines visible (or very faint, e.g. opacity 0.05)
- **On hover** – When the user hovers over a card, only the lines connected to that card are shown
- Lines run from the hovered card to each related card
- Non-related cards can be faded (e.g. opacity 50%) to emphasize the connections

## Which lines to draw

When card X (`fides_key`) is hovered:

1. Compute `categoriesX = getUniqueDataCategories(systemX)`
2. For each other card Y in the current filtered list:
   - Compute `categoriesY = getUniqueDataCategories(systemY)`
   - If any category in `categoriesX` is in `categoriesY`, draw a line from X to Y
3. Each pair is drawn once (no duplicate A↔B and B↔A lines)

## Implementation

### Component: `CategoryConnectors` (or `DependencyConnectors`)

- Renders an SVG overlay on top of the card grid
- Props: `systems`, `hoveredCardId`, `containerRef`
- Uses `useLayoutEffect` to measure card positions via `getBoundingClientRect`
- Each card must be wrapped in a div with `data-fides-key={system.fides_key}` so positions can be queried

### Positioning

- Container has `position: relative`; SVG has `position: absolute; inset: 0`
- Convert card positions to container-relative coordinates:
  - `x = rect.left - containerRect.left + rect.width / 2`
  - `y = rect.bottom - containerRect.top` (line from bottom of source)
  - `toY = rect.top - containerRect.top` (line to top of target)
- Use Bézier curves for lines (e.g. control point at midpoint between cards)

### Line styling

- Stroke: dashed or solid, colour matches theme (e.g. cyan)
- Default: opacity ~0.05 when no hover, or hidden
- Active (on hover): opacity ~0.7, stroke width 2
- Transition: `transition: opacity 0.2s ease` on the path elements

### State flow

1. Parent (e.g. index page) holds `hoveredCardId: string | null`
2. Each card wrapper has `onMouseEnter` / `onMouseLeave` to set `hoveredCardId`
3. `CategoryConnectors` receives `hoveredCardId` and only renders/dims lines based on it

### Deduplication

- Avoid duplicate connections: if A and B share categories, draw one line A→B (or B→A), not two
- Use a key like `${min(a,b)}-${max(a,b)}` when building the connection list
