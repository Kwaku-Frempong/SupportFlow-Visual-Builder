# SupportFlow — Visual Decision Tree Editor

A Visual Decision Tree Editor for building and testing chatbot conversation flows. Built with React + Vite + Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Features

### Story 1 — Visual Graph
Nodes are rendered as cards positioned absolutely on the canvas using the `x/y` coordinates from `flow_data.json`. SVG bezier curves connect parent nodes to their child nodes based on the `options[].nextId` routing — **drawn entirely from scratch** using `getBoundingClientRect` for live coordinate calculation, with no graph libraries involved.

### Story 2 — Node Editor
Click any node to open the Edit Panel (slides in from the right). You can:
- Edit the question/message text — updates the card in real time
- Edit option labels
- Change where each option routes ("Goes to" dropdown)
- Add or remove options
- Delete a node (removes it and cleans up any references to it)

All changes are immediate — no save button needed.

### Story 3 — Preview Mode
Click **▶ Preview Bot** in the toolbar to enter the chat interface. The bot starts at the `start` node and the conversation unfolds as you click answer buttons. A **Restart** button appears when you reach a leaf node (end of flow).

### Story 4 (Wildcard) — Drag-and-Drop Node Repositioning

**Feature:** Nodes can be dragged and repositioned anywhere on the canvas. SVG connection lines recalculate live as a node moves.

**Why this feature?**

When a support team first maps out their flow it rarely stays that way. As the number of questions and branches grows, the canvas becomes cluttered and hard to reason about. Without drag-and-drop, every layout change requires editing raw JSON coordinates — a task that non-technical managers cannot do themselves.

Drag-and-drop makes the editor **self-sufficient for its intended users**: a support manager can reorganise their flow visually, spot crossing lines, and bring clarity to the diagram — all without engineering help.

**Business value:**
- Reduces friction in the editing workflow
- Allows managers to visually validate the conversation path before going live
- Demonstrates layout ownership (the editor becomes the source of truth, not the JSON file)
- The feature directly reinforces the core value proposition: replacing a spreadsheet with a tool that *shows* you how the conversation flows

**Implementation notes:**
- Uses `mousedown`/`mousemove`/`mouseup` events only — no drag-and-drop libraries
- Drag state is stored in a `useRef` (not `useState`) inside the handler to avoid stale closures on `mousemove`
- A 4px movement threshold distinguishes a drag from a click (click still opens the Edit Panel)
- `svgTrigger` (an integer) is incremented on every `mousemove` tick, causing `SVGLayer` to re-render and re-read `getBoundingClientRect` values, keeping lines in sync with the moving node

### Bonus — Export JSON
The **↓ Export JSON** button in the toolbar downloads the current flow state as `flow_data.json`, preserving all edits including repositioned node coordinates.

## Technical Constraints Met

| Constraint | Approach |
|------------|----------|
| No graph libraries (react-flow, jsPlumb, mermaid) | SVG paths drawn manually using `getBoundingClientRect` coordinate math |
| No component libraries (MUI, Bootstrap) | Pure Tailwind CSS with custom components |
| Line connections | Cubic bezier `<path>` elements on an absolutely-positioned `<svg>` overlay |
| Drag-and-drop | Raw mouse events on the canvas container |

## Project Structure

```
src/
├── hooks/useDecisionTree.js     All state, mutations, drag, preview logic
├── components/
│   ├── Toolbar.jsx
│   ├── EditPanel.jsx
│   ├── Canvas/
│   │   ├── Canvas.jsx           Mouse event delegation, layout container
│   │   ├── NodeCard.jsx         Individual node card (absolute positioned)
│   │   └── SVGLayer.jsx         Bezier connection lines (SVG overlay)
│   └── Preview/
│       ├── PreviewPanel.jsx     Chat interface
│       └── ChatBubble.jsx       Message bubbles
├── utils/
│   ├── pathUtils.js             Bezier path math
│   └── exportUtils.js           JSON download + ID generation
└── data/flow_data.json          Initial flow data
```
