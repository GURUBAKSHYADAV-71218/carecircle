import React, { useState } from "react";
import {
  Pill,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Edit2,
  Trash2,
  PackagePlus,
  Info
} from "lucide-react";
import { useCare } from "../../context/CareContext";
import { LowStockBanner } from "../widgets/LowStockBanner";

export const MedicationsPage = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteConfirm,
  onOpenRefillModal
}) => {
  const {
    medications,
    doseRecords,
    togglePauseMedication,
    markDoseTaken,
    markDoseMissed,
    searchQuery,
    setSearchQuery
  } = useCare();

  const [activeFilter, setActiveFilter] = useState("all"); // all | active | paused | taken | missed

  const todayStr = new Date().toISOString().split("T")[0];
  const todayDoses = doseRecords.filter((d) => d.date === todayStr);

  // Filtered Medications logic
  const filteredMedications = medications.filter((med) => {
    // Search query check (Micro-feature 2)
    const matchesSearch =
      searchQuery === "" ||
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.dosage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.foodInstructions.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "all") return true;
    if (activeFilter === "active") return med.status === "active";
    if (activeFilter === "paused") return med.status === "paused";

    // If filter is "taken", check if today has taken doses for this med
    if (activeFilter === "taken") {
      return todayDoses.some((d) => d.medId === med.id && d.status === "taken");
    }
    // If filter is "missed", check if today has missed doses for this med
    if (activeFilter === "missed") {
      return todayDoses.some((d) => d.medId === med.id && d.status === "missed");
    }

    return true;
  });

  return (
    <div className="medications-page">
      {/* Top Controls Bar */}
      <div className="page-header-actions-bar">
        <div className="page-search-and-filters">
          {/* Instant Search Bar (Micro-feature 2) */}
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search medications by name, dosage or food instructions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control page-search-input"
            />
          </div>

          {/* Filter Pills */}
          <div className="filter-pills-group">
            <button
              onClick={() => setActiveFilter("all")}
              className={`filter-pill ${activeFilter === "all" ? "active" : ""}`}
            >
              All ({medications.length})
            </button>
            <button
              onClick={() => setActiveFilter("active")}
              className={`filter-pill ${activeFilter === "active" ? "active" : ""}`}
            >
              Active ({medications.filter((m) => m.status === "active").length})
            </button>
            <button
              onClick={() => setActiveFilter("paused")}
              className={`filter-pill ${activeFilter === "paused" ? "active" : ""}`}
            >
              Paused ({medications.filter((m) => m.status === "paused").length})
            </button>
            <button
              onClick={() => setActiveFilter("taken")}
              className={`filter-pill ${activeFilter === "taken" ? "active" : ""}`}
            >
              Taken Today
            </button>
            <button
              onClick={() => setActiveFilter("missed")}
              className={`filter-pill ${activeFilter === "missed" ? "active" : ""}`}
            >
              Missed Today
            </button>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="btn btn-primary"
          title="Add a new prescription or supplement"
        >
          <Plus size={16} />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Low Stock Alert Banner (Micro-feature 3 & 4) */}
      <LowStockBanner onOpenRefillModal={onOpenRefillModal} />

      {/* Section: Today's Dose Confirmation Tracker */}
      <div className="card today-tracker-section">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Clock size={19} className="text-turquoise" />
              <span>Today's Live Dose Schedule Tracker</span>
            </h3>
            <p className="card-subtitle">
              Verify scheduled doses for today ({todayStr}). Actions immediately update adherence analytics.
            </p>
          </div>
        </div>

        <div className="today-tracker-grid">
          {todayDoses.map((dose) => (
            <div
              key={dose.id}
              className={`today-tracker-card dose-status-${dose.status}`}
            >
              <div className="tracker-card-top">
                <span className="tracker-time-chip">
                  <Clock size={13} /> {dose.scheduledTime}
                </span>
                <span className={`badge ${
                  dose.status === "taken" ? "badge-turquoise" :
                  dose.status === "missed" ? "badge-coral" : "badge-pending"
                }`}>
                  {dose.status}
                </span>
              </div>

              <div className="tracker-card-body">
                <h4 className="tracker-med-name">{dose.medName}</h4>
                <span className="tracker-dosage">{dose.dosage}</span>
                {dose.takenAt && (
                  <span className="tracker-timestamp">Logged: {dose.takenAt}</span>
                )}
              </div>

              <div className="tracker-card-actions">
                {dose.status === "pending" ? (
                  <>
                    <button
                      onClick={() => markDoseTaken(dose.id)}
                      className="btn btn-sm btn-primary"
                      title="Mark dose as Taken"
                    >
                      <CheckCircle2 size={14} /> Taken
                    </button>
                    <button
                      onClick={() => markDoseMissed(dose.id)}
                      className="btn btn-sm btn-soft-coral"
                      title="Mark dose as Missed"
                    >
                      <AlertTriangle size={14} /> Missed
                    </button>
                  </>
                ) : (
                  <span className="tracker-action-done">
                    {dose.status === "taken" ? "Confirmed Taken" : "Marked Missed"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Structured Medication Prescriptions List */}
      <div className="medications-grid-container">
        <div className="section-title-row">
          <h3 className="section-heading">
            <Pill size={20} className="text-ocean" />
            <span>Prescription & Supplement Regimen ({filteredMedications.length})</span>
          </h3>
        </div>

        {filteredMedications.length === 0 ? (
          <div className="card empty-meds-card">
            <Info size={28} className="text-muted" />
            <h4>No medications match your query or filter</h4>
            <p>Try resetting the search bar or filter buttons above.</p>
          </div>
        ) : (
          <div className="medications-cards-grid">
            {filteredMedications.map((med) => {
              const isPaused = med.status === "paused";
              const isLowStock = med.stockQuantity <= med.lowStockThreshold;

              return (
                <div
                  key={med.id}
                  className={`card med-prescription-card ${isPaused ? "med-card-paused" : ""}`}
                >
                  <div className="med-card-header">
                    <div className="med-badge-group">
                      <span className={`badge ${isPaused ? "badge-coral" : "badge-turquoise"}`}>
                        {med.status}
                      </span>
                      <span className="badge badge-ocean">{med.frequency}</span>
                    </div>

                    <div className="med-top-actions">
                      <button
                        onClick={() => togglePauseMedication(med.id)}
                        className="btn-icon-subtle"
                        title={isPaused ? "Resume Medication" : "Pause Medication"}
                      >
                        {isPaused ? <Play size={16} /> : <Pause size={16} />}
                      </button>
                      <button
                        onClick={() => onOpenEditModal(med)}
                        className="btn-icon-subtle"
                        title="Edit Medication Details"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onOpenDeleteConfirm(med)}
                        className="btn-icon-subtle text-coral"
                        title="Delete Medication"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="med-card-main-info">
                    <h3 className="med-name-heading">{med.name}</h3>
                    <p className="med-dosage-text">{med.dosage}</p>
                  </div>

                  <div className="med-details-list">
                    <div className="med-detail-row">
                      <span className="detail-label">Schedule Times:</span>
                      <span className="detail-value">
                        {med.scheduleTimes && med.scheduleTimes.length > 0
                          ? med.scheduleTimes.join(", ")
                          : "None"}
                      </span>
                    </div>

                    {med.foodInstructions && (
                      <div className="med-detail-row">
                        <span className="detail-label">Instructions:</span>
                        <span className="detail-value">{med.foodInstructions}</span>
                      </div>
                    )}

                    <div className="med-detail-row">
                      <span className="detail-label">Start Date:</span>
                      <span className="detail-value">
                        {med.startDate} {med.endDate ? `to ${med.endDate}` : "(Ongoing)"}
                      </span>
                    </div>

                    {/* Micro-features 3 & 4: Low Stock & Refill Tracker */}
                    <div className="med-detail-row stock-row">
                      <span className="detail-label">Remaining Supply:</span>
                      <div className="stock-control-group">
                        <span className={`detail-value stock-counter ${isLowStock ? "text-coral font-bold" : ""}`}>
                          {med.stockQuantity} pills
                          {isLowStock && " (Low Stock!)"}
                        </span>
                        <button
                          onClick={() => onOpenRefillModal(med)}
                          className="btn btn-sm btn-outline btn-refill"
                          title="Replenish stock"
                        >
                          <PackagePlus size={13} /> Refill
                        </button>
                      </div>
                    </div>
                  </div>

                  {med.notes && (
                    <div className="med-notes-footer">
                      <p>
                        <strong>Clinical Note:</strong> {med.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
