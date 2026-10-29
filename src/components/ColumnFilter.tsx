import * as Popover from "@radix-ui/react-popover";
import { useId, useState } from "react";
import "./ColumnFilter.css";
import { HiFunnel } from "react-icons/hi2";

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
          <HiFunnel size={16} aria-hidden="true" />
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
