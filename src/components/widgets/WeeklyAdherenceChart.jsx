import React from "react";
import { TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const WeeklyAdherenceChart = () => {
  const { adherenceStats } = useCare();
  const {
    todayTaken,
    todayMissed,
    todayPending,
    todayAdherence,
    weeklyTaken,
    weeklyMissed,
    weeklyAdherence,
    weeklyChartData
  } = adherenceStats;

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
            <span className="rate-num">{weeklyAdherence}%</span>
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

      {/* 7-Day Visual Adherence Chart */}
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
            const heightPercent = Math.max(12, day.adherence);
            const isPerfect = day.adherence === 100 && day.taken > 0;
            const hasMissed = day.missed > 0;

            return (
              <div key={idx} className={`bar-col ${day.isToday ? "is-today" : ""}`}>
                <div className="bar-hover-tooltip">
                  <strong>{day.dayName}, {day.dayLabel}</strong>
                  <div>Adherence: {day.adherence}%</div>
                  <div>Taken: {day.taken} | Missed: {day.missed}</div>
                </div>

                <div className="bar-track">
                  <div
                    className={`bar-fill ${hasMissed ? "bar-with-missed" : "bar-perfect"}`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    <span className="bar-percentage-label">{day.adherence}%</span>
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

      <div className="adherence-formula-note">
        <span>Formula: Taken Doses / (Taken Doses + Missed Doses) × 100</span>
      </div>
    </div>
  );
};
