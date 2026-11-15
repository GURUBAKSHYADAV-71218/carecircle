import React, { useState } from "react";
import { CareProvider, useCare } from "./context/CareContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { MobileNav } from "./components/layout/MobileNav";
import { Toast } from "./components/layout/Toast";

// Pages
import { DashboardPage } from "./components/pages/DashboardPage";
import { MedicationsPage } from "./components/pages/MedicationsPage";
import { AppointmentsPage } from "./components/pages/AppointmentsPage";
import { CareTeamPage } from "./components/pages/CareTeamPage";
import { NotificationsPage } from "./components/pages/NotificationsPage";
import { TimelinePage } from "./components/pages/TimelinePage";
import { ReportsPage } from "./components/pages/ReportsPage";
import { SettingsPage } from "./components/pages/SettingsPage";

// Modals
import { AddMedicationModal } from "./components/modals/AddMedicationModal";
import { EditMedicationModal } from "./components/modals/EditMedicationModal";
import { AddAppointmentModal } from "./components/modals/AddAppointmentModal";
import { EditAppointmentModal } from "./components/modals/EditAppointmentModal";
import { AddCareTeamModal } from "./components/modals/AddCareTeamModal";
import { EditCareTeamModal } from "./components/modals/EditCareTeamModal";
import { CaregiverPasscodeModal } from "./components/modals/CaregiverPasscodeModal";
import { EmailPreviewModal } from "./components/modals/EmailPreviewModal";
import { RefillModal } from "./components/modals/RefillModal";
import { ConfirmModal } from "./components/modals/ConfirmModal";
import { SetupProfileModal } from "./components/modals/SetupProfileModal";

const AppContent = () => {
  const [activePage, setActivePage] = useState("dashboard");

  // Modals state
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [refillMed, setRefillMed] = useState(null);

  const [isAddAptOpen, setIsAddAptOpen] = useState(false);
  const [editingApt, setEditingApt] = useState(null);

  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);

  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [isSetupProfileOpen, setIsSetupProfileOpen] = useState(false);

  // Generic confirmation modal state
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    confirmVariant: "btn-danger",
    onConfirm: () => {}
  });

  const {
    patient,
    deleteMedication,
    deleteAppointment,
    removeCareTeamMember,
    resetAllDemoData,
    appointments,
    createNotification,
    settings
  } = useCare();

  // Show setup modal automatically on first render if patient has no name
  const [hasShownSetup, setHasShownSetup] = useState(() => {
    // Only auto-show once per session
    return false;
  });

  React.useEffect(() => {
    if (!hasShownSetup && (!patient.name || patient.name.trim() === "")) {
      setIsSetupProfileOpen(true);
      setHasShownSetup(true);
    }
  }, [patient.name, hasShownSetup]);

  // Background proactive reminder scheduler
  React.useEffect(() => {
    const checkUpcomingReminders = () => {
      if (!settings.notificationPrefs?.appointments) return;
      // Reminder logic placeholder (appointments already handled by context)
    };

    checkUpcomingReminders();
    const interval = setInterval(checkUpcomingReminders, 60000);
    return () => clearInterval(interval);
  }, [appointments, settings]);

  // Confirmation triggers
  const promptDeleteMedication = (med) => {
    setConfirmModalConfig({
      isOpen: true,
      title: `Delete Medication: ${med.name}`,
      message: `Are you sure you want to remove ${med.name} from the active medication regimen? This will also remove any pending doses.`,
      confirmLabel: "Delete Medication",
      confirmVariant: "btn-danger",
      onConfirm: () => deleteMedication(med.id)
    });
  };

  const promptDeleteAppointment = (apt) => {
    setConfirmModalConfig({
      isOpen: true,
      title: `Cancel Appointment: ${apt.doctorName}`,
      message: `Are you sure you want to cancel the scheduled consultation with ${apt.doctorName} on ${apt.date}?`,
      confirmLabel: "Cancel Appointment",
      confirmVariant: "btn-danger",
      onConfirm: () => deleteAppointment(apt.id)
    });
  };

  const promptRemoveTeamMember = (member) => {
    setConfirmModalConfig({
      isOpen: true,
      title: `Remove Member: ${member.name}`,
      message: `Are you sure you want to remove ${member.name} from the Care Team? They will no longer have access to this care circle.`,
      confirmLabel: "Remove Member",
      confirmVariant: "btn-danger",
      onConfirm: () => removeCareTeamMember(member.id)
    });
  };

  const promptResetData = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Reset All Data",
      message: "Are you sure you want to reset all data? This will clear all medications, appointments, care team members, and patient information permanently.",
      confirmLabel: "Reset Everything",
      confirmVariant: "btn-danger",
      onConfirm: () => resetAllDemoData()
    });
  };

  return (
    <div className="app-container">
      {/* Toast Alert System */}
      <Toast />

      {/* Fixed Left Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        openPasscodeModal={() => setIsPasscodeModalOpen(true)}
        onOpenSetupProfile={() => setIsSetupProfileOpen(true)}
      />

      <div className="main-wrapper">
        {/* Top Header */}
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          openPasscodeModal={() => setIsPasscodeModalOpen(true)}
          onOpenSetupProfile={() => setIsSetupProfileOpen(true)}
        />

        {/* Main Workspace Content */}
        <main className="main-content">
          {activePage === "dashboard" && (
            <DashboardPage
              onNavigate={(page) => setActivePage(page)}
              onOpenAddMedModal={() => setIsAddMedOpen(true)}
              onOpenAddAptModal={() => setIsAddAptOpen(true)}
              onOpenRefillModal={(med) => setRefillMed(med)}
              onOpenPasscodeModal={() => setIsPasscodeModalOpen(true)}
              onOpenSetupProfile={() => setIsSetupProfileOpen(true)}
            />
          )}

          {activePage === "medications" && (
            <MedicationsPage
              onOpenAddModal={() => setIsAddMedOpen(true)}
              onOpenEditModal={(med) => setEditingMed(med)}
              onOpenDeleteConfirm={promptDeleteMedication}
              onOpenRefillModal={(med) => setRefillMed(med)}
            />
          )}

          {activePage === "appointments" && (
            <AppointmentsPage
              onOpenAddModal={() => setIsAddAptOpen(true)}
              onOpenEditModal={(apt) => setEditingApt(apt)}
              onOpenDeleteConfirm={promptDeleteAppointment}
            />
          )}

          {activePage === "care-team" && (
            <CareTeamPage
              onOpenAddModal={() => setIsAddTeamOpen(true)}
              onOpenEditModal={(member) => setEditingTeamMember(member)}
              onOpenDeleteConfirm={promptRemoveTeamMember}
              onOpenPasscodeModal={() => setIsPasscodeModalOpen(true)}
            />
          )}

          {activePage === "notifications" && <NotificationsPage />}

          {activePage === "timeline" && <TimelinePage />}

          {activePage === "reports" && <ReportsPage />}

          {activePage === "settings" && (
            <SettingsPage
              onOpenResetConfirm={promptResetData}
              onOpenSetupProfile={() => setIsSetupProfileOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Responsive Mobile Bottom Navigation */}
      <MobileNav activePage={activePage} setActivePage={setActivePage} />

      {/* Modals Collection */}
      <SetupProfileModal
        isOpen={isSetupProfileOpen}
        onClose={() => setIsSetupProfileOpen(false)}
      />

      <AddMedicationModal
        isOpen={isAddMedOpen}
        onClose={() => setIsAddMedOpen(false)}
      />

      <EditMedicationModal
        isOpen={!!editingMed}
        medication={editingMed}
        onClose={() => setEditingMed(null)}
      />

      <AddAppointmentModal
        isOpen={isAddAptOpen}
        onClose={() => setIsAddAptOpen(false)}
      />

      <EditAppointmentModal
        isOpen={!!editingApt}
        appointment={editingApt}
        onClose={() => setEditingApt(null)}
      />

      <AddCareTeamModal
        isOpen={isAddTeamOpen}
        onClose={() => setIsAddTeamOpen(false)}
      />

      <EditCareTeamModal
        isOpen={!!editingTeamMember}
        member={editingTeamMember}
        onClose={() => setEditingTeamMember(null)}
      />

      <CaregiverPasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
      />

      <RefillModal
        isOpen={!!refillMed}
        medication={refillMed}
        onClose={() => setRefillMed(null)}
      />

      <EmailPreviewModal />

      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmLabel={confirmModalConfig.confirmLabel}
        confirmVariant={confirmModalConfig.confirmVariant}
        onConfirm={confirmModalConfig.onConfirm}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default function App() {
  return (
    <CareProvider>
      <AppContent />
    </CareProvider>
  );
}
