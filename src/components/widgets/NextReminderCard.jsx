import React from "react";
import { Clock, Check, Sparkles, Pill } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const NextReminderCard = () => {
  const { nextPendingDose, markDoseTaken, medications } = useCare();

  if (!nextPendingDose) {
    const hasMeds = medications.length > 0;
    return (
      <div className={`card next-reminder-card ${hasMeds ? "card-all-complete" : ""}`}>
        <div className="card-header">
          <div className="card-title">
            {hasMeds ? (
              <Sparkles size={19} className="text-turquoise" />
            ) : (
              <Pill size={19} className="text-ocean" />
            )}
            <span>Next Medication Dose</span>
          </div>
          {hasMeds && <span className="badge badge-turquoise">All Caught Up</span>}
        </div>
        <div className="empty-reminder-body">
          <p className="all-complete-msg">
            {hasMeds
              ? "All scheduled doses for today have been completed."
              : "No medications added yet. Scheduled doses will appear here once configured."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card next-reminder-card">
      <div className="card-header">
        <div className="card-title">
          <Clock size={19} className="text-turquoise" />
          <span>Upcoming Dose Reminder</span>
        </div>
        <span className="badge badge-pending">Pending Next</span>
      </div>

      <div className="reminder-body">
        <div className="reminder-time-block">
          <span className="reminder-time-label">Scheduled Time</span>
          <span className="reminder-time-val">{nextPendingDose.scheduledTime}</span>
        </div>

        <div className="reminder-med-details">
          <h4 className="reminder-med-name">{nextPendingDose.medName}</h4>
          <p className="reminder-med-dosage">{nextPendingDose.dosage}</p>
        </div>

        {/* Quick Dose Action */}
        <div className="reminder-action-container">
          <button
            onClick={() => markDoseTaken(nextPendingDose.id)}
            className="btn btn-primary btn-quick-dose"
            title="Mark this next scheduled dose as Taken"
          >
            <Check size={16} />
            <span>Quick Action: Mark as Taken</span>
          </button>
        </div>
      </div>
    </div>
  );
};
