import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CareProvider } from "../../src/context/CareContext";
import { ReportsPage } from "../../src/components/pages/ReportsPage";

describe("ReportsPage Component", () => {
  beforeEach(() => {
    localStorage.clear();
    window.print = vi.fn();
  });

  it("renders empty state without fabricating fake adherence percentages when no data exists", () => {
    render(
      <CareProvider>
        <ReportsPage />
      </CareProvider>
    );

    expect(screen.getByText(/Healthcare Reports & Clinical Adherence Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/7-Day Trajectory: No data yet/i)).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0); // Placeholders when no adherence data exists
  });

  it("renders real clinical summary and triggers window.print when Print button is clicked", () => {
    const genuinePatient = {
      id: "pat-101",
      name: "Arthur Dent",
      age: 42,
      bloodGroup: "B+",
      physician: "Dr. Slartibartfast",
      emergencyContact: { name: "Trillian", phone: "+1 555-4242", relation: "Partner" }
    };
    const med = {
      id: "med-101",
      name: "Tea Leaf Extract",
      dosage: "200 ml",
      frequency: "Daily",
      status: "active",
      stockQuantity: 15,
      lowStockThreshold: 5
    };
    const today = new Date().toISOString().split("T")[0];
    const doseRecords = [
      { id: "d1", medId: "med-101", date: today, scheduledTime: "08:00", status: "taken", actionTimestamp: new Date().toISOString() }
    ];

    localStorage.setItem("carecircle_patient", JSON.stringify(genuinePatient));
    localStorage.setItem("carecircle_medications", JSON.stringify([med]));
    localStorage.setItem("carecircle_dose_records", JSON.stringify(doseRecords));

    render(
      <CareProvider>
        <ReportsPage />
      </CareProvider>
    );

    expect(screen.getByText("Arthur Dent")).toBeInTheDocument();
    expect(screen.getByText(/Tea Leaf Extract/i)).toBeInTheDocument();
    expect(screen.getByText(/7-Day Trajectory: 100%/i)).toBeInTheDocument();

    const printButton = screen.getByRole("button", { name: /Print Healthcare Report/i });
    fireEvent.click(printButton);

    expect(window.print).toHaveBeenCalledTimes(1);
  });
});
