import type { CalendarEvent } from "../types/events";

type EventGroup = {
  day: string;
  events: CalendarEvent[];
};

export function groupEventsByDay(
  events: readonly CalendarEvent[],
): EventGroup[] {
  const sortedEvents = [...events].sort(
    (a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt),
  );

  const groups = new Map<string, EventGroup>();

  for (const event of sortedEvents) {
    const day = new Date(event.startsAt).toISOString().slice(0, 10);
    const existingGroup = groups.get(day);

    if (existingGroup) {
      existingGroup.events.push(event);
    } else {
      groups.set(day, { day, events: [event] });
    }
  }

  return Array.from(groups.values());
}
