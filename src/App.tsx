import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Timeline } from "./components/Timeline";
import { generateEvents } from "./data/generateEvents";
import { DataGrid } from "./components/DataGrid";
import { eventColumns } from "./data/eventColumns";
import { EventForm } from "./components/EventForm";
import type { CalendarEvent } from "./types/events";
import * as Dialog from "@radix-ui/react-dialog";
import type { ColumnDef } from "@tanstack/react-table";
import { HiPencil } from "react-icons/hi2";
import { SiGithub } from "react-icons/si";

const initialEvents = generateEvents(100_000);

const initialTimelineIds = new Set(
  initialEvents.slice(0, 10_000).map((event) => event.id),
);

export default function App() {
  const [events, setEvents] = useState(initialEvents);
  const [timelineIds, setTimelineIds] = useState(initialTimelineIds);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const addButtonRef = useRef<HTMLButtonElement>(null);
  const editButtonRef = useRef<HTMLButtonElement | null>(null);

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

  function handleSaveEvent(values: Omit<CalendarEvent, "id">) {
    if (editingEvent) {
      const hasChanges =
        values.title !== editingEvent.title ||
        values.startsAt !== editingEvent.startsAt ||
        values.location !== editingEvent.location ||
        values.status !== editingEvent.status;

      if (!hasChanges) {
        setIsFormOpen(false);
        return;
      }

      const updatedEvent: CalendarEvent = {
        ...values,
        id: editingEvent.id,
      };

      setEvents((previous) =>
        previous.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        ),
      );

      setSuccessMessage(`Event "${updatedEvent.title}" updated successfully.`);
    } else {
      const newEvent: CalendarEvent = {
        ...values,
        id: crypto.randomUUID(),
      };

      setEvents((previous) => [newEvent, ...previous]);

      setTimelineIds((previous) => {
        const next = new Set(previous);
        next.add(newEvent.id);
        return next;
      });

      setSuccessMessage(`Event "${newEvent.title}" created successfully.`);
    }

    setIsFormOpen(false);
  }

  const columns = useMemo<ColumnDef<CalendarEvent>[]>(
    () => [
      ...eventColumns,
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
        cell: ({ row }) => (
          <button
            type="button"
            className="event-edit-button"
            aria-label={`Edit ${row.original.title}, ${row.original.id}`}
            onClick={(event) => {
              editButtonRef.current = event.currentTarget;
              setEditingEvent(row.original);
              setSuccessMessage("");
              setIsFormOpen(true);
            }}
            title="Edit event"
          >
            <HiPencil size={16} aria-hidden="true" />
          </button>
        ),
      },
    ],
    [],
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
          <SiGithub size={18} aria-hidden="true" />
          <span>View source</span>
        </a>
      </header>
      <main className="workspace">
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
                setIsFormOpen(open);

                if (open) {
                  setSuccessMessage("");
                }
              }}
            >
              <DataGrid
                data={events}
                columns={columns}
                getRowId={(event) => event.id}
                title="Event register"
                actions={
                  <Dialog.Trigger asChild>
                    <button
                      type="button"
                      ref={addButtonRef}
                      className="new-event-button"
                      onClick={() => {
                        editButtonRef.current = null;
                        setEditingEvent(null);
                      }}
                    >
                      <span aria-hidden="true">+</span>
                      ADD EVENT
                    </button>
                  </Dialog.Trigger>
                }
              />

              <Dialog.Portal>
                <Dialog.Overlay className="event-dialog-overlay" />

                <Dialog.Content
                  className="event-dialog-content"
                  onCloseAutoFocus={(event) => {
                    event.preventDefault();

                    const editButton = editButtonRef.current;

                    if (editButton?.isConnected) {
                      editButton.focus();
                    } else {
                      addButtonRef.current?.focus();
                    }
                  }}
                >
                  <Dialog.Title className="event-dialog-title">
                    {editingEvent ? "Edit event" : "New event"}
                  </Dialog.Title>

                  <Dialog.Description className="event-dialog-description">
                    Enter the event details. All times are in UTC.
                  </Dialog.Description>

                  <EventForm
                    key={editingEvent?.id ?? "new"}
                    event={editingEvent ?? undefined}
                    onSave={handleSaveEvent}
                    onCancel={() => setIsFormOpen(false)}
                  />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </section>
          <section className="workspace__panel">
            <h2>
              Timeline
              <span className="workspace-count">
                {timelineEvents.length.toLocaleString("en-GB")} events
              </span>
            </h2>
            <Timeline events={timelineEvents} />
          </section>
        </div>
      </main>
    </div>
  );
}
