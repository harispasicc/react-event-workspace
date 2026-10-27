import type { CalendarEvent, EventStatus } from "../types/events";

const titles = [
  "Site inspection",
  "Camera maintenance",
  "Access review",
] as const;

const locations = ["Vienna HQ", "Lobby", "North entrance"] as const;

const statuses: EventStatus[] = [
    'scheduled',
    'completed',
    'cancelled',
  ];

const startTime = Date.parse('2026-10-01T08:00:00Z');
const intervalMs = 15 * 60 * 1000;

export function generateEvents(count: number): CalendarEvent[] {

    if(!Number.isInteger(count) || count < 0) {
        throw new Error('Event count must be a non-negative integer');
    }

    return Array.from({length: count}, (_, index) =>({
        id:`event-${index + 1}`,
        title: titles[index % titles.length]!,
        startsAt: new Date(startTime + index * intervalMs).toISOString(),
        location: locations[index % locations.length]!,
        status: statuses[index % statuses.length]!,
    })) 
}