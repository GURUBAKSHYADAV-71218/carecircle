import React from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Phone,
  Mail,
  Crown,
  Key,
  Edit2,
  Trash2,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useCare } from "../../context/CareContext";

export const CareTeamPage = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteConfirm,
  onOpenPasscodeModal
}) => {
  const {
    careTeam,
    patient,
    setPrimaryCaregiver,
    viewMode,
    switchBackToPatient
  } = useCare();

  return (
    <div className="care-team-page">
      {/* Top Banner: Role Mode & Passcode Switcher */}
      <div className="card care-team-access-banner">
        <div className="access-banner-content">
          <div className="access-icon-box">
            <ShieldCheck size={28} className="text-turquoise" />
          </div>
          <div>
            <h3 className="access-banner-title">Shared Family & Caregiver Coordination Hub</h3>
            <p className="access-banner-desc">
              Connect family members, visiting nurses, and authorized caregivers in one centralized ecosystem.
            </p>
          </div>
        </div>

        <div className="access-banner-actions">
          {viewMode === "caregiver" ? (
            <div className="caregiver-unlocked-chip">
              <span className="badge badge-ocean">
                <CheckCircle2 size={13} /> Caregiver View Active
              </span>
              <button
                onClick={switchBackToPatient}
                className="btn btn-outline btn-sm"
              >
                Switch to Patient Mode
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenPasscodeModal}
              className="btn btn-primary"
              title="Enter demo passcode (2468)"
            >
              <Key size={15} />
              <span>Unlock Caregiver View (Demo)</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Controls Bar */}
      <div className="page-header-actions-bar">
        <div>
          <h3 className="section-heading">
            <Users size={20} className="text-ocean" />
            <span>Authorized Care Circle Members ({careTeam.length})</span>
          </h3>
          <p className="section-subtext">
            Managing care coordination for <strong>{patient.name}</strong>
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="btn btn-primary"
          title="Add a new family member or healthcare provider"
        >
          <UserPlus size={16} />
          <span>Add Care Team Member</span>
        </button>
      </div>

      {/* Care Team Members Grid */}
      <div className="care-team-cards-grid">
        {careTeam.map((member) => {
          const isPatient = member.role === "Patient";
          const isPrimary = member.isPrimary;

          return (
            <div
              key={member.id}
              className={`card care-member-card ${isPrimary ? "member-primary-card" : ""}`}
            >
              <div className="member-card-header">
                <div className="member-avatar-wrapper">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="member-avatar-img"
                  />
                  {isPrimary && (
                    <span className="primary-crown-badge" title="Primary Caregiver">
                      <Crown size={12} />
                    </span>
                  )}
                </div>

                <div className="member-header-actions">
                  {!isPatient && (
                    <>
                      <button
                        onClick={() => onOpenEditModal(member)}
                        className="btn-icon-subtle"
                        title="Edit Member"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onOpenDeleteConfirm(member)}
                        className="btn-icon-subtle text-coral"
                        title="Remove Member"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="member-info-section">
                <div className="member-name-row">
                  <h4 className="member-name">{member.name}</h4>
                  <span className="badge badge-turquoise">{member.accessStatus}</span>
                </div>
                <span className="member-role-title">
                  {member.role} {member.relation ? `(${member.relation})` : ""}
                </span>
              </div>

              <div className="member-contact-details">
                <a
                  href={`tel:${member.phone.replace(/[^0-9+]/g, "")}`}
                  className="member-contact-link"
                >
                  <Phone size={14} className="contact-icon" />
                  <span>{member.phone}</span>
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="member-contact-link"
                >
                  <Mail size={14} className="contact-icon" />
                  <span className="truncate">{member.email}</span>
                </a>
              </div>

              <div className="member-permissions-box">
                <span className="perm-label">Permissions Summary:</span>
                <p className="perm-text">{member.permissions}</p>
              </div>

              {!isPatient && !isPrimary && (
                <div className="member-card-footer">
                  <button
                    onClick={() => setPrimaryCaregiver(member.id)}
                    className="btn btn-outline btn-sm btn-set-primary"
                  >
                    <Crown size={13} />
                    <span>Designate as Primary Caregiver</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Demonstration Notice Box */}
      <div className="demo-access-notice-box">
        <div className="notice-icon">
          <AlertCircle size={20} className="text-ocean" />
        </div>
        <div>
          <h4>Evaluation Note on Shared Care Access</h4>
          <p>
            CareCircle uses an authorized multi-user model designed to bridge elderly individuals and their support network. The demo passcode mechanism (passcode: <code>2468</code>) simulates how role-based permissions display tailored dashboards for family caregivers without requiring complex authentication servers in this hackathon build.
          </p>
        </div>
      </div>
    </div>
  );
};
