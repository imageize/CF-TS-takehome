# Animations and Hover Enhancements

## Card hover

When a user hovers over a SystemCard:

- **Scale** – Card expands slightly (e.g. `scale-[1.02]` or `scale-[1.03]`)
- **Glowing border** – Border gains a soft glow using the card’s system-type color (teal, amber, purple, etc.)
- Use CSS `transition` for smooth animation (e.g. 200–300ms ease)

## Connection lines on hover

When a user hovers over a card, the connector lines between that card and related cards (those sharing data categories) transition in:

- Lines are faded or hidden by default
- On hover, only the connections for the hovered card become visible
- Use opacity and/or stroke-width transitions for a smooth reveal
- Lines should animate in over ~200–300ms

- Other cards that do not have a connection to the hovered card are faded to a opacity of 20%


## Implementation notes

- Card hover: Tailwind `hover:scale-*`, `hover:shadow-*`, and a `transition` class on the card
- Glow: `hover:shadow-cyan-500/30` (or the card’s accent color) with `hover:border-cyan-500/80`
- Connections: Requires `DependencyConnectors` (or equivalent) to receive a `hoveredCardId` prop and render lines with opacity based on whether they involve the hovered card
