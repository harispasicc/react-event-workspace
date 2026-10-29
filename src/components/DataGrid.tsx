import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import "./DataGrid.css";
import { ColumnFilter } from "./ColumnFilter";

type DataGridProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string;
};

export function DataGrid<T>({ data, columns, getRowId }: DataGridProps<T>) {
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

  return (
    <div>
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
        <table className="data-grid-table">
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
                            header.column.id === "startsAt" ? "date" : "search"
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
}
