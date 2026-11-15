import React from "react";
import { CheckSquare, RotateCcw, Check, Sparkles } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const DailyChecklistCard = () => {
  const { checklist, toggleChecklistItem, resetDailyChecklist } = useCare();

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="card daily-checklist-widget">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <CheckSquare size={19} className="text-turquoise" />
            <span>Daily Care Checklist</span>
          </h3>
          <p className="card-subtitle">
            {completedCount} of {totalCount} completed ({progressPercent}%)
          </p>
        </div>
        <button
          onClick={resetDailyChecklist}
          className="btn btn-outline btn-sm btn-reset-checklist"
          title="Reset checklist for a new day"
        >
          <RotateCcw size={13} />
          <span>Reset Day</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="checklist-progress-track">
        <div
          className="checklist-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="checklist-items-list">
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleChecklistItem(item.id)}
            className={`checklist-item-row ${item.completed ? "is-completed" : ""}`}
            role="checkbox"
            aria-checked={item.completed}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleChecklistItem(item.id);
              }
            }}
          >
            <div className={`checklist-checkbox ${item.completed ? "checked" : ""}`}>
              {item.completed && <Check size={14} className="check-icon" />}
            </div>
            <div className="checklist-item-text">
              <span className="checklist-task-label">{item.task}</span>
              {item.time && <span className="checklist-task-time">{item.time}</span>}
            </div>
          </div>
        ))}
      </div>

      {progressPercent === 100 && (
        <div className="checklist-all-done-banner">
          <Sparkles size={16} className="text-turquoise" />
          <span>All daily care tasks are completed! Wonderful job today.</span>
        </div>
      )}
    </div>
  );
};
