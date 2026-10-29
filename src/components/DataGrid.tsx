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
import "./DataGrid.css";
import { HiArrowDown, HiArrowUp } from "react-icons/hi2";
import { ColumnVisibility } from "./ColumnVisibility";
import { DataGridPagination } from "./DataGridPagination";

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
        pageSize: 15,
      },
    },
  });

  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const hasFilters = table.getState().columnFilters.length > 0;

  const emptyMessage =
    data.length === 0
      ? "No events to display"
      : "No events match your filters.";

  return (
    <div>
      <div className="data-grid-toolbar">
        <div className="data-grid-heading">
          <h2>{title}</h2>

          <span className="data-grid-count">
            {hasFilters ? `${filteredCount.toLocaleString("en-GB")} of ` : ""}
            {data.length.toLocaleString("en-GB")} events
          </span>
        </div>
        <div className="data-grid-toolbar-actions">
          {actions}
          <ColumnVisibility table={table} />
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

                          {header.column.getIsSorted() === "asc" ? (
                            <HiArrowUp size={16} aria-hidden="true" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <HiArrowDown size={16} aria-hidden="true" />
                          ) : null}
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
        <DataGridPagination table={table} />
      )}
    </div>
  );
}
