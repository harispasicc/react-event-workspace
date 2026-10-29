import type { ColumnDef } from "@tanstack/react-table";
import type { CalendarEvent } from "../types/events";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC"
});

export const eventColumns: ColumnDef<CalendarEvent>[] = [
{
    accessorKey: "id",
    header: "ID",
},
{
    accessorKey: "title",
    header: "Title",
},
{
    accessorKey: "startsAt",
    header: "Date (UTC)",
    cell: ({row}) => dateFormatter.format(new Date(row.original.startsAt))
},
{
    accessorKey: "location",
    header: "Location",
},
{
    accessorKey: "status",
    header: "Status",
},
]