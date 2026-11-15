import React, { useState } from "react";
import { Pill, Plus, Trash2, X } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const AddMedicationModal = ({ isOpen, onClose }) => {
  const { addMedication } = useCare();

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    scheduleTimes: ["08:00"],
    foodInstructions: "Take with breakfast",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    stockQuantity: 30,
    lowStockThreshold: 7,
    notes: ""
  });

  const [formErrors, setFormErrors] = useState({});

  if (!isOpen) return null;

  const handleFrequencyChange = (freq) => {
    let times = ["08:00"];
    if (freq === "Twice daily") {
      times = ["08:00", "20:00"];
    } else if (freq === "Three times daily") {
      times = ["08:00", "13:00", "20:00"];
    } else if (freq === "Custom schedule") {
      times = ["09:00"];
    }

    setFormData((prev) => ({
      ...prev,
      frequency: freq,
      scheduleTimes: times
    }));
  };

  const handleAddTime = () => {
    setFormData((prev) => ({
      ...prev,
      scheduleTimes: [...prev.scheduleTimes, "12:00"]
    }));
  };

  const handleRemoveTime = (index) => {
    if (formData.scheduleTimes.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      scheduleTimes: prev.scheduleTimes.filter((_, idx) => idx !== index)
    }));
  };

  const handleTimeChange = (index, val) => {
    const updated = [...formData.scheduleTimes];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, scheduleTimes: updated }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Medication name is required";
    if (!formData.dosage.trim()) errors.dosage = "Dosage is required (e.g. 500mg, 1 tablet)";
    if (!formData.scheduleTimes || formData.scheduleTimes.length === 0) {
      errors.scheduleTimes = "At least one dose time is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addMedication({
      name: formData.name.trim(),
      dosage: formData.dosage.trim(),
      frequency: formData.frequency,
      scheduleTimes: formData.scheduleTimes,
      foodInstructions: formData.foodInstructions.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate || "",
      stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 5,
      notes: formData.notes.trim()
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <Pill size={22} className="text-turquoise" />
            <h3 className="modal-title">Add New Medication</h3>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Medication Name *</label>
              <input
                type="text"
                placeholder="e.g. Lisinopril, Metformin"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`form-control ${formErrors.name ? "input-error" : ""}`}
                autoFocus
              />
              {formErrors.name && <span className="form-error-msg">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Dosage & Strength *</label>
              <input
                type="text"
                placeholder="e.g. 10 mg (1 tablet)"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className={`form-control ${formErrors.dosage ? "input-error" : ""}`}
              />
              {formErrors.dosage && <span className="form-error-msg">{formErrors.dosage}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => handleFrequencyChange(e.target.value)}
                className="form-control"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Custom schedule">Custom schedule</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Food Instructions</label>
              <input
                type="text"
                placeholder="e.g. Take with food, On empty stomach"
                value={formData.foodInstructions}
                onChange={(e) => setFormData({ ...formData, foodInstructions: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          {/* Schedule Times Multi-selection */}
          <div className="form-group">
            <label className="form-label">Daily Dose Schedule Time(s) *</label>
            <div className="schedule-times-container">
              {formData.scheduleTimes.map((time, idx) => (
                <div key={idx} className="time-input-row">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(idx, e.target.value)}
                    className="form-control time-input"
                  />
                  {formData.scheduleTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(idx)}
                      className="btn-remove-time"
                      title="Remove this time"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddTime}
                className="btn-add-time"
              >
                <Plus size={14} /> Add Another Dose Time
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Optional End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="form-control"
                placeholder="Ongoing if empty"
              />
            </div>
          </div>

          {/* Micro-feature 3 & 4: Inventory tracking */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Initial Stock Quantity (Pills)</label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Low Stock Alert Threshold</label>
              <input
                type="number"
                min="1"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Special Healthcare Instructions / Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Swallow whole with a full glass of water. Avoid taking simultaneously with antacids."
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
              Save Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
