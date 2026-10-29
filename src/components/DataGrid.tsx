import type { ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { ColumnFilter } from "./ColumnFilter";
import * as Popover from "@radix-ui/react-popover";
import "./DataGrid.css";

type DataGridProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string;
  title: string;
  isLoading?: boolean;
  error?: string;
  actions?: ReactNode;
};

export function DataGrid<T>({
  data,
  columns,
  getRowId,
  title,
  isLoading = false,
  error,
  actions,
}: DataGridProps<T>) {
  "use no memo";
  // TanStack Table v8 is incompatible with compiler memoization.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    enableMultiSort: false,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      sorting: [{ id: "id", desc: false }],
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
    },
  });

  const rows = table.getRowModel().rows;

  const emptyMessage =
    data.length === 0
      ? "No events to display"
      : "No events match your filters.";

  return (
    <div>
      <div className="data-grid-toolbar">
        <h2>{title}</h2>
        <div className="data-grid-toolbar-actions">
          {actions}
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                className="data-grid-columns-trigger"
                aria-label="Display columns"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="5" height="16" rx="1" />
                  <rect x="9.5" y="4" width="5" height="16" rx="1" />
                  <rect x="16" y="4" width="5" height="16" rx="1" />
                </svg>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="data-grid-columns-popover"
                align="end"
                sideOffset={8}
                collisionPadding={12}
                aria-label="Display columns"
              >
                <p className="data-grid-columns-title">Display columns</p>

                {table.getAllLeafColumns().map((column) => (
                  <label className="data-grid-column-option" key={column.id}>
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      disabled={!column.getCanHide()}
                      onChange={column.getToggleVisibilityHandler()}
                    />
                    <svg
                      className="data-grid-column-check"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                    <span>
                      {" "}
                      {typeof column.columnDef.header === "string"
                        ? column.columnDef.header
                        : column.id}
                    </span>
                  </label>
                ))}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>

      {table.getState().columnFilters.length > 0 && (
        <div className="data-grid-filters">
          {table.getState().columnFilters.map((filter) => {
            const column = table.getColumn(filter.id);
            if (!column) return null;

            const label =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : filter.id;

            return (
              <span className="data-grid-filter-tag" key={filter.id}>
                {label} : {String(filter.value)}
                <button
                  type="button"
                  aria-label={`Remove ${label} filter`}
                  onClick={() => column.setFilterValue(undefined)}
                >
                  <span aria-hidden="true">x</span>
                </button>
              </span>
            );
          })}
          <button
            type="button"
            className="data-grid-clear-filters"
            onClick={() => table.resetColumnFilters(true)}
          >
            Clear filters
          </button>
        </div>
      )}
      <div className="data-grid-scroll">
        <table className="data-grid-table" aria-busy={isLoading}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : undefined
                    }
                  >
                    <div className="data-grid-column-header">
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          className="data-grid-sort"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          <span aria-hidden="true">
                            {header.column.getIsSorted() === "asc"
                              ? "↑"
                              : header.column.getIsSorted() === "desc"
                                ? " ↓"
                                : ""}
                          </span>
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                      {header.column.getCanFilter() && (
                        <ColumnFilter
                          label={
                            typeof header.column.columnDef.header === "string"
                              ? header.column.columnDef.header
                              : header.column.id
                          }
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
                          onApply={(value) =>
                            header.column.setFilterValue(value)
                          }
                          inputType={
                            header.column.columnDef.meta?.filterInputType ??
                            "search"
                          }
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  className="data-grid-state"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  <p role="status">Loading events…</p>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  className="data-grid-state"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  <p role="alert">{error}</p>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  className="data-grid-state"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  <p role="status">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && !error && rows.length > 0 && (
        <div className="data-grid-pagination">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>

          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(1, table.getPageCount())}
          </span>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
