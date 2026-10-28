import type { CalendarEvent } from "../types/events";
import { groupEventsByDay } from "../utils/groupEventsByDay";
import "./Timeline.css";

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

export function TimeLine({ events }: TimelineProps) {
  const groups = groupEventsByDay(events);

  if (groupEventsByDay.length === 0) {
    return <p>No events to display</p>;
  }

  return (
    <div className="timeline">
      <p className="timeline-timezone">All times in UTC</p>
      {groups.map((group) => (
        <section className="timeline-group" key={group.day}>
          <h3>
            <time dateTime={group.day}>
              {dayFormatter.format(new Date(`${group.day}T00:00:00Z`))}
            </time>
          </h3>
          <ul className="timeline-events">
            {group.events.map((event) => (
              <li className="timeline-event" key={event.id}>
                <time dateTime={event.startsAt}>
                  {timeFormatter.format(new Date(event.startsAt))}
                </time>

                <div>
                  <p className="timeline-event-title">{event.title}</p>
                  <p className="timeline-event-location">{event.location}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
