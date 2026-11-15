import React from "react";
import { Calendar, Clock, MapPin, Stethoscope, ChevronRight } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const NextAppointmentCard = ({ onNavigateToAppointments }) => {
  const { nextAppointment } = useCare();

  if (!nextAppointment) {
    return (
      <div className="card next-apt-card">
        <div className="card-header">
          <div className="card-title">
            <Calendar size={19} className="text-turquoise" />
            <span>Upcoming Doctor Appointment</span>
          </div>
        </div>
        <div className="empty-apt-body">
          <p>No upcoming appointments scheduled at this time.</p>
          <button
            onClick={onNavigateToAppointments}
            className="btn btn-outline btn-sm"
            style={{ marginTop: "12px" }}
          >
            Schedule Consultation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card next-apt-card">
      <div className="card-header">
        <div className="card-title">
          <Calendar size={19} className="text-turquoise" />
          <span>Next Doctor Appointment</span>
        </div>
        {/* Micro-feature 5: Appointment Countdown Badge */}
        <span className="badge badge-ocean countdown-pill">
          {nextAppointment.countdownText}
        </span>
      </div>

      <div className="apt-card-content">
        <div className="apt-doctor-block">
          <div className="apt-icon-wrap">
            <Stethoscope size={20} className="text-ocean" />
          </div>
          <div>
            <h4 className="apt-doctor-name">{nextAppointment.doctorName}</h4>
            <span className="apt-specialty">{nextAppointment.specialty}</span>
          </div>
        </div>

        <div className="apt-details-grid">
          <div className="apt-detail-item">
            <Clock size={15} className="detail-icon" />
            <span>
              {nextAppointment.date} at {nextAppointment.time}
            </span>
          </div>
          <div className="apt-detail-item">
            <MapPin size={15} className="detail-icon" />
            <span className="truncate" title={nextAppointment.location}>
              {nextAppointment.hospitalName}
            </span>
          </div>
        </div>

        {nextAppointment.notes && (
          <p className="apt-notes-preview">
            <strong>Notes:</strong> {nextAppointment.notes}
          </p>
        )}

        <div className="apt-card-footer">
          <button
            onClick={onNavigateToAppointments}
            className="btn-text-link"
          >
            <span>View All Appointments</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
