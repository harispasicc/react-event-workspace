import "@tanstack/react-table";
import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // Generic parameters must match TanStack's declaration.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterInputType?: "search" | "date";
  }
}