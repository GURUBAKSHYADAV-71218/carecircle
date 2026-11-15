import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { CareProvider } from "../../src/context/CareContext";
import { WeeklyAdherenceChart } from "../../src/components/widgets/WeeklyAdherenceChart";

describe("WeeklyAdherenceChart", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders empty adherence state when no doses have been recorded", () => {
    render(
      <CareProvider>
        <WeeklyAdherenceChart />
      </CareProvider>
    );

    expect(screen.getByText(/No Adherence Records Yet/i)).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument(); // 7-day avg shows dash
    expect(screen.getByText("Taken Today")).toBeInTheDocument();
    expect(screen.getByText("Missed Today")).toBeInTheDocument();
  });

  it("renders accurate adherence metrics when real dose records exist", () => {
    const today = new Date().toISOString().split("T")[0];
    const doseRecords = [
      { id: "d1", medId: "m1", date: today, scheduledTime: "08:00", status: "taken", actionTimestamp: new Date().toISOString() },
      { id: "d2", medId: "m2", date: today, scheduledTime: "12:00", status: "taken", actionTimestamp: new Date().toISOString() },
      { id: "d3", medId: "m3", date: today, scheduledTime: "18:00", status: "missed", actionTimestamp: new Date().toISOString() },
      { id: "d4", medId: "m4", date: today, scheduledTime: "21:00", status: "pending" },
    ];
    localStorage.setItem("carecircle_dose_records", JSON.stringify(doseRecords));

    render(
      <CareProvider>
        <WeeklyAdherenceChart />
      </CareProvider>
    );

    // 2 taken, 1 missed, 1 pending
    expect(screen.getByText("Taken Today")).toBeInTheDocument();
    expect(screen.getByText("Missed Today")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();

    // Rates: 2 taken / (2 + 1) = 67%
    expect(screen.getAllByText("67%").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/No Adherence Records Yet/i)).not.toBeInTheDocument();
  });
});
