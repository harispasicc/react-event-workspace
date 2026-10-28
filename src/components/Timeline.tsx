import { useMemo } from "react";
import type { CalendarEvent } from "../types/events";
import { groupEventsByDay } from "../utils/groupEventsByDay";
import "./Timeline.css";
import { GroupedVirtuoso } from "react-virtuoso";

type TimelineProps = {
  events: readonly CalendarEvent[];
};

const dayFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "full",
  timeZone: "UTC",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
});

export function Timeline({ events }: TimelineProps) {
  const groups = useMemo(() => groupEventsByDay(events), [events]);

  const groupCounts = useMemo(
    () => groups.map((group) => group.events.length),
    [groups],
  );

  const sortedEvents = useMemo(
    () => groups.flatMap((group) => group.events),
    [groups],
  );

  if (groups.length === 0) {
    return <p>No events to display</p>;
  }

  return (
    <div>
      <p className="timeline-timezone">All times in UTC</p>
      <GroupedVirtuoso
        style={{ height: 500 }}
        data={sortedEvents}
        groupCounts={groupCounts}
        computeItemKey={(index, event) => event?.id ?? `group-${index}`}
        groupContent={(groupIndex) => {
          const group = groups[groupIndex];

          if (!group) return null;

          return (
            <h3 className="timeline-day">
              <time dateTime={group.day}>
                {dayFormatter.format(new Date(`${group.day}T00:00:00Z`))}
              </time>
            </h3>
          );
        }}
        itemContent={(_, _groupIndex, event) => (
          <div className="timeline-event">
            <time dateTime={event.startsAt}>
              {timeFormatter.format(new Date(event.startsAt))}
            </time>
            <div>
              <p className="timeline-event-title">{event.title}</p>
              <p className="timeline-event-location">{event.location}</p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
