import { useMemo, useState } from "react";
import "./App.css";
import { Timeline } from "./components/Timeline";
import { generateEvents } from "./data/generateEvents";
import { DataGrid } from "./components/DataGrid";
import { eventColumns } from "./data/eventColumns";

const initialEvents = generateEvents(100_000);

const initialTimelineIds = new Set(
  initialEvents.slice(0, 10_000).map((event) => event.id),
);

export default function App() {
  const [events] = useState(initialEvents);
  const [timelineIds] = useState(initialTimelineIds);

  const timelineEvents = useMemo(
    () => events.filter((event) => timelineIds.has(event.id)),
    [events, timelineIds],
  );

  return (
    <div>
      <header className="app-header">
        <span>Event Workspace</span>
        <a
          href="https://github.com/harispasicc/react-event-workspace"
          target="_blank"
          rel="noopener noreferrer"
          className="app-header-link"
        >
          View source
        </a>
      </header>
      <main className="workspace">
        <div className="workspace-intro">
          <div>
            <h1>Operations events</h1>
            <p>Plan, review and track activity across your site.</p>
          </div>
          <button type="button" disabled>
            New event +
          </button>
        </div>

        <div className="workspace__grid">
          <section className="workspace__panel">
            <h2>Event register</h2>
            <DataGrid
              data={events}
              columns={eventColumns}
              getRowId={(event) => event.id}
            />
          </section>
          <section className="workspace__panel">
            <h2>Timeline</h2>
            <Timeline events={timelineEvents} />
          </section>
        </div>
      </main>
    </div>
  );
}
