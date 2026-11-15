import React, { useState, useRef } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Camera,
  UserPlus,
  CheckCircle2
} from "lucide-react";
import { useCare } from "../../context/CareContext";

export const SetupProfileModal = ({ isOpen, onClose }) => {
  const { updatePatient, patient } = useCare();

  const [form, setForm] = useState({
    name: patient?.name || "",
    dob: patient?.dob || "",
    gender: patient?.gender || "",
    bloodGroup: patient?.bloodGroup || "",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    physician: patient?.physician || "",
    healthcareNotes: patient?.healthcareNotes || "",
    emergencyContactName: patient?.emergencyContact?.name || "",
    emergencyContactRelation: patient?.emergencyContact?.relation || "",
    emergencyContactPhone: patient?.emergencyContact?.phone || "",
    emergencyContactEmail: patient?.emergencyContact?.email || "",
    avatar: patient?.avatar || null
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "Image must be under 2 MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setForm((prev) => ({ ...prev, avatar: evt.target.result }));
      setErrors((prev) => ({ ...prev, avatar: "" }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Compute age from DOB if provided
    let age = "";
    if (form.dob) {
      const today = new Date();
      const birth = new Date(form.dob);
      age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
    }

    const profileData = {
      id: patient?.id || `patient-${Date.now()}`,
      name: form.name.trim(),
      age,
      dob: form.dob,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      physician: form.physician.trim(),
      healthcareNotes: form.healthcareNotes.trim(),
      emergencyContact: {
        name: form.emergencyContactName.trim(),
        relation: form.emergencyContactRelation.trim(),
        phone: form.emergencyContactPhone.trim(),
        email: form.emergencyContactEmail.trim()
      },
      primaryCaregiver: form.emergencyContactName.trim() || patient?.primaryCaregiver || "",
      avatar: form.avatar
    };

    updatePatient(profileData);
    onClose();
  };

  const getInitialsPreview = () => {
    if (form.avatar) return null;
    if (!form.name.trim()) return null;
    const parts = form.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const previewInitials = getInitialsPreview();

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="setup-modal-title">
      <div className="modal-container" style={{ maxWidth: "620px" }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ background: "linear-gradient(135deg, var(--deep-ocean), var(--ocean-blue))", color: "#fff", borderRadius: "14px 14px 0 0" }}>
          <div>
            <h2 id="setup-modal-title" className="modal-title" style={{ color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
              <UserPlus size={22} />
              Set Up Your Patient Profile
            </h2>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.78)", marginTop: "4px" }}>
              Enter the patient's details to get started. You can update this anytime in Settings.
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close" style={{ color: "rgba(255,255,255,0.8)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>

            {/* Avatar Upload */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  background: form.avatar
                    ? "transparent"
                    : previewInitials
                    ? "linear-gradient(135deg, var(--ocean-blue), var(--turquoise))"
                    : "var(--muted-blue-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  cursor: "pointer",
                  border: "3px solid var(--aqua)",
                  overflow: "hidden"
                }}
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload photo"
              >
                {form.avatar ? (
                  <img src={form.avatar} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : previewInitials ? (
                  <span style={{ fontSize: "2rem", fontWeight: 700, color: "#fff" }}>{previewInitials}</span>
                ) : (
                  <User size={36} style={{ color: "var(--ocean-blue)" }} />
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: "5px" }}>
                  <Camera size={14} style={{ color: "#fff" }} />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "8px" }}>
                Click to upload a photo (optional, max 2 MB)
              </p>
              {errors.avatar && <p className="form-error-msg">{errors.avatar}</p>}
              {form.avatar && (
                <button type="button" className="btn-text-link" style={{ fontSize: "0.75rem", marginTop: "4px" }} onClick={() => setForm((p) => ({ ...p, avatar: null }))}>
                  Remove photo
                </button>
              )}
            </div>

            {/* Personal Details */}
            <div className="form-section-label">Personal Information</div>
            <div className="form-row">
              <div className="form-group form-group-full">
                <label htmlFor="setup-name" className="form-label">
                  <User size={14} /> Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="setup-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? "input-error" : ""}`}
                  placeholder="e.g. Eleanor Thompson"
                  autoFocus
                />
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="setup-dob" className="form-label">Date of Birth</label>
                <input
                  id="setup-dob"
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="setup-gender" className="form-label">Gender</label>
                <select id="setup-gender" name="gender" value={form.gender} onChange={handleChange} className="form-input form-select">
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="setup-bloodGroup" className="form-label">Blood Group</label>
                <select id="setup-bloodGroup" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="form-input form-select">
                  <option value="">Select blood group</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="setup-phone" className="form-label"><Phone size={14} /> Phone</label>
                <input
                  id="setup-phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-group-full">
                <label htmlFor="setup-email" className="form-label"><Mail size={14} /> Email Address</label>
                <input
                  id="setup-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="patient@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-group-full">
                <label htmlFor="setup-address" className="form-label"><MapPin size={14} /> Home Address</label>
                <input
                  id="setup-address"
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="123 Main Street, City, State"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-group-full">
                <label htmlFor="setup-physician" className="form-label">Primary Physician</label>
                <input
                  id="setup-physician"
                  type="text"
                  name="physician"
                  value={form.physician}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Dr. Jane Smith (Geriatrics)"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-group-full">
                <label htmlFor="setup-notes" className="form-label">Healthcare Notes / Allergies</label>
                <textarea
                  id="setup-notes"
                  name="healthcareNotes"
                  value={form.healthcareNotes}
                  onChange={handleChange}
                  className="form-input"
                  rows={3}
                  placeholder="Known allergies, chronic conditions, dietary restrictions..."
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="form-section-label" style={{ marginTop: "20px" }}>
              <Heart size={14} style={{ color: "var(--coral)" }} /> Emergency Contact
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="setup-ec-name" className="form-label">Contact Full Name</label>
                <input
                  id="setup-ec-name"
                  type="text"
                  name="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. James Thompson"
                />
              </div>
              <div className="form-group">
                <label htmlFor="setup-ec-relation" className="form-label">Relationship</label>
                <input
                  id="setup-ec-relation"
                  type="text"
                  name="emergencyContactRelation"
                  value={form.emergencyContactRelation}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Son, Daughter, Spouse"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="setup-ec-phone" className="form-label"><Phone size={14} /> Contact Phone</label>
                <input
                  id="setup-ec-phone"
                  type="tel"
                  name="emergencyContactPhone"
                  value={form.emergencyContactPhone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="form-group">
                <label htmlFor="setup-ec-email" className="form-label"><Mail size={14} /> Contact Email</label>
                <input
                  id="setup-ec-email"
                  type="email"
                  name="emergencyContactEmail"
                  value={form.emergencyContactEmail}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="contact@example.com"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Skip for Now
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              Save Patient Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
