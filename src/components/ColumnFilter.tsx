import * as Popover from "@radix-ui/react-popover";
import { useId, useState } from "react";
import "./ColumnFilter.css";

type ColumnFilterProps = {
  label: string;
  value: string;
  onApply: (value: string) => void;
  inputType?: "search" | "date";
};

export function ColumnFilter({
  label,
  value,
  onApply,
  inputType = "search",
}: ColumnFilterProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDraft(value);
    }

    setOpen(nextOpen);
  }

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="column-filter-trigger"
          data-active={value.length > 0}
          aria-label={`Filter ${label}${value ? ", active" : ""}`}
        >
          <svg
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
            <path d="M4 4h16l-6 7v7l-4 2v-9L4 4Z" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="column-filter-popover"
          align="start"
          sideOffset={8}
          collisionPadding={12}
          aria-label={`Filter ${label}`}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onApply(draft.trim());
              setOpen(false);
            }}
          >
            <label htmlFor={inputId}>Filter {label}</label>
            <input
              id={inputId}
              type={inputType}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search..."
            />
            <div className="column-filter-actions">
              <Popover.Close asChild>
                <button type="button">Cancel</button>
              </Popover.Close>

              <button type="submit">Filter</button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
