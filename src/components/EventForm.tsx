import { useId, useRef, useState, type FormEvent } from "react";
import type { CalendarEvent, EventStatus } from "../types/events";
import "./EventForm.css";
import { HiChevronDown } from "react-icons/hi2";

type EventFormValues = Omit<CalendarEvent, "id">;

type EventFormProps = {
  event?: CalendarEvent;
  onSave: (values: EventFormValues) => void;
  onCancel: () => void;
};

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const formId = useId();

  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(event?.title ?? "");
  const [startsAt, setStartsAt] = useState(
    event ? new Date(event.startsAt).toISOString().slice(0, 16) : "",
  );
  const [location, setLocation] = useState(event?.location ?? "");
  const [status, setStatus] = useState<EventStatus>(
    event?.status ?? "scheduled",
  );

  const [errors, setErrors] = useState<{
    title?: string;
    startsAt?: string;
  }>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: {
      title?: string;
      startsAt?: string;
    } = {};

    if (!title.trim()) {
      nextErrors.title = "Enter an event title.";
    }

    const timestamp = startsAt ? Date.parse(`${startsAt}Z`) : NaN;

    if (!Number.isFinite(timestamp)) {
      nextErrors.startsAt = "Enter a valid date and time.";
    }

    setErrors(nextErrors);

    if (nextErrors.title) {
      titleRef.current?.focus();
      return;
    }

    if (nextErrors.startsAt) {
      dateRef.current?.focus();
      return;
    }

    onSave({
      title: title.trim(),
      startsAt: new Date(timestamp).toISOString(),
      location: location.trim(),
      status,
    });
  }

  return (
    <form className="event-form" onSubmit={handleSubmit} noValidate>
      <div className="event-form-field">
        <label htmlFor={`${formId}-title`}>Title (required)</label>

        <input
          ref={titleRef}
          id={`${formId}-title`}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? `${formId}-title-error` : undefined}
        />

        {errors.title && (
          <p id={`${formId}-title-error`} className="event-form-error">
            {errors.title}
          </p>
        )}
      </div>

      <div className="event-form-field">
        <label htmlFor={`${formId}-date`}>Date and time (UTC, required)</label>

        <input
          ref={dateRef}
          id={`${formId}-date`}
          type="datetime-local"
          value={startsAt}
          onChange={(event) => setStartsAt(event.target.value)}
          required
          aria-invalid={Boolean(errors.startsAt)}
          aria-describedby={
            errors.startsAt ? `${formId}-date-error` : undefined
          }
        />

        {errors.startsAt && (
          <p id={`${formId}-date-error`} className="event-form-error">
            {errors.startsAt}
          </p>
        )}
      </div>

      <div className="event-form-field">
        <label htmlFor={`${formId}-location`}>Location</label>

        <input
          id={`${formId}-location`}
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
      </div>

      <div className="event-form-field">
        <label htmlFor={`${formId}-status`}>Status</label>
        <div className="event-form-select">
          <select
            id={`${formId}-status`}
            value={status}
            onChange={(event) => {
              const value = event.target.value;

              if (
                value === "scheduled" ||
                value === "completed" ||
                value === "cancelled"
              ) {
                setStatus(value);
              }
            }}
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <HiChevronDown
            className="event-form-select-icon"
            size={16}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="event-form-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit">Save event</button>
      </div>
    </form>
  );
}
