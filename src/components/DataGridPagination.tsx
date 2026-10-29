import type { Table } from "@tanstack/react-table";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";

type DataGridPaginationProps<T> = {
  table: Table<T>;
};

export function DataGridPagination<T>({ table }: DataGridPaginationProps<T>) {
  return (
    <nav className="data-grid-pagination" aria-label="Table pagination">
      <button
        type="button"
        aria-label="First page"
        title="First page"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <HiChevronDoubleLeft size={16} aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label="Previous page"
        title="Previous page"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <HiChevronLeft size={16} aria-hidden="true" />
      </button>

      <span>
        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </span>

      <button
        type="button"
        aria-label="Next page"
        title="Next page"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <HiChevronRight size={16} aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label="Last page"
        title="Last page"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <HiChevronDoubleRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
