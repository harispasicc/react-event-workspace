import type { Table } from "@tanstack/react-table";
import * as Popover from "@radix-ui/react-popover";
import { HiCheck, HiViewColumns } from "react-icons/hi2";

type ColumnVisibilityProps<T> = {
  table: Table<T>;
};

export function ColumnVisibility<T>({ table }: ColumnVisibilityProps<T>) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="data-grid-columns-trigger"
          aria-label="Display columns"
        >
          <HiViewColumns size={16} aria-hidden="true" />
          <span>Columns</span>
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
          {table
            .getAllLeafColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <label className="data-grid-column-option" key={column.id}>
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  disabled={!column.getCanHide()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                <HiCheck
                  className="data-grid-column-check"
                  size={16}
                  aria-hidden="true"
                />
                <span>
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id}
                </span>
              </label>
            ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
