import "./App.css";
import { TimeLine } from "./components/Timeline";
import { generateEvents } from "./data/generateEvents";

const sampleEvents = generateEvents(70);

export default function App() {
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
          </section>

          <section className="workspace__panel">
            <h2>Timeline</h2>
            <TimeLine events={sampleEvents} />
          </section>
        </div>
      </main>
    </div>
  );
}
