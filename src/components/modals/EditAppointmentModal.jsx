import React, { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const EditAppointmentModal = ({ isOpen, onClose, appointment }) => {
  const { updateAppointment } = useCare();

  const [formData, setFormData] = useState({
    doctorName: "",
    specialty: "",
    date: "",
    time: "",
    hospitalName: "",
    location: "",
    notes: ""
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (appointment) {
      setFormData({
        doctorName: appointment.doctorName || "",
        specialty: appointment.specialty || "",
        date: appointment.date || "",
        time: appointment.time || "",
        hospitalName: appointment.hospitalName || "",
        location: appointment.location || "",
        notes: appointment.notes || ""
      });
      setFormErrors({});
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const validate = () => {
    const errors = {};
    if (!formData.doctorName.trim()) errors.doctorName = "Doctor name is required";
    if (!formData.specialty.trim()) errors.specialty = "Specialty is required";
    if (!formData.date) errors.date = "Date is required";
    if (!formData.time) errors.time = "Time is required";
    if (!formData.hospitalName.trim()) errors.hospitalName = "Hospital/Clinic name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateAppointment({
      id: appointment.id,
      doctorName: formData.doctorName.trim(),
      specialty: formData.specialty.trim(),
      date: formData.date,
      time: formData.time,
      hospitalName: formData.hospitalName.trim(),
      location: formData.location.trim() || formData.hospitalName.trim(),
      notes: formData.notes.trim()
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <Calendar size={22} className="text-turquoise" />
            <h3 className="modal-title">Edit Appointment: {appointment.doctorName}</h3>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Doctor Name *</label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className={`form-control ${formErrors.doctorName ? "input-error" : ""}`}
              />
              {formErrors.doctorName && <span className="form-error-msg">{formErrors.doctorName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Medical Specialty *</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className={`form-control ${formErrors.specialty ? "input-error" : ""}`}
              />
              {formErrors.specialty && <span className="form-error-msg">{formErrors.specialty}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Appointment Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`form-control ${formErrors.date ? "input-error" : ""}`}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Appointment Time *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={`form-control ${formErrors.time ? "input-error" : ""}`}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hospital or Clinic Name *</label>
            <input
              type="text"
              value={formData.hospitalName}
              onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
              className={`form-control ${formErrors.hospitalName ? "input-error" : ""}`}
            />
            {formErrors.hospitalName && <span className="form-error-msg">{formErrors.hospitalName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Address or Office Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
