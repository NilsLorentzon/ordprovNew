import React, { useState, useMemo } from "react";

interface GanttRow {
  rowId: string;
  name: string;
  start: Date | null;
  laborType: "installation" | "maintenance" | "documentation";
  laborTypePercentage: number;
  amountOfWorkers: number;
  relativeTo: string | null;
  offsetAmount: number; // baseline in hours
  disabledDates: string[];
  // Configurations for hours mapping per row (optional overrides)
  hoursPerWeek?: number;
  hoursPerMonth?: number;
}

interface Gantt {
  rows: GanttRow[];
}

export default function GanttPage() {
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const laborHours = {
    installation: 81,
    maintenance: 40,
    documentation: 61,
  };

  const [data, setData] = useState<Gantt>({
    rows: [
      {
        rowId: "1",
        name: "Pre Installation guys",
        start: new Date(2026, 5, 1),
        laborType: "installation",
        laborTypePercentage: 0.5,
        amountOfWorkers: 1,
        relativeTo: null,
        disabledDates: [],
        offsetAmount: 0,
      },
      {
        rowId: "2",
        name: "Completion of installation",
        start: null,
        laborType: "installation",
        laborTypePercentage: 0.5,
        amountOfWorkers: 1,
        relativeTo: "1",
        disabledDates: [],
        offsetAmount: 0,
      },
      {
        rowId: "3",
        name: "Maintenance",
        start: null,
        laborType: "maintenance",
        laborTypePercentage: 1,
        amountOfWorkers: 1,
        relativeTo: "2",
        disabledDates: [],
        offsetAmount: 0,
      },
      {
        rowId: "4",
        name: "Documentation",
        start: null,
        laborType: "documentation",
        laborTypePercentage: 1,
        amountOfWorkers: 1,
        relativeTo: "3",
        disabledDates: [],
        offsetAmount: 40, // 40 hours offset (e.g., 1 standard work week)
      },
    ],
  });

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDateFromInput = (value: string): Date | null => {
    if (!value) return null;
    return new Date(`${value}T00:00:00`);
  };

  const toDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCellStartDate = (cellIndex: number): Date => {
    const today = new Date(2026, 5, 23);
    const date = new Date(today);

    if (viewMode === "week") {
      date.setDate(date.getDate() + cellIndex * 7);
    } else {
      date.setMonth(date.getMonth() + cellIndex);
      date.setDate(1);
    }

    return date;
  };

  const getCellDateKey = (cellIndex: number): string =>
    toDateKey(getCellStartDate(cellIndex));

  const getCellIndexFromDateKey = (dateKey: string): number | null => {
    const cellDate = parseDateFromInput(dateKey);
    if (!cellDate) return null;

    const base = new Date(2026, 5, 23);

    if (viewMode === "week") {
      const diffMs = cellDate.getTime() - base.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return Math.floor(diffDays / 7);
    }

    return (
      (cellDate.getFullYear() - base.getFullYear()) * 12 +
      (cellDate.getMonth() - base.getMonth())
    );
  };

  const updateRow = (rowId: string, updater: (row: GanttRow) => GanttRow) => {
    setData((prev) => ({
      rows: prev.rows.map((row) => (row.rowId === rowId ? updater(row) : row)),
    }));
  };

  const addRow = () => {
    setData((prev) => {
      const maxNumericId = prev.rows.reduce((max, row) => {
        const parsed = Number(row.rowId);
        return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
      }, 0);

      const newRowId = String(maxNumericId + 1);
      const lastRow = prev.rows[prev.rows.length - 1] || null;

      const newRow: GanttRow = {
        rowId: newRowId,
        name: `New Task ${newRowId}`,
        start: null,
        laborType: "installation",
        laborTypePercentage: 1,
        amountOfWorkers: 1,
        relativeTo: lastRow ? lastRow.rowId : null,
        offsetAmount: 0,
        disabledDates: [],
      };

      return { rows: [...prev.rows, newRow] };
    });
  };

  const getHeaderParts = (
    cellIndex: number,
  ): { primaryLabel: string; secondaryLabel: string } => {
    const today = new Date(2026, 5, 23); // Current date: June 23, 2026

    if (viewMode === "week") {
      const weekStartDate = new Date(today);
      weekStartDate.setDate(weekStartDate.getDate() + cellIndex * 7);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const startMonth = monthNames[weekStartDate.getMonth()];
      const endMonth = monthNames[weekEndDate.getMonth()];
      const startDay = weekStartDate.getDate();
      const endDay = weekEndDate.getDate();

      const secondaryLabel =
        weekStartDate.getMonth() === weekEndDate.getMonth()
          ? `${startMonth} ${startDay} - ${endDay}`
          : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

      return {
        primaryLabel: `W${cellIndex + 1}`,
        secondaryLabel,
      };
    }

    const monthDate = new Date(today);
    monthDate.setMonth(monthDate.getMonth() + cellIndex);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[monthDate.getMonth()];
    const year = monthDate.getFullYear();

    return {
      primaryLabel: `M${cellIndex + 1}`,
      secondaryLabel: `${monthName} ${year}`,
    };
  };

  // Calculate the grid layout dynamically
  const { computedRows, totalGridCells } = useMemo(() => {
    const DEFAULT_HOURS_PER_WEEK = 40;
    const DEFAULT_HOURS_PER_MONTH = 160;

    // 1. Map rows for quick lookup
    const rowMap = new Map<string, GanttRow>();
    data.rows.forEach((row) => rowMap.set(row.rowId, row));

    // Memoize resolved timeline items to handle dependencies recursively
    const cache = new Map<
      string,
      {
        startCell: number;
        durationCells: number;
        workCells: number[];
        totalLaborHours: number;
        effectiveHoursPerCell: number;
      }
    >();

    function resolveRow(rowId: string): {
      startCell: number;
      durationCells: number;
      workCells: number[];
      totalLaborHours: number;
      effectiveHoursPerCell: number;
    } {
      if (cache.has(rowId)) return cache.get(rowId)!;

      const row = rowMap.get(rowId);
      if (!row) {
        return {
          startCell: 0,
          durationCells: 0,
          workCells: [],
          totalLaborHours: 0,
          effectiveHoursPerCell: 0,
        };
      }

      // Determine hours conversion factor for this row
      const hoursPerCell =
        viewMode === "week"
          ? row.hoursPerWeek || DEFAULT_HOURS_PER_WEEK
          : row.hoursPerMonth || DEFAULT_HOURS_PER_MONTH;
      const workers = Math.max(1, row.amountOfWorkers || 1);
      const effectiveHoursPerCell = hoursPerCell * workers;

      // Calculate total work hours allocated to this row
      const totalLaborHours =
        laborHours[row.laborType] * row.laborTypePercentage;
      const baseDurationCells = Math.ceil(
        totalLaborHours / effectiveHoursPerCell,
      );

      let startCell = 0;

      if (row.relativeTo) {
        // Parent row dependency
        const parentTimeline = resolveRow(row.relativeTo);
        const parentEndCell =
          parentTimeline.startCell + parentTimeline.durationCells;

        // Convert offset from hours to grid cells (rounding up)
        const offsetCells = Math.ceil(row.offsetAmount / hoursPerCell);
        startCell = parentEndCell + offsetCells;
      } else {
        // Root nodes without relative context start at 0
        const offsetCells = Math.ceil(row.offsetAmount / hoursPerCell);
        startCell = offsetCells;
      }

      // Build an explicit sequence of work cells that skips holidays.
      const disabledCellSet = new Set(
        row.disabledDates
          .map((dateKey) => getCellIndexFromDateKey(dateKey))
          .filter(
            (cellIndex): cellIndex is number =>
              cellIndex !== null && cellIndex >= 0,
          ),
      );

      const workCells: number[] = [];
      let cursor = startCell;
      let remainingWorkCells = baseDurationCells;

      while (remainingWorkCells > 0) {
        if (!disabledCellSet.has(cursor)) {
          workCells.push(cursor);
          remainingWorkCells -= 1;
        }
        cursor += 1;
      }

      const durationCells = Math.max(0, cursor - startCell);

      const result = {
        startCell,
        durationCells,
        workCells,
        totalLaborHours,
        effectiveHoursPerCell,
      };
      cache.set(rowId, result);
      return result;
    }

    // Resolve calculations for all rows
    const calculatedData = data.rows.map((row) => {
      const timeline = resolveRow(row.rowId);
      return {
        ...row,
        ...timeline,
      };
    });

    // Determine total grid size needed
    const maxEndCell = calculatedData.reduce(
      (max, row) => Math.max(max, row.startCell + row.durationCells),
      10, // Minimum default grid columns
    );

    return {
      computedRows: calculatedData,
      totalGridCells: maxEndCell + 2, // Extra padding cells for visual comfort
    };
  }, [data, viewMode]);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans bg-gray-50 rounded-xl shadow-sm">
      {/* Settings Card */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gantt Settings</h2>
            <p className="text-sm text-gray-500">
              Configure view mode and all task parameters before the schema.
            </p>
          </div>
          <div className="bg-gray-200 p-1 rounded-lg flex space-x-1 w-fit">
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === "week"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === "month"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Rows</h3>
          <button
            onClick={addRow}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Add Row
          </button>
        </div>

        <div className="space-y-4 max-h-130 overflow-y-auto pr-1">
          {data.rows.map((row) => (
            <div
              key={row.rowId}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 text-sm font-semibold text-gray-700">
                Row ID: {row.rowId}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <label className="text-sm text-gray-700">
                  <span className="mb-1 block">Name</span>
                  <input
                    value={row.name}
                    onChange={(event) =>
                      updateRow(row.rowId, (current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-1 block">Start Date</span>
                  <input
                    type="date"
                    value={formatDateForInput(row.start)}
                    onChange={(event) =>
                      updateRow(row.rowId, (current) => ({
                        ...current,
                        start: parseDateFromInput(event.target.value),
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-1 block">Labor Type</span>
                  <select
                    value={row.laborType}
                    onChange={(event) =>
                      updateRow(row.rowId, (current) => ({
                        ...current,
                        laborType: event.target.value as GanttRow["laborType"],
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="installation">installation</option>
                    <option value="maintenance">maintenance</option>
                    <option value="documentation">documentation</option>
                  </select>
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-1 block">Labor Type Percentage</span>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    value={row.laborTypePercentage}
                    onChange={(event) =>
                      updateRow(row.rowId, (current) => ({
                        ...current,
                        laborTypePercentage: Number(event.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-1 block">Amount of Workers</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={row.amountOfWorkers}
                    onChange={(event) =>
                      updateRow(row.rowId, (current) => ({
                        ...current,
                        amountOfWorkers: Math.max(
                          1,
                          Math.floor(Number(event.target.value) || 1),
                        ),
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-1 block">Relative To</span>
                  <select
                    value={row.relativeTo || ""}
                    onChange={(event) =>
                      updateRow(row.rowId, (current) => ({
                        ...current,
                        relativeTo: event.target.value || null,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="">None</option>
                    {data.rows
                      .filter((candidate) => candidate.rowId !== row.rowId)
                      .map((candidate) => (
                        <option key={candidate.rowId} value={candidate.rowId}>
                          {candidate.rowId} - {candidate.name}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-1 block">Offset Amount (hours)</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={row.offsetAmount}
                    onChange={(event) =>
                      updateRow(row.rowId, (current) => ({
                        ...current,
                        offsetAmount: Number(event.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-1 block">
                    Disabled Dates (comma separated)
                  </span>
                  <input
                    value={row.disabledDates.join(",")}
                    onChange={(event) => {
                      const parsed = event.target.value
                        .split(",")
                        .map((value) => value.trim())
                        .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value));

                      updateRow(row.rowId, (current) => ({
                        ...current,
                        disabledDates: parsed,
                      }));
                    }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="e.g. 2026-12-25,2027-01-01"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-1 block">Hours Per Week (optional)</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={row.hoursPerWeek ?? ""}
                    onChange={(event) =>
                      updateRow(row.rowId, (current) => ({
                        ...current,
                        hoursPerWeek: event.target.value
                          ? Number(event.target.value)
                          : undefined,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-1 block">Hours Per Month (optional)</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={row.hoursPerMonth ?? ""}
                    onChange={(event) =>
                      updateRow(row.rowId, (current) => ({
                        ...current,
                        hoursPerMonth: event.target.value
                          ? Number(event.target.value)
                          : undefined,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Labor Hour Gantt Schema
        </h3>
        <p className="text-sm text-gray-500">
          Hours based calculations rounded up to nearest grid block
        </p>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <div className="min-w-200">
          {/* Header Row */}
          <div
            className="grid border-b border-gray-200 bg-gray-100 text-gray-600"
            style={{
              gridTemplateColumns: `240px repeat(${totalGridCells}, minmax(100px, 1fr))`,
              gridTemplateRows: "auto auto",
            }}
          >
            <div className="row-span-2 flex items-center p-3 border-r border-gray-200 sticky left-0 bg-gray-100 z-20 font-semibold uppercase tracking-wider shadow-[6px_0_8px_-6px_rgba(0,0,0,0.12)]">
              Task Details
            </div>
            {Array.from({ length: totalGridCells }).map((_, index) => {
              const { primaryLabel } = getHeaderParts(index);

              return (
                <div
                  key={`primary-${index}`}
                  className="bg-gray-100 py-2 px-1 text-center border-r border-b border-gray-200 last:border-r-0 text-xs font-semibold uppercase tracking-wider"
                >
                  {primaryLabel}
                </div>
              );
            })}
            {Array.from({ length: totalGridCells }).map((_, index) => {
              const { secondaryLabel } = getHeaderParts(index);

              return (
                <div
                  key={`secondary-${index}`}
                  className="bg-gray-100 py-2 px-2 text-center border-r border-gray-200 last:border-r-0 text-[11px] font-medium leading-tight"
                >
                  {secondaryLabel}
                </div>
              );
            })}
          </div>

          {/* Data Rows */}
          <div className="divide-y divide-gray-100">
            {computedRows.map((row) => {
              const currentLaborHours =
                laborHours[row.laborType] * row.laborTypePercentage;

              return (
                <div
                  key={row.rowId}
                  className="grid hover:bg-gray-50 transition-colors items-center"
                  style={{
                    gridTemplateColumns: `240px repeat(${totalGridCells}, minmax(100px, 1fr))`,
                  }}
                >
                  {/* Fixed Left Info Section */}
                  <div className="p-3 border-r border-gray-200 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <div className="font-medium text-gray-800 truncate">
                      {row.name}
                    </div>
                    <div className="text-[11px] text-gray-400 capitalize flex items-center justify-between mt-1">
                      <span>
                        {row.laborType} ({row.laborTypePercentage * 100}%)
                      </span>
                      <span className="font-mono text-gray-500 font-semibold">
                        {currentLaborHours} hrs / {row.amountOfWorkers} workers
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Grid Body */}
                  {Array.from({ length: totalGridCells }).map((_, index) => {
                    const isWorkCell = row.workCells.includes(index);
                    const cellDateKey = getCellDateKey(index);
                    const isDisabled = row.disabledDates.includes(cellDateKey);
                    const workCellPosition = row.workCells.indexOf(index);

                    let completedHoursInCell = 0;
                    if (workCellPosition >= 0) {
                      const alreadyCompleted =
                        workCellPosition * row.effectiveHoursPerCell;
                      completedHoursInCell = Math.max(
                        0,
                        Math.min(
                          row.effectiveHoursPerCell,
                          row.totalLaborHours - alreadyCompleted,
                        ),
                      );
                    }

                    // Choose dynamic color palette based on labor type
                    const colorMap = {
                      installation: "bg-blue-500 border-blue-600",
                      maintenance: "bg-emerald-500 border-emerald-600",
                      documentation: "bg-amber-500 border-amber-600",
                    };

                    return (
                      <div
                        key={index}
                        className={`group h-full min-h-13 border-r border-gray-100 last:border-0 flex items-center justify-center py-1 px-0 relative transition-all ${
                          isDisabled ? "bg-red-100" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateRow(row.rowId, (current) => {
                              const exists =
                                current.disabledDates.includes(cellDateKey);
                              return {
                                ...current,
                                disabledDates: exists
                                  ? current.disabledDates.filter(
                                      (date) => date !== cellDateKey,
                                    )
                                  : [...current.disabledDates, cellDateKey],
                              };
                            })
                          }
                          title={
                            isDisabled
                              ? `Remove holiday: ${cellDateKey}`
                              : `Add holiday: ${cellDateKey}`
                          }
                          className={`group-hover:visible invisible absolute right-1 top-1 z-10 h-3.5 w-3.5 rounded-full border text-[9px] leading-none flex items-center justify-center ${
                            isDisabled
                              ? "border-red-400 bg-red-200 text-red-700"
                              : "border-gray-300 bg-white text-gray-400 hover:text-red-500 hover:border-red-300"
                          }`}
                        >
                          {isDisabled ? "-" : "+"}
                        </button>

                        {isWorkCell && (
                          <div
                            className={`w-full h-4/5 rounded shadow-sm border text-[10px] font-bold text-white flex items-center justify-center select-none relative ${
                              isDisabled
                                ? "bg-red-300 border-red-400 text-red-900"
                                : colorMap[row.laborType]
                            }`}
                            title={`${row.name}: ${cellDateKey}`}
                          >
                            <span className="absolute bottom-0.5 right-1 text-[9px] leading-none font-medium text-white/90">
                              {completedHoursInCell}h/
                              {viewMode === "week" ? "w" : "m"}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
