import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { CalendarEvent } from "../types/events";
import { groupEventsByDay } from "../utils/groupEventsByDay";
import "./Timeline.css";
import { GroupedVirtuoso, type GroupedVirtuosoHandle } from "react-virtuoso";

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
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);
  const eventElements = useRef(new Map<string, HTMLDivElement>());
  const pendingFocusId = useRef<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const groupCounts = useMemo(
    () => groups.map((group) => group.events.length),
    [groups],
  );

  const sortedEvents = useMemo(
    () => groups.flatMap((group) => group.events),
    [groups],
  );

  const groupStartIndexes = useMemo(() => {
    const indexes: number[] = [];
    let startIndex = 0;

    for (const count of groupCounts) {
      indexes.push(startIndex);
      startIndex += count;
    }

    return indexes;
  }, [groupCounts]);

  function handleEventKeyDown(
    e: KeyboardEvent<HTMLDivElement>,
    index: number,
    groupIndex: number,
  ) {
    const groupStart = groupStartIndexes[groupIndex];
    const groupCount = groupCounts[groupIndex];

    if (groupStart === undefined || groupCount === undefined) {
      return;
    }

    const groupEnd = groupStart + groupCount - 1;
    let nextIndex: number;

    switch (e.key) {
      case "ArrowUp":
        nextIndex = Math.max(groupStart, index - 1);
        break;

      case "ArrowDown":
        nextIndex = Math.min(groupEnd, index + 1);
        break;

      case "ArrowLeft":
        nextIndex = groupStartIndexes[groupIndex - 1] ?? index;
        break;

      case "ArrowRight":
        nextIndex = groupStartIndexes[groupIndex + 1] ?? index;
        break;

      default:
        return;
    }

    e.preventDefault();

    if (nextIndex === index) return;

    const nextEvent = sortedEvents[nextIndex];
    if (!nextEvent) return;

    setActiveIndex(nextIndex);

    const element = eventElements.current.get(nextEvent.id);

    if (element) {
      pendingFocusId.current = null;
      element.focus({ preventScroll: true });
    } else {
      pendingFocusId.current = nextEvent.id;
    }

    virtuosoRef.current?.scrollToIndex({
      index: nextIndex,
      align: "center",
      behavior: "auto",
    });
  }

  if (groups.length === 0) {
    return <p>No events to display</p>;
  }

  return (
    <div>
      <p className="timeline-timezone">All times in UTC</p>
      <GroupedVirtuoso
        ref={virtuosoRef}
        style={{ height: 500 }}
        groupCounts={groupCounts}
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
        itemContent={(index, groupIndex) => {
          const event = sortedEvents[index];

          if (!event) return null;
          return (
            <div
              className="timeline-event"
              data-event-id={event.id}
              ref={(element) => {
                if (element) {
                  eventElements.current.set(event.id, element);

                  if (pendingFocusId.current == event.id) {
                    pendingFocusId.current = null;
                    element.focus({ preventScroll: true });
                    element.scrollIntoView({
                      block: "nearest",
                      inline: "nearest",
                      behavior: "auto",
                    });
                  }
                } else {
                  eventElements.current.delete(event.id);
                }
              }}
              tabIndex={index === activeIndex ? 0 : -1}
              onFocus={() => {
                setActiveIndex(index);
              }}
              onKeyDown={(e) => handleEventKeyDown(e, index, groupIndex)}
            >
              <time dateTime={event.startsAt}>
                {timeFormatter.format(new Date(event.startsAt))}
              </time>

              <div>
                <p className="timeline-event-title">{event.title}</p>
                <p className="timeline-event-location">{event.location}</p>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
