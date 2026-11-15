import React from "react";
import { TrendingUp, CheckCircle, XCircle, Clock, Info } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const WeeklyAdherenceChart = () => {
  const { adherenceStats, medications } = useCare();
  const {
    todayTaken,
    todayMissed,
    todayPending,
    todayAdherence,
    weeklyTaken,
    weeklyMissed,
    weeklyAdherence,
    hasAdherenceData,
    weeklyChartData
  } = adherenceStats;

  const totalDosesRecorded = weeklyChartData.reduce((acc, d) => acc + d.total, 0);

  return (
    <div className="card adherence-chart-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <TrendingUp size={19} className="text-turquoise" />
            <span>Medication Adherence</span>
          </h3>
          <p className="card-subtitle">
            Calculated from verified dose confirmations (Pending excluded)
          </p>
        </div>
        <div className="adherence-badge-group">
          <div className="adherence-rate-pill">
            <span className="rate-num">{hasAdherenceData ? `${weeklyAdherence}%` : "—"}</span>
            <span className="rate-label">7-Day Avg</span>
          </div>
        </div>
      </div>

      {/* Adherence Mini Summary Counters */}
      <div className="adherence-metrics-grid">
        <div className="adherence-metric-box metric-taken">
          <div className="metric-icon-wrap">
            <CheckCircle size={16} />
          </div>
          <div>
            <span className="metric-val">{todayTaken}</span>
            <span className="metric-name">Taken Today</span>
          </div>
        </div>

        <div className="adherence-metric-box metric-missed">
          <div className="metric-icon-wrap">
            <XCircle size={16} />
          </div>
          <div>
            <span className="metric-val">{todayMissed}</span>
            <span className="metric-name">Missed Today</span>
          </div>
        </div>

        <div className="adherence-metric-box metric-pending">
          <div className="metric-icon-wrap">
            <Clock size={16} />
          </div>
          <div>
            <span className="metric-val">{todayPending}</span>
            <span className="metric-name">Pending</span>
          </div>
        </div>
      </div>

      {/* 7-Day Visual Adherence Chart or Empty State */}
      {totalDosesRecorded === 0 && !hasAdherenceData ? (
        <div style={{ padding: "30px 20px", textAlign: "center", background: "var(--soft-aqua-bg)", borderRadius: "10px", margin: "16px 0" }}>
          <Info size={24} style={{ color: "var(--ocean-blue)", margin: "0 auto 8px" }} />
          <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--deep-ocean)", marginBottom: "4px" }}>
            No Adherence Records Yet
          </h4>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "380px", margin: "0 auto" }}>
            {medications.length === 0
              ? "Add medications to begin tracking daily adherence rates and performance trends."
              : "Mark scheduled doses as Taken or Missed to generate your 7-day adherence chart."}
          </p>
        </div>
      ) : (
        <div className="weekly-chart-wrapper">
          <div className="chart-header-row">
            <span className="chart-legend-title">7-Day Adherence Trend</span>
            <div className="chart-legend-items">
              <span className="legend-item"><span className="legend-dot dot-taken"></span> Taken</span>
              <span className="legend-item"><span className="legend-dot dot-missed"></span> Missed</span>
            </div>
          </div>

          <div className="weekly-bars-container">
            {weeklyChartData.map((day, idx) => {
              const hasData = day.taken + day.missed > 0;
              const heightPercent = hasData ? Math.max(12, day.adherence) : 8;
              const hasMissed = day.missed > 0;

              return (
                <div key={idx} className={`bar-col ${day.isToday ? "is-today" : ""}`}>
                  <div className="bar-hover-tooltip">
                    <strong>{day.dayName}, {day.dayLabel}</strong>
                    <div>Adherence: {hasData ? `${day.adherence}%` : "No doses logged"}</div>
                    <div>Taken: {day.taken} | Missed: {day.missed}</div>
                  </div>

                  <div className="bar-track">
                    <div
                      className={`bar-fill ${!hasData ? "bar-empty" : hasMissed ? "bar-with-missed" : "bar-perfect"}`}
                      style={{ height: `${heightPercent}%`, opacity: hasData ? 1 : 0.3 }}
                    >
                      {hasData && <span className="bar-percentage-label">{day.adherence}%</span>}
                    </div>
                  </div>

                  <div className="bar-label-group">
                    <span className="bar-day-name">{day.dayName}</span>
                    <span className="bar-day-date">{day.dayLabel}</span>
                    {day.isToday && <span className="today-indicator-dot" title="Today" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="adherence-formula-note">
        <span>Formula: Taken Doses / (Taken Doses + Missed Doses) × 100</span>
      </div>
    </div>
  );
};
