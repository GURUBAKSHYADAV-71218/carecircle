import React from "react";
import { Pill, Clock, Check, AlertCircle, Sparkles } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const NextReminderCard = () => {
  const { nextPendingDose, markDoseTaken } = useCare();

  if (!nextPendingDose) {
    return (
      <div className="card next-reminder-card card-all-complete">
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={19} className="text-turquoise" />
            <span>Next Medication Dose</span>
          </div>
          <span className="badge badge-turquoise">All Caught Up</span>
        </div>
        <div className="empty-reminder-body">
          <p className="all-complete-msg">
            All scheduled doses for today have been completed. Outstanding adherence!
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

        {/* Micro-feature 1: Quick Dose Action */}
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
