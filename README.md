# Event Workspace

A small React and TypeScript app with a reusable DataGrid, Timeline and Add/Edit Event form.

[Live app](https://react-event-workspace.vercel.app)

## Run locally

Built using Node.js 22.15.

```bash
npm ci
npm run dev
```

```bash
npm run lint     # ESLint
npm run build    # TypeScript check and production build
npm run preview  # Serve the build locally
```

## Components

**DataGrid** uses TanStack Table for client-side sorting, column filters, visibility and pagination. It displays 15 rows per page and supports loading, error and empty states.

**Timeline** groups events by day and uses React Virtuoso to avoid rendering the full list. Click **Focus timeline**, then use Up/Down to move within a day and Left/Right to change days. A live region announces the focused event.

**EventForm** handles both adding and editing. Title and date/time are required. Invalid submissions show errors and focus the first invalid field. Cancel discards changes, and saving an edit keeps the original ID.

## Data and implementation

The app generates 100,000 mock events. The first 10,000 are included in the timeline. New events are added to both views.

Event data lives in `App`, and the timeline uses a subset of the same records. Editing a record updates both views if it belongs to the timeline.

I used UTC for date input, display and grouping so events stay in the same day regardless of the browser's timezone.

TanStack Table handles table state, while the table markup and controls are custom. React Virtuoso handles timeline virtualization. Radix UI provides the dialog and popovers.

The table starts sorted by ID. New events follow the current sorting and filters, so they may not appear on the current page.

## Checks and limitations

Manually checked Add/Edit, validation, filters, pagination, keyboard navigation, focus restoration and responsive layouts. Timeline announcements were also checked with macOS VoiceOver.

GitHub Actions runs `npm ci`, lint and build on pull requests to `main` and pushes to `main`.

Data is stored in memory and resets on refresh. Loading and error states are available through DataGrid props. The app does not make API requests. Filtering and sorting run over the dataset in the browser.
