import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CareProvider } from "../../src/context/CareContext";
import { NextAppointmentCard } from "../../src/components/widgets/NextAppointmentCard";

describe("NextAppointmentCard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders empty state when there are no appointments scheduled", () => {
    const handleNavigate = vi.fn();
    render(
      <CareProvider>
        <NextAppointmentCard onNavigateToAppointments={handleNavigate} />
      </CareProvider>
    );

    expect(screen.getByText(/No upcoming appointments scheduled at this time/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Schedule Consultation/i })).toBeInTheDocument();
  });

  it("renders next appointment details when an appointment is scheduled", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const apt = {
      id: "apt-card-1",
      doctorName: "Dr. Gregory House",
      specialty: "Diagnostics",
      hospitalName: "Princeton-Plainsboro",
      date: dateStr,
      time: "10:30",
      location: "Room 402",
      notes: "Bring previous MRI scans",
      status: "upcoming",
    };
    localStorage.setItem("carecircle_appointments", JSON.stringify([apt]));

    render(
      <CareProvider>
        <NextAppointmentCard onNavigateToAppointments={() => {}} />
      </CareProvider>
    );

    expect(screen.getByText("Dr. Gregory House")).toBeInTheDocument();
    expect(screen.getByText("Diagnostics")).toBeInTheDocument();
    expect(screen.getByText("Princeton-Plainsboro")).toBeInTheDocument();
    expect(screen.getByText(/Bring previous MRI scans/i)).toBeInTheDocument();
  });

  it("calls navigation handler when button is clicked", async () => {
    const user = userEvent.setup();
    const handleNavigate = vi.fn();

    render(
      <CareProvider>
        <NextAppointmentCard onNavigateToAppointments={handleNavigate} />
      </CareProvider>
    );

    await user.click(screen.getByRole("button", { name: /Schedule Consultation/i }));
    expect(handleNavigate).toHaveBeenCalledTimes(1);
  });
});
