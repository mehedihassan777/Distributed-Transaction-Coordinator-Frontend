/**
 * DataTable component test suite.
 *
 * Strategy: test user-visible behaviour — what the user sees and interacts with —
 * rather than implementation details. All API interactions are mocked at the
 * fetch boundary so the component renders in isolation.
 */
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { DataTable, type ColumnDef } from "@/components/data-table/DataTable";
import type { SortConfig } from "@/hooks/useDataTable";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface Row {
  id: string;
  name: string;
  status: string;
  [key: string]: unknown;
}

const COLUMNS: ColumnDef<Row>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "name", header: "Name", sortable: true },
  { key: "status", header: "Status", sortable: false },
];

function makeRows(count: number): Row[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `row-${i + 1}`,
    name: `Item ${i + 1}`,
    status: i % 2 === 0 ? "active" : "inactive",
  }));
}

const defaultProps = {
  columns: COLUMNS,
  data: makeRows(5),
  total: 5,
  page: 1,
  pageSize: 10,
  search: "",
  sort: null as SortConfig | null,
  isLoading: false,
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onSearchChange: jest.fn(),
  onSortChange: jest.fn(),
};

function renderTable(overrides: Partial<typeof defaultProps> = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<DataTable<Row> {...props} />);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DataTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Row rendering", () => {
    it("renders the correct number of data rows", () => {
      renderTable({ data: makeRows(7), total: 7 });
      // 7 data rows (tbody tr's), not counting the header
      const rows = screen.getAllByRole("row");
      // +1 for the header row
      expect(rows).toHaveLength(8);
    });

    it("renders cell values for each row", () => {
      renderTable({ data: makeRows(3), total: 3 });
      expect(screen.getByText("row-1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("row-3")).toBeInTheDocument();
    });

    it("renders column headers", () => {
      renderTable();
      expect(screen.getByRole("columnheader", { name: /id/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /name/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /status/i })).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("shows 'No results found' when data array is empty", () => {
      renderTable({ data: [], total: 0 });
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });

    it("does not render data rows when data is empty", () => {
      renderTable({ data: [], total: 0 });
      // Only the header row should be present
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2); // header + empty-state row
    });

    it("shows 'No records' in the pagination summary when total is 0", () => {
      renderTable({ data: [], total: 0 });
      expect(screen.getByText(/no records/i)).toBeInTheDocument();
    });
  });

  describe("Loading state", () => {
    it("renders a loading spinner when isLoading is true", () => {
      renderTable({ isLoading: true });
      expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
    });

    it("hides data rows while loading", () => {
      renderTable({ isLoading: true, data: makeRows(5) });
      expect(screen.queryByText("row-1")).not.toBeInTheDocument();
    });
  });

  describe("Search", () => {
    it("renders a search input", () => {
      renderTable();
      expect(screen.getByRole("searchbox", { name: /search/i })).toBeInTheDocument();
    });

    it("calls onSearchChange when the user types into the search input", () => {
      const onSearchChange = jest.fn();
      renderTable({ onSearchChange });
      const input = screen.getByRole("searchbox", { name: /search/i });
      fireEvent.change(input, { target: { value: "hello" } });
      expect(onSearchChange).toHaveBeenCalledTimes(1);
      expect(onSearchChange).toHaveBeenCalledWith("hello");
    });

    it("displays the current search value", () => {
      renderTable({ search: "test value" });
      const input = screen.getByRole("searchbox") as HTMLInputElement;
      expect(input.value).toBe("test value");
    });
  });

  describe("Sorting", () => {
    it("calls onSortChange when a sortable column header is clicked", () => {
      const onSortChange = jest.fn();
      renderTable({ onSortChange });
      fireEvent.click(screen.getByRole("columnheader", { name: /id/i }));
      expect(onSortChange).toHaveBeenCalledWith("id");
    });

    it("does not call onSortChange when a non-sortable column header is clicked", () => {
      const onSortChange = jest.fn();
      renderTable({ onSortChange });
      fireEvent.click(screen.getByRole("columnheader", { name: /status/i }));
      expect(onSortChange).not.toHaveBeenCalled();
    });

    it("sets aria-sort='ascending' on the active sort column", () => {
      renderTable({ sort: { column: "name", direction: "asc" } });
      const nameHeader = screen.getByRole("columnheader", { name: /name/i });
      expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    });

    it("sets aria-sort='descending' on the active sort column", () => {
      renderTable({ sort: { column: "id", direction: "desc" } });
      const idHeader = screen.getByRole("columnheader", { name: /id/i });
      expect(idHeader).toHaveAttribute("aria-sort", "descending");
    });
  });

  describe("Pagination", () => {
    it("shows the current page and total pages", () => {
      renderTable({ page: 2, total: 30, pageSize: 10 });
      expect(screen.getByText("2 / 3")).toBeInTheDocument();
    });

    it("shows a record range summary", () => {
      renderTable({ page: 2, total: 25, pageSize: 10 });
      expect(screen.getByText(/showing 11–20 of 25/i)).toBeInTheDocument();
    });

    it("calls onPageChange with page+1 when next button is clicked", () => {
      const onPageChange = jest.fn();
      renderTable({ page: 1, total: 30, pageSize: 10, onPageChange });
      fireEvent.click(screen.getByRole("button", { name: /next page/i }));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("calls onPageChange with page-1 when previous button is clicked", () => {
      const onPageChange = jest.fn();
      renderTable({ page: 2, total: 30, pageSize: 10, onPageChange });
      fireEvent.click(screen.getByRole("button", { name: /previous page/i }));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it("disables previous/first buttons on the first page", () => {
      renderTable({ page: 1, total: 30, pageSize: 10 });
      expect(screen.getByRole("button", { name: /first page/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();
    });

    it("disables next/last buttons on the last page", () => {
      renderTable({ page: 3, total: 30, pageSize: 10 });
      expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /last page/i })).toBeDisabled();
    });

    it("calls onPageSizeChange when the page size selector changes", () => {
      const onPageSizeChange = jest.fn();
      renderTable({ onPageSizeChange });
      fireEvent.change(screen.getByRole("combobox", { name: /rows per page/i }), {
        target: { value: "20" },
      });
      expect(onPageSizeChange).toHaveBeenCalledWith(20);
    });
  });

  describe("Custom cell renderer", () => {
    it("renders a custom cell when cell() is provided on the column definition", () => {
      const columns: ColumnDef<Row>[] = [
        ...COLUMNS,
        {
          key: "actions",
          header: "Actions",
          cell: (row) => (
            <button type="button">{`Delete ${row.id}`}</button>
          ),
        },
      ];
      renderTable({ columns, data: makeRows(2) });
      expect(screen.getByRole("button", { name: "Delete row-1" })).toBeInTheDocument();
    });
  });

  describe("Mocked API integration", () => {
    beforeEach(() => {
      // Silence global fetch — not used directly by DataTable (it receives props)
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("renders rows returned from a mocked fetch response", async () => {
      const mockRows: Row[] = [
        { id: "tx-001", name: "Order Checkout", status: "committed" },
        { id: "tx-002", name: "Inventory Reserve", status: "pending" },
      ];

      // The DataTable itself is purely presentational — it receives pre-fetched data.
      // We simulate the parent feeding it the resolved API payload.
      renderTable({ data: mockRows, total: 2 });

      expect(screen.getByText("tx-001")).toBeInTheDocument();
      expect(screen.getByText("Order Checkout")).toBeInTheDocument();
      expect(screen.getByText("tx-002")).toBeInTheDocument();
      expect(screen.getByText("Inventory Reserve")).toBeInTheDocument();

      const rows = within(screen.getByRole("table")).getAllByRole("row");
      // header + 2 data rows
      expect(rows).toHaveLength(3);
    });
  });
});
