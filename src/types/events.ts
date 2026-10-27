export type EventStatus = 'scheduled' | 'completed' | 'cancelled';

export type CalendarEvent = {
    id: string;
    title: string;
    startsAt: string;
    location: string;
    status: EventStatus;
}