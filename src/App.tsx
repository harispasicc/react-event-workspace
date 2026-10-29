import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Timeline } from "./components/Timeline";
import { generateEvents } from "./data/generateEvents";
import { DataGrid } from "./components/DataGrid";
import { eventColumns } from "./data/eventColumns";
import { EventForm } from "./components/EventForm";
import type { CalendarEvent } from "./types/events";
import * as Dialog from "@radix-ui/react-dialog";

const initialEvents = generateEvents(100_000);

const initialTimelineIds = new Set(
  initialEvents.slice(0, 10_000).map((event) => event.id),
);

export default function App() {
  const [events, setEvents] = useState(initialEvents);
  const [timelineIds, setTimelineIds] = useState(initialTimelineIds);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage("");
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const timelineEvents = useMemo(
    () => events.filter((event) => timelineIds.has(event.id)),
    [events, timelineIds],
  );

  function handleCreateEvent(values: Omit<CalendarEvent, "id">) {
    const newEvent: CalendarEvent = {
      ...values,
      id: crypto.randomUUID(),
    };

    console.log("Created event:", newEvent);

    setEvents((previous) => [newEvent, ...previous]);

    setTimelineIds((previous) => {
      const next = new Set(previous);
      next.add(newEvent.id);
      return next;
    });

    setIsFormOpen(false);
    setSuccessMessage(`Event "${newEvent.title}" created successfully.`);
  }
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
        </div>

        <div
          className={`workspace-success${successMessage ? " is-visible" : ""}`}
          role="status"
          aria-atomic="true"
        >
          {successMessage}
        </div>

        <div className="workspace__grid">
          <section className="workspace__panel">
            <Dialog.Root
              open={isFormOpen}
              onOpenChange={(open) => {
                console.log("Dialog open:", open);
                setIsFormOpen(open);

                if (open) {
                  setSuccessMessage("");
                }
              }}
            >
              <DataGrid
                data={events}
                columns={eventColumns}
                getRowId={(event) => event.id}
                title="Event register"
                actions={
                  <Dialog.Trigger asChild>
                    <button type="button" className="new-event-button">
                      <span aria-hidden="true">+</span>
                      ADD EVENT
                    </button>
                  </Dialog.Trigger>
                }
              />

              <Dialog.Portal>
                <Dialog.Overlay className="event-dialog-overlay" />

                <Dialog.Content className="event-dialog-content">
                  <Dialog.Title className="event-dialog-title">
                    New event
                  </Dialog.Title>

                  <Dialog.Description className="event-dialog-description">
                    Add an event to the register and timeline. All times are in
                    UTC.
                  </Dialog.Description>

                  <EventForm
                    onSave={handleCreateEvent}
                    onCancel={() => setIsFormOpen(false)}
                  />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
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
