/**
 * DataTable component test suite.
 *
 * Tests focus on user-observable behavior — what appears on screen and how
 * the component responds to interaction — rather than implementation details.
 *
 * The API fetch is mocked at the hook level so we can test the DataTable in
 * isolation without a live network.
 */
import React, { act } from "@testing-library/react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const MOCK_USERS: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor" },
  { id: "3", name: "Carol White", email: "carol@example.com", role: "Viewer" },
];

const COLUMNS: ColumnDef<User>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email" },
  { key: "role", header: "Role", sortable: true },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderTable(overrides: Partial<React.ComponentProps<typeof DataTable<User>>> = {}) {
  const defaultProps: React.ComponentProps<typeof DataTable<User>> = {
    columns: COLUMNS,
    data: MOCK_USERS,
    total: MOCK_USERS.length,
    page: 1,
    pageSize: 10,
    onQueryChange: jest.fn(),
    ...overrides,
  };

  return {
    ...render(<DataTable<User> {...defaultProps} />),
    onQueryChange: defaultProps.onQueryChange as jest.Mock,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DataTable", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders the correct number of data rows", () => {
      renderTable();
      // Each data row is a <tr> inside the table body; the header row is in thead
      const rows = screen.getAllByRole("row");
      // 1 header row + 3 data rows
      expect(rows).toHaveLength(MOCK_USERS.length + 1);
    });

    it("renders all column headers", () => {
      renderTable();
      expect(screen.getByRole("columnheader", { name: /name/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /role/i })).toBeInTheDocument();
    });

    it("renders each row's cell values", () => {
      renderTable();
      MOCK_USERS.forEach((user) => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
        expect(screen.getByText(user.role)).toBeInTheDocument();
      });
    });
  });

  // -------------------------------------------------------------------------
  // Empty state
  // -------------------------------------------------------------------------
  describe("empty state", () => {
    it("shows the empty-state message when data is an empty array", () => {
      renderTable({ data: [], total: 0 });
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });

    it("does not render any data rows in the empty state", () => {
      renderTable({ data: [], total: 0 });
      // Header row + 1 empty-state row (which contains the "No results" message)
      expect(screen.getAllByRole("row")).toHaveLength(2);
    });
  });

  // -------------------------------------------------------------------------
  // Loading state (skeleton)
  // -------------------------------------------------------------------------
  describe("loading state", () => {
    it("renders skeleton rows when isLoading is true", () => {
      renderTable({ data: [], total: 0, isLoading: true, pageSize: 5 });
      // The empty-state message must NOT appear while loading
      expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
      // Skeleton rows are aria-hidden; confirm real data rows aren't shown
      const visibleRows = screen
        .getAllByRole("row")
        .filter((r) => r.getAttribute("aria-hidden") !== "true");
      // Only the header row is visible (not aria-hidden)
      expect(visibleRows).toHaveLength(1);
    });
  });

  // -------------------------------------------------------------------------
  // Pagination
  // -------------------------------------------------------------------------
  describe("pagination", () => {
    it("shows the correct record range label", () => {
      renderTable({ data: MOCK_USERS, total: 50, page: 2, pageSize: 10 });
      expect(screen.getByText(/showing 11–20 of 50/i)).toBeInTheDocument();
    });

    it("calls onQueryChange with page + 1 when Next button is clicked", async () => {
      const user = userEvent.setup();
      const { onQueryChange } = renderTable({
        data: MOCK_USERS,
        total: 50,
        page: 2,
        pageSize: 10,
      });

      await user.click(screen.getByRole("button", { name: /next page/i }));

      expect(onQueryChange).toHaveBeenCalledWith({ page: 3 });
    });

    it("calls onQueryChange with page - 1 when Previous button is clicked", async () => {
      const user = userEvent.setup();
      const { onQueryChange } = renderTable({
        data: MOCK_USERS,
        total: 50,
        page: 2,
        pageSize: 10,
      });

      await user.click(screen.getByRole("button", { name: /previous page/i }));

      expect(onQueryChange).toHaveBeenCalledWith({ page: 1 });
    });

    it("disables the Previous button on the first page", () => {
      renderTable({ data: MOCK_USERS, total: 50, page: 1, pageSize: 10 });
      expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();
    });

    it("disables the Next button on the last page", () => {
      renderTable({ data: MOCK_USERS, total: 3, page: 1, pageSize: 10 });
      expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
    });

    it("shows 'No records' label when total is 0", () => {
      renderTable({ data: [], total: 0 });
      expect(screen.getByText(/no records/i)).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Sorting
  // -------------------------------------------------------------------------
  describe("sorting", () => {
    it("calls onQueryChange with sortBy/sortOrder when a sortable header is clicked", async () => {
      const user = userEvent.setup();
      const { onQueryChange } = renderTable();

      await user.click(screen.getByRole("button", { name: /sort by name/i }));

      expect(onQueryChange).toHaveBeenCalledWith({
        sortBy: "name",
        sortOrder: "asc",
        page: 1,
      });
    });

    it("toggles sort order from asc to desc on second click", async () => {
      const user = userEvent.setup();
      const { onQueryChange } = renderTable({ sortBy: "name", sortOrder: "asc" });

      await user.click(screen.getByRole("button", { name: /sort by name/i }));

      expect(onQueryChange).toHaveBeenCalledWith({
        sortBy: "name",
        sortOrder: "desc",
        page: 1,
      });
    });

    it("does not render a sort button for non-sortable columns", () => {
      renderTable();
      // "Email" column has sortable: undefined — no sort button
      expect(
        screen.queryByRole("button", { name: /sort by email/i })
      ).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Search (debounced)
  // -------------------------------------------------------------------------
  describe("search input", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it("renders a search input", () => {
      renderTable();
      expect(screen.getByRole("textbox", { name: /search/i })).toBeInTheDocument();
    });

    it("calls onQueryChange with the search term after debounce delay", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { onQueryChange } = renderTable();

      const searchInput = screen.getByRole("textbox", { name: /search/i });
      await user.type(searchInput, "Alice");

      // Before debounce fires, onQueryChange should not have been called
      expect(onQueryChange).not.toHaveBeenCalled();

      // Advance past the 400ms debounce window
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(onQueryChange).toHaveBeenCalledWith(
          expect.objectContaining({ search: "Alice", page: 1 })
        );
      });
    });

    it("does not call onQueryChange if search text has not changed", async () => {
      const { onQueryChange } = renderTable({ search: "" });

      // No interaction — should not call
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(onQueryChange).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Custom cell rendering
  // -------------------------------------------------------------------------
  describe("custom cell renderer", () => {
    it("renders output of the custom cell function", () => {
      const columnsWithCustomCell: ColumnDef<User>[] = [
        {
          key: "role",
          header: "Role",
          cell: (row) => <span data-testid="badge">{row.role.toUpperCase()}</span>,
        },
      ];

      renderTable({ columns: columnsWithCustomCell });

      const badges = screen.getAllByTestId("badge");
      expect(badges).toHaveLength(MOCK_USERS.length);
      expect(badges[0]).toHaveTextContent("ADMIN");
    });
  });

  // -------------------------------------------------------------------------
  // Page size display
  // -------------------------------------------------------------------------
  describe("page display", () => {
    it("shows current page / total pages", () => {
      renderTable({ data: MOCK_USERS, total: 50, page: 3, pageSize: 10 });
      // e.g. "3 / 5"
      expect(screen.getByText(/3\s*\/\s*5/)).toBeInTheDocument();
    });
  });
});
