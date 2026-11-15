import React, { useState } from "react";
import { Users, X } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const AddCareTeamModal = ({ isOpen, onClose }) => {
  const { addCareTeamMember } = useCare();

  const [formData, setFormData] = useState({
    name: "",
    role: "Family Member",
    relation: "Son",
    email: "",
    phone: "",
    permissions: "View health schedule, receive medication alerts",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256"
  });

  const [formErrors, setFormErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Member name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addCareTeamMember({
      name: formData.name.trim(),
      role: formData.role,
      relation: formData.relation.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      permissions: formData.permissions.trim(),
      avatar: formData.avatar,
      isPrimary: false
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <Users size={22} className="text-turquoise" />
            <h3 className="modal-title">Add Care Team Member</h3>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. David Wilson"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`form-control ${formErrors.name ? "input-error" : ""}`}
                autoFocus
              />
              {formErrors.name && <span className="form-error-msg">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-control"
              >
                <option value="Family Member">Family Member</option>
                <option value="Secondary Caregiver">Secondary Caregiver</option>
                <option value="Primary Caregiver">Primary Caregiver</option>
                <option value="Visiting Nurse">Visiting Nurse</option>
                <option value="Attending Physician">Attending Physician</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Relationship to Patient</label>
              <input
                type="text"
                placeholder="e.g. Son, Daughter, Nurse"
                value={formData.relation}
                onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number *</label>
              <input
                type="text"
                placeholder="e.g. +1 (555) 876-5432"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`form-control ${formErrors.phone ? "input-error" : ""}`}
              />
              {formErrors.phone && <span className="form-error-msg">{formErrors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              placeholder="e.g. david.w@demo.carecircle.io"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`form-control ${formErrors.email ? "input-error" : ""}`}
            />
            {formErrors.email && <span className="form-error-msg">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Access Permissions Summary</label>
            <input
              type="text"
              placeholder="e.g. View health schedule, receive notifications"
              value={formData.permissions}
              onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
