import React, { useState } from "react";
import {
  Clock,
  Pill,
  Calendar,
  Users,
  CheckSquare,
  Shield,
  Activity,
  Filter
} from "lucide-react";
import { useCare } from "../../context/CareContext";

export const TimelinePage = () => {
  const { timeline } = useCare();
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTimeline = timeline.filter((event) => {
    if (activeCategory === "all") return true;
    return event.category === activeCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case "medication":
        return <Pill size={16} className="text-turquoise" />;
      case "appointment":
        return <Calendar size={16} className="text-ocean" />;
      case "caregiver":
        return <Users size={16} className="text-lavender" />;
      case "checklist":
        return <CheckSquare size={16} className="text-turquoise" />;
      default:
        return <Activity size={16} className="text-ocean" />;
    }
  };

  return (
    <div className="timeline-page">
      {/* Top Filter Bar */}
      <div className="page-header-actions-bar">
        <div className="filter-pills-group">
          <button
            onClick={() => setActiveCategory("all")}
            className={`filter-pill ${activeCategory === "all" ? "active" : ""}`}
          >
            All Activities ({timeline.length})
          </button>
          <button
            onClick={() => setActiveCategory("medication")}
            className={`filter-pill ${activeCategory === "medication" ? "active" : ""}`}
          >
            Medication Actions
          </button>
          <button
            onClick={() => setActiveCategory("appointment")}
            className={`filter-pill ${activeCategory === "appointment" ? "active" : ""}`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveCategory("caregiver")}
            className={`filter-pill ${activeCategory === "caregiver" ? "active" : ""}`}
          >
            Care Team
          </button>
          <button
            onClick={() => setActiveCategory("checklist")}
            className={`filter-pill ${activeCategory === "checklist" ? "active" : ""}`}
          >
            Daily Checklist
          </button>
        </div>
      </div>

      {/* Chronological Timeline Stream */}
      <div className="timeline-stream-container">
        {filteredTimeline.length === 0 ? (
          <div className="card empty-state-card">
            <Clock size={32} className="text-muted" />
            <h4>No activity recorded in this category yet</h4>
            <p>New healthcare events will appear as you take actions.</p>
          </div>
        ) : (
          <div className="timeline-nodes-list">
            {filteredTimeline.map((item, idx) => {
              const dateObj = new Date(item.timestamp);
              const dateStr = dateObj.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
              });
              const timeStr = dateObj.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div key={item.id} className="timeline-node-card card">
                  <div className="timeline-node-left">
                    <div className="timeline-node-icon-wrapper">
                      {getCategoryIcon(item.category)}
                    </div>
                    {idx !== filteredTimeline.length - 1 && (
                      <div className="timeline-connecting-line" />
                    )}
                  </div>

                  <div className="timeline-node-body">
                    <div className="timeline-node-header">
                      <span className="timeline-node-title">{item.title}</span>
                      <span className="timeline-node-time">
                        {dateStr} at {timeStr}
                      </span>
                    </div>

                    <p className="timeline-node-desc">{item.description}</p>

                    <div className="timeline-node-footer">
                      <span className="timeline-author-badge">Logged by {item.author}</span>
                      <span className="timeline-category-tag">Category: {item.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
