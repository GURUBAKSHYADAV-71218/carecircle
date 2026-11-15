import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { storageService, initializeStorage } from "../services/storage.js";
import { generateEmailPayload, EMAIL_TEMPLATES } from "../services/emailService.js";

const CareContext = createContext(null);

export const CareProvider = ({ children }) => {
  // Ensure storage is initialized and demo data migrated
  useEffect(() => {
    initializeStorage();
  }, []);

  // State instances from LocalStorage
  const [patient, setPatient] = useState(() => storageService.getPatient());
  const [careTeam, setCareTeam] = useState(() => storageService.getCareTeam());
  const [medications, setMedications] = useState(() => storageService.getMedications());
  const [doseRecords, setDoseRecords] = useState(() => storageService.getDoseRecords());
  const [appointments, setAppointments] = useState(() => storageService.getAppointments());
  const [checklist, setChecklist] = useState(() => storageService.getChecklist());
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());
  const [timeline, setTimeline] = useState(() => storageService.getTimeline());
  const [settings, setSettings] = useState(() => storageService.getSettings());

  // UI States
  const [viewMode, setViewMode] = useState("patient"); // 'patient' | 'caregiver'
  const [toasts, setToasts] = useState([]);
  const [emailPreviewModalData, setEmailPreviewModalData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Toast notifier
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Timeline logger — handles empty patient name gracefully
  const logTimelineEvent = useCallback((title, description, category = "system", author = null) => {
    const patientLabel = patient.name || "Patient";
    const currentAuthor = author || (viewMode === "caregiver" ? "Care Team" : patientLabel);
    const newEvent = {
      id: `time-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      description,
      category,
      author: currentAuthor,
      timestamp: new Date().toISOString()
    };
    setTimeline((prev) => {
      const updated = [newEvent, ...prev];
      storageService.setTimeline(updated);
      return updated;
    });
  }, [viewMode, patient.name]);

  // Notification creator
  const createNotification = useCallback((title, description, severity = "info", category = "general") => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      description,
      severity,
      category,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      storageService.setNotifications(updated);
      return updated;
    });
  }, []);

  // Patient profile updates
  const updatePatient = useCallback((updatedProfile) => {
    setPatient(updatedProfile);
    storageService.setPatient(updatedProfile);
    logTimelineEvent("Patient Healthcare Profile Updated", "Care profile details and notes were modified.", "profile");
    showToast("Patient profile updated successfully", "success");
  }, [logTimelineEvent, showToast]);

  // Caregiver view authentication
  const authenticateCaregiver = useCallback((passcode) => {
    if (passcode === settings.demoPasscode) {
      setViewMode("caregiver");
      showToast("Switched to Caregiver View", "success");
      logTimelineEvent("Caregiver Access Authenticated", "Caregiver dashboard unlocked via passcode.", "caregiver", "Care Team");
      return true;
    }
    showToast("Invalid passcode. Default is 2468.", "error");
    return false;
  }, [settings.demoPasscode, showToast, logTimelineEvent]);

  const switchBackToPatient = useCallback(() => {
    setViewMode("patient");
    showToast("Switched to Patient View", "info");
  }, [showToast]);

  // Today string helper
  const getTodayDateStr = () => new Date().toISOString().split("T")[0];

  // Adherence and statistics computations
  const adherenceStats = useMemo(() => {
    const todayStr = getTodayDateStr();

    // Today's doses
    const todayDoses = doseRecords.filter((d) => d.date === todayStr);
    const todayTaken = todayDoses.filter((d) => d.status === "taken").length;
    const todayMissed = todayDoses.filter((d) => d.status === "missed").length;
    const todayPending = todayDoses.filter((d) => d.status === "pending").length;
    const todayEvaluated = todayTaken + todayMissed;
    // Don't fabricate 100% when there is zero data
    const todayAdherence = todayEvaluated > 0 ? Math.round((todayTaken / todayEvaluated) * 100) : 0;

    // Weekly doses (past 7 days including today)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyDoses = doseRecords.filter((d) => {
      const recordDate = new Date(d.date + "T00:00:00");
      return recordDate >= sevenDaysAgo;
    });

    const weeklyTaken = weeklyDoses.filter((d) => d.status === "taken").length;
    const weeklyMissed = weeklyDoses.filter((d) => d.status === "missed").length;
    const weeklyEvaluated = weeklyTaken + weeklyMissed;
    // Don't fabricate 100% when there is zero data
    const weeklyAdherence = weeklyEvaluated > 0 ? Math.round((weeklyTaken / weeklyEvaluated) * 100) : 0;
    const hasAdherenceData = weeklyEvaluated > 0 || todayEvaluated > 0;

    // Day-by-day weekly adherence chart data (last 7 days in chronological order)
    const weeklyChartData = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);
      const dateStr = targetDate.toISOString().split("T")[0];
      const dayName = targetDate.toLocaleDateString("en-US", { weekday: "short" });
      const dayLabel = targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const dayRecords = doseRecords.filter((d) => d.date === dateStr);
      const dayTaken = dayRecords.filter((d) => d.status === "taken").length;
      const dayMissed = dayRecords.filter((d) => d.status === "missed").length;
      const dayPending = dayRecords.filter((d) => d.status === "pending").length;
      const dayTotal = dayTaken + dayMissed + dayPending;
      const dayEval = dayTaken + dayMissed;
      const dayAdherence = dayEval > 0 ? Math.round((dayTaken / dayEval) * 100) : 0;

      weeklyChartData.push({
        date: dateStr,
        dayName,
        dayLabel,
        isToday: i === 0,
        taken: dayTaken,
        missed: dayMissed,
        pending: dayPending,
        total: dayTotal,
        adherence: dayAdherence
      });
    }

    return {
      todayDoses,
      todayTaken,
      todayMissed,
      todayPending,
      todayAdherence,
      weeklyTaken,
      weeklyMissed,
      weeklyAdherence,
      hasAdherenceData,
      weeklyChartData
    };
  }, [doseRecords]);

  // Micro-feature 1: Quick Dose Action
  const markNextPendingDoseTaken = useCallback(() => {
    const todayStr = getTodayDateStr();
    const pendingDose = doseRecords.find((d) => d.date === todayStr && d.status === "pending");

    if (!pendingDose) {
      showToast("All scheduled doses for today are already completed!", "info");
      return;
    }

    markDoseTaken(pendingDose.id);
  }, [doseRecords, showToast]);

  // Mark dose taken
  const markDoseTaken = useCallback((doseId) => {
    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const targetDose = doseRecords.find((d) => d.id === doseId);
    const medId = targetDose ? targetDose.medId : null;
    const medName = targetDose ? targetDose.medName : "Medication";

    setDoseRecords((prev) => {
      const updated = prev.map((d) => {
        if (d.id === doseId) {
          return { ...d, status: "taken", takenAt: timeStr };
        }
        return d;
      });
      storageService.setDoseRecords(updated);
      return updated;
    });

    // Reduce stock by 1 for the taken medication (Micro-feature 3)
    if (medId) {
      setMedications((prev) => {
        const updatedMeds = prev.map((m) => {
          if (m.id === medId && m.stockQuantity > 0) {
            const newQty = m.stockQuantity - 1;
            const needsRefill = newQty <= m.lowStockThreshold;

            if (needsRefill && !m.refillNeeded) {
              createNotification(
                `Low Stock Alert: ${m.name}`,
                `Remaining stock is down to ${newQty} pills. Please refill soon.`,
                "urgent",
                "medication"
              );
            }

            return {
              ...m,
              stockQuantity: newQty,
              refillNeeded: needsRefill
            };
          }
          return m;
        });
        storageService.setMedications(updatedMeds);
        return updatedMeds;
      });
    }

    logTimelineEvent(`Medication Dose Taken: ${medName}`, `Scheduled dose confirmed at ${timeStr}.`, "medication");
    createNotification(`Medication Taken: ${medName}`, `Dose taken on schedule at ${timeStr}.`, "success", "medication");
    showToast(`Marked ${medName} as Taken!`, "success");
  }, [doseRecords, logTimelineEvent, createNotification, showToast]);

  // Mark dose missed
  const markDoseMissed = useCallback((doseId) => {
    const targetDose = doseRecords.find((d) => d.id === doseId);

    setDoseRecords((prev) => {
      const updated = prev.map((d) => {
        if (d.id === doseId) {
          return { ...d, status: "missed", takenAt: null };
        }
        return d;
      });
      storageService.setDoseRecords(updated);
      return updated;
    });

    if (targetDose) {
      const medName = targetDose.medName;
      logTimelineEvent(`Missed Medication Dose: ${medName}`, `Scheduled dose at ${targetDose.scheduledTime} was marked as missed.`, "medication");
      createNotification(
        `Missed Dose Warning: ${medName}`,
        `Dose scheduled for ${targetDose.scheduledTime} was missed. Caregiver alerted.`,
        "urgent",
        "medication"
      );

      // Generate caregiver email preview payload
      const emailPayload = generateEmailPayload(EMAIL_TEMPLATES.MISSED_DOSE, {
        patientName: patient.name || "Patient",
        caregiverName: patient.primaryCaregiver || patient.emergencyContact?.name || "Caregiver",
        caregiverEmail: patient.emergencyContact?.email || "",
        medName: targetDose.medName,
        dosage: targetDose.dosage,
        scheduledTime: targetDose.scheduledTime
      });

      setEmailPreviewModalData(emailPayload);
      showToast(`Marked ${medName} as Missed. Caregiver alert generated.`, "warning");
    }
  }, [doseRecords, logTimelineEvent, createNotification, showToast, patient]);

  // Add Medication
  const addMedication = useCallback((medData) => {
    const newId = `med-${Date.now()}`;
    const newMed = {
      id: newId,
      ...medData,
      status: "active",
      refillNeeded: Number(medData.stockQuantity) <= Number(medData.lowStockThreshold)
    };

    setMedications((prev) => {
      const updated = [...prev, newMed];
      storageService.setMedications(updated);
      return updated;
    });

    // Generate today's dose records for the new medication
    const todayStr = getTodayDateStr();
    const newDoses = (newMed.scheduleTimes || ["09:00"]).map((time, idx) => ({
      id: `dose-${newId}-${todayStr}-${idx}`,
      medId: newId,
      medName: newMed.name,
      dosage: newMed.dosage,
      scheduledTime: time,
      date: todayStr,
      status: "pending",
      takenAt: null
    }));

    setDoseRecords((prev) => {
      const updated = [...prev, ...newDoses];
      storageService.setDoseRecords(updated);
      return updated;
    });

    logTimelineEvent(`New Medication Added: ${newMed.name}`, `${newMed.dosage}, ${newMed.frequency}.`, "medication");
    showToast(`Added ${newMed.name} to medication schedule`, "success");
  }, [logTimelineEvent, showToast]);

  // Edit Medication
  const updateMedication = useCallback((medData) => {
    setMedications((prev) => {
      const updated = prev.map((m) => {
        if (m.id === medData.id) {
          return {
            ...m,
            ...medData,
            refillNeeded: Number(medData.stockQuantity) <= Number(medData.lowStockThreshold)
          };
        }
        return m;
      });
      storageService.setMedications(updated);
      return updated;
    });

    logTimelineEvent(`Medication Updated: ${medData.name}`, `Schedule or dosage details updated.`, "medication");
    showToast(`Updated ${medData.name}`, "success");
  }, [logTimelineEvent, showToast]);

  // Delete Medication
  const deleteMedication = useCallback((id) => {
    const med = medications.find((m) => m.id === id);
    const medName = med ? med.name : "Medication";

    setMedications((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      storageService.setMedications(updated);
      return updated;
    });

    // Remove pending doses for this med
    setDoseRecords((prev) => {
      const updated = prev.filter((d) => !(d.medId === id && d.status === "pending"));
      storageService.setDoseRecords(updated);
      return updated;
    });

    logTimelineEvent(`Medication Removed: ${medName}`, `Removed from active prescription list.`, "medication");
    showToast(`Deleted ${medName}`, "info");
  }, [medications, logTimelineEvent, showToast]);

  // Pause / Resume Medication
  const togglePauseMedication = useCallback((id) => {
    const targetMed = medications.find((m) => m.id === id);
    if (!targetMed) return;
    const newStatus = targetMed.status === "active" ? "paused" : "active";
    const medName = targetMed.name;

    setMedications((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m));
      storageService.setMedications(updated);
      return updated;
    });

    logTimelineEvent(
      `Medication ${newStatus === "paused" ? "Paused" : "Resumed"}: ${medName}`,
      `Medication status toggled to ${newStatus}.`,
      "medication"
    );
    showToast(`${medName} is now ${newStatus}`, "info");
  }, [medications, logTimelineEvent, showToast]);

  // Stock update & Refill
  const updateMedicationStock = useCallback((id, newQuantity) => {
    const qty = Math.max(0, parseInt(newQuantity, 10) || 0);

    setMedications((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) {
          const needsRefill = qty <= m.lowStockThreshold;
          return {
            ...m,
            stockQuantity: qty,
            refillNeeded: needsRefill
          };
        }
        return m;
      });
      storageService.setMedications(updated);
      return updated;
    });

    showToast("Medication stock updated", "success");
  }, [showToast]);

  const refillMedication = useCallback((id, addedPills = 30) => {
    const targetMed = medications.find((m) => m.id === id);
    const medName = targetMed ? targetMed.name : "Medication";

    setMedications((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            stockQuantity: m.stockQuantity + addedPills,
            refillNeeded: false
          };
        }
        return m;
      });
      storageService.setMedications(updated);
      return updated;
    });

    logTimelineEvent(`Prescription Refilled: ${medName}`, `Added ${addedPills} pills to stock inventory.`, "medication");
    createNotification(`Medication Refilled: ${medName}`, `Supply replenished with ${addedPills} units.`, "success", "medication");
    showToast(`Refilled ${medName} (+${addedPills} units)!`, "success");
  }, [medications, logTimelineEvent, createNotification, showToast]);

  // Appointments Management
  const addAppointment = useCallback((aptData) => {
    const newId = `apt-${Date.now()}`;
    const newApt = {
      id: newId,
      ...aptData,
      status: "upcoming"
    };

    setAppointments((prev) => {
      const updated = [newApt, ...prev];
      storageService.setAppointments(updated);
      return updated;
    });

    logTimelineEvent(`Appointment Scheduled: ${newApt.doctorName}`, `${newApt.specialty} on ${newApt.date} at ${newApt.time}.`, "appointment");
    createNotification(`New Appointment: ${newApt.doctorName}`, `Scheduled for ${newApt.date} at ${newApt.time}.`, "info", "appointment");
    showToast(`Appointment scheduled with ${newApt.doctorName}`, "success");
  }, [logTimelineEvent, createNotification, showToast]);

  const updateAppointment = useCallback((aptData) => {
    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === aptData.id ? { ...a, ...aptData } : a));
      storageService.setAppointments(updated);
      return updated;
    });

    logTimelineEvent(`Appointment Updated: ${aptData.doctorName}`, `Date or notes modified.`, "appointment");
    showToast(`Updated appointment with ${aptData.doctorName}`, "success");
  }, [logTimelineEvent, showToast]);

  const deleteAppointment = useCallback((id) => {
    const apt = appointments.find((a) => a.id === id);
    const doctorName = apt ? apt.doctorName : "Doctor";

    setAppointments((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      storageService.setAppointments(updated);
      return updated;
    });

    logTimelineEvent(`Appointment Cancelled: ${doctorName}`, `Removed from appointment schedule.`, "appointment");
    showToast(`Cancelled appointment with ${doctorName}`, "info");
  }, [appointments, logTimelineEvent, showToast]);

  const markAppointmentCompleted = useCallback((id) => {
    const apt = appointments.find((a) => a.id === id);
    const docName = apt ? apt.doctorName : "Doctor";

    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a));
      storageService.setAppointments(updated);
      return updated;
    });

    logTimelineEvent(`Appointment Completed: ${docName}`, `Consultation marked as completed.`, "appointment");
    showToast(`Marked appointment with ${docName} as completed`, "success");
  }, [appointments, logTimelineEvent, showToast]);

  // Next Upcoming Appointment with countdown
  const nextAppointment = useMemo(() => {
    const upcoming = appointments
      .filter((a) => a.status === "upcoming")
      .sort((a, b) => new Date(`${a.date}T${a.time || "00:00"}`) - new Date(`${b.date}T${b.time || "00:00"}`));

    if (upcoming.length === 0) return null;

    const next = upcoming[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aptDate = new Date(`${next.date}T00:00:00`);
    const diffDays = Math.ceil((aptDate - today) / (1000 * 60 * 60 * 24));

    let countdownText = "";
    if (diffDays === 0) countdownText = "Today";
    else if (diffDays === 1) countdownText = "Tomorrow";
    else if (diffDays > 1) countdownText = `In ${diffDays} days`;
    else countdownText = "Today";

    return {
      ...next,
      daysUntil: diffDays,
      countdownText
    };
  }, [appointments]);

  // Next Pending Dose
  const nextPendingDose = useMemo(() => {
    const todayStr = getTodayDateStr();
    const pendingToday = doseRecords
      .filter((d) => d.date === todayStr && d.status === "pending")
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    return pendingToday.length > 0 ? pendingToday[0] : null;
  }, [doseRecords]);

  // Care Team Operations
  const addCareTeamMember = useCallback((memberData) => {
    const newMember = {
      id: `member-${Date.now()}`,
      ...memberData,
      isPrimary: memberData.isPrimary ?? false,
      accessStatus: "Active"
    };

    setCareTeam((prev) => {
      const updated = [...prev, newMember];
      storageService.setCareTeam(updated);
      return updated;
    });

    logTimelineEvent(`Care Team Member Added: ${newMember.name}`, `Assigned role: ${newMember.role}.`, "caregiver");
    showToast(`Added ${newMember.name} to Care Team`, "success");
  }, [logTimelineEvent, showToast]);

  const updateCareTeamMember = useCallback((memberData) => {
    setCareTeam((prev) => {
      const updated = prev.map((m) => (m.id === memberData.id ? { ...m, ...memberData } : m));
      storageService.setCareTeam(updated);
      return updated;
    });

    showToast(`Updated ${memberData.name}'s details`, "success");
  }, [showToast]);

  const removeCareTeamMember = useCallback((id) => {
    const member = careTeam.find((m) => m.id === id);
    const memberName = member ? member.name : "Member";

    setCareTeam((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      storageService.setCareTeam(updated);
      return updated;
    });

    logTimelineEvent(`Care Team Member Removed: ${memberName}`, `Access revoked.`, "caregiver");
    showToast(`Removed ${memberName} from Care Team`, "info");
  }, [careTeam, logTimelineEvent, showToast]);

  const setPrimaryCaregiver = useCallback((id) => {
    const targetMember = careTeam.find((m) => m.id === id);
    const primaryName = targetMember ? targetMember.name : "";

    setCareTeam((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) {
          return { ...m, isPrimary: true, role: "Primary Caregiver" };
        }
        return { ...m, isPrimary: false };
      });
      storageService.setCareTeam(updated);
      return updated;
    });

    if (primaryName) {
      setPatient((prev) => {
        const updated = { ...prev, primaryCaregiver: primaryName };
        storageService.setPatient(updated);
        return updated;
      });
      logTimelineEvent(`Primary Caregiver Designated: ${primaryName}`, `Assigned primary coordination responsibilities.`, "caregiver");
      showToast(`${primaryName} is now designated Primary Caregiver`, "success");
    }
  }, [careTeam, logTimelineEvent, showToast]);

  // Notification Operations
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      storageService.setNotifications(updated);
      return updated;
    });
  }, []);

  const markNotificationUnread = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: false } : n));
      storageService.setNotifications(updated);
      return updated;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      storageService.setNotifications(updated);
      return updated;
    });
    showToast("All notifications marked as read", "info");
  }, [showToast]);

  const clearNotification = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      storageService.setNotifications(updated);
      return updated;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    storageService.setNotifications([]);
    showToast("Notification inbox cleared", "info");
  }, [showToast]);

  // Daily Checklist Operations
  const toggleChecklistItem = useCallback((id) => {
    setChecklist((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed;
          if (nextState) {
            logTimelineEvent(`Daily Checklist Completed: ${item.task}`, `Marked done by user.`, "checklist");
          }
          return { ...item, completed: nextState };
        }
        return item;
      });
      storageService.setChecklist(updated);
      return updated;
    });
  }, [logTimelineEvent]);

  const resetDailyChecklist = useCallback(() => {
    setChecklist((prev) => {
      const resetList = prev.map((item) => ({ ...item, completed: false }));
      storageService.setChecklist(resetList);
      return resetList;
    });
    logTimelineEvent("Daily Care Checklist Reset", "Checklist reset for new care day.", "checklist");
    showToast("Daily checklist reset for today", "info");
  }, [logTimelineEvent, showToast]);

  // Settings & Preferences Operations
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      storageService.setSettings(updated);
      return updated;
    });
    showToast("Preferences saved successfully", "success");
  }, [showToast]);

  // Reset All Data — clears to clean empty state, never re-seeds fictional data
  const resetAllDemoData = useCallback(() => {
    storageService.resetAllData();
    setPatient(storageService.getPatient());
    setCareTeam(storageService.getCareTeam());
    setMedications(storageService.getMedications());
    setDoseRecords(storageService.getDoseRecords());
    setAppointments(storageService.getAppointments());
    setChecklist(storageService.getChecklist());
    setNotifications(storageService.getNotifications());
    setTimeline(storageService.getTimeline());
    setSettings(storageService.getSettings());
    setViewMode("patient");
    showToast("All data has been reset to a clean state.", "success");
  }, [showToast]);

  const value = {
    patient,
    updatePatient,
    careTeam,
    addCareTeamMember,
    updateCareTeamMember,
    removeCareTeamMember,
    setPrimaryCaregiver,
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
    togglePauseMedication,
    updateMedicationStock,
    refillMedication,
    doseRecords,
    markDoseTaken,
    markDoseMissed,
    markNextPendingDoseTaken,
    adherenceStats,
    nextPendingDose,
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    markAppointmentCompleted,
    nextAppointment,
    checklist,
    toggleChecklistItem,
    resetDailyChecklist,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markNotificationUnread,
    markAllNotificationsRead,
    clearNotification,
    clearAllNotifications,
    createNotification,
    timeline,
    logTimelineEvent,
    settings,
    updateSettings,
    resetAllDemoData,
    viewMode,
    authenticateCaregiver,
    switchBackToPatient,
    toasts,
    removeToast,
    showToast,
    emailPreviewModalData,
    setEmailPreviewModalData,
    searchQuery,
    setSearchQuery
  };

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
};

export const useCare = () => {
  const context = useContext(CareContext);
  if (!context) {
    throw new Error("useCare must be used within a CareProvider");
  }
  return context;
};
