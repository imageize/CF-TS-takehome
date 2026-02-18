# Data Map - cf-typesctipt-takehome

An interactive browser-based application that visualizes a data map from a static list of system definitions.

## How to Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Building for Production

```bash
npm run build
```

## Testing

```bash
npm run test
```

Untested:
```bash
npm run test:coverage
```

## Time Spent

Approximately 3.5 hours.
Im not including the initial setup of the project in this. (tanstack/tailwind/shad/radix)


## Setup
I installed a tanstack template (React, TS, etc). Removed boilerplate code, added tailwind and shadcn, radixUI etc.
** Did not use ShadC after all - might have been a bit overkill to assume Id need to use it


## Tools

I did use AI (Claude in conjunction with SuperClaude) to assist in the task by spending the first 1/2 hour or so writing detailed instructions in the **[ai-workflow.md](ai-workflow.md)** file. Claude Code was instructed to read and follow the **[overview.md](overview.md)** file for every instruction. After each piece of work done by AI I went through and verified/tweaked or fixed the code. I did reuse files I have written for previous projects such as the **[conventions.md](conventions.md)** and **[tests.md](tests.md)** files as they tend to be pretty solid and cover most kind of projects.


## TODOs

There are a few but not many TODOs listed. Theyre not critical now but they might become problematic if SSR is needed or category structure changes


## Further fixs if time allowed

- Fix the visual of the connecting lines - theyre too bold - collide and obscure cards and arent optimaly positioned
- connecting lines are only on the Systemtype group tab - they were glaringly ugly on the Data use tab
- Figure out a better display on the data use tab. It just looks confusing when the came card is present in multiple rows
- Add cleaner animations

## Tradeoffs
- In the side nav add a picker for other data files
- Give an indicator if there is more content below the fold or to the extemes of the X axis.
- Maybe add more of a draggable canvas sort of interaction & zoom in/out etc.