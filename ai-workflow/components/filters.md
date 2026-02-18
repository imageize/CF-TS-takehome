# Filter Controls

Create `src/components/DataMapFilters.tsx`.

## Filters

1. **Data Use** – Multi-select. Systems must have at least one privacy declaration matching a selected use.
2. **Data Categories** – Multi-select. Systems must process at least one of the selected categories (OR logic).
3. **Clear filters** – Resets both filters.

## Layout toggle

- Two options: "Group by System Type" | "Group by Data Use"
- Wired to `groupSystems()` layout mode
- Toggle buttons, one active at a time
