# SystemCard Component

Create `src/components/SystemCard.tsx`.

## What it shows

- System name (prominent)
- Data categories (short names only, deduplicated)
- System type badge
- "Depends on" badges for system_dependencies
- Expandable description (collapsible drawer)

## Styling

- Color accent per system type:
  - Application → cyan
  - Service → amber
  - Database → emerald
  - Integration → violet

## Expandable description

- Use CSS grid transition: `grid-rows-[0fr]` when collapsed, `grid-rows-[1fr]` when expanded
- Chevron icon (up/down) to toggle
- Smooth transition on expand/collapse
