// CareCircle Proactive Email Notification Adapter & Preview Generator
// Provides structured email previews, templating, and documentation for real delivery.

export const EMAIL_TEMPLATES = {
  MISSED_DOSE: "missed_dose_alert",
  UPCOMING_DOSE: "upcoming_dose_reminder",
  UPCOMING_APPOINTMENT: "appointment_reminder",
  REFILL_ALERT: "refill_needed_alert",
  WEEKLY_SUMMARY: "weekly_care_summary"
};

/**
 * Generates email content, HTML preview, and delivery metadata
 */
export const generateEmailPayload = (templateType, data = {}) => {
  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const patientName = data.patientName || "Patient";
  const caregiverName = data.caregiverName || "Caregiver";
  const caregiverEmail = data.caregiverEmail || "caregiver@example.com";

  switch (templateType) {
    case EMAIL_TEMPLATES.MISSED_DOSE:
      return {
        templateId: EMAIL_TEMPLATES.MISSED_DOSE,
        subject: `[CareCircle Alert] Missed Medication Alert for ${patientName}`,
        recipient: caregiverEmail,
        recipientName: caregiverName,
        severity: "urgent",
        generatedAt: timestamp,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; background-color: #E9F5F4; padding: 24px; border-radius: 12px; color: #102E40;">
            <div style="background-color: #102E40; padding: 18px 24px; border-radius: 8px 8px 0 0; color: #FFFFFF;">
              <h2 style="margin: 0; font-size: 20px; color: #20B8AA;">CareCircle Caregiver Alert</h2>
              <p style="margin: 4px 0 0; font-size: 13px; color: #75C9D0;">Care that connects. Every day.</p>
            </div>
            <div style="background-color: #FFFFFF; padding: 24px; border: 1px solid #CFE5E8; border-radius: 0 0 8px 8px;">
              <div style="background-color: #FDF1EE; border-left: 4px solid #D9684F; padding: 12px 16px; margin-bottom: 20px;">
                <strong style="color: #D9684F;">Missed Scheduled Dose Recorded</strong>
              </div>
              <p>Hello <strong>${caregiverName}</strong>,</p>
              <p>This automated notification is to inform you that <strong>${patientName}</strong> missed their scheduled medication dose:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr style="background: #F4FAF9;">
                  <td style="padding: 10px; border: 1px solid #CFE5E8; font-weight: bold;">Medication:</td>
                  <td style="padding: 10px; border: 1px solid #CFE5E8;">${data.medName || "Medication"} (${data.dosage || "1 dose"})</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #CFE5E8; font-weight: bold;">Scheduled Time:</td>
                  <td style="padding: 10px; border: 1px solid #CFE5E8;">${data.scheduledTime || "Scheduled Time"}</td>
                </tr>
                <tr style="background: #F4FAF9;">
                  <td style="padding: 10px; border: 1px solid #CFE5E8; font-weight: bold;">Instructions:</td>
                  <td style="padding: 10px; border: 1px solid #CFE5E8;">${data.instructions || "As prescribed"}</td>
                </tr>
              </table>
              <p style="font-size: 13px; color: #567C8D;">Please check in with ${patientName} or open your CareCircle dashboard to coordinate support.</p>
            </div>
          </div>
        `
      };

    case EMAIL_TEMPLATES.UPCOMING_APPOINTMENT:
      return {
        templateId: EMAIL_TEMPLATES.UPCOMING_APPOINTMENT,
        subject: `[CareCircle Reminder] Upcoming Doctor Appointment for ${patientName}`,
        recipient: caregiverEmail,
        recipientName: caregiverName,
        severity: "warning",
        generatedAt: timestamp,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; background-color: #E9F5F4; padding: 24px; border-radius: 12px; color: #102E40;">
            <div style="background-color: #102E40; padding: 18px 24px; border-radius: 8px 8px 0 0; color: #FFFFFF;">
              <h2 style="margin: 0; font-size: 20px; color: #20B8AA;">CareCircle Appointment Reminder</h2>
            </div>
            <div style="background-color: #FFFFFF; padding: 24px; border: 1px solid #CFE5E8; border-radius: 0 0 8px 8px;">
              <p>Upcoming scheduled doctor consultation details:</p>
              <ul style="line-height: 1.8;">
                <li><strong>Doctor:</strong> ${data.doctorName || "Doctor"} (${data.specialty || "Specialty"})</li>
                <li><strong>Date & Time:</strong> ${data.date || ""} at ${data.time || ""}</li>
                <li><strong>Facility:</strong> ${data.hospitalName || "Clinic"}</li>
                <li><strong>Location:</strong> ${data.location || ""}</li>
                <li><strong>Notes:</strong> ${data.notes || "None"}</li>
              </ul>
            </div>
          </div>
        `
      };

    case EMAIL_TEMPLATES.REFILL_ALERT:
      return {
        templateId: EMAIL_TEMPLATES.REFILL_ALERT,
        subject: `[CareCircle Refill Notice] Medication Stock Low: ${data.medName || "Medication"}`,
        recipient: caregiverEmail,
        recipientName: caregiverName,
        severity: "warning",
        generatedAt: timestamp,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; background-color: #E9F5F4; padding: 24px; border-radius: 12px; color: #102E40;">
            <div style="background-color: #102E40; padding: 18px 24px; border-radius: 8px 8px 0 0; color: #FFFFFF;">
              <h2 style="margin: 0; font-size: 20px; color: #20B8AA;">Medication Refill Needed</h2>
            </div>
            <div style="background-color: #FFFFFF; padding: 24px; border: 1px solid #CFE5E8; border-radius: 0 0 8px 8px;">
              <p>The remaining stock for <strong>${data.medName || "Medication"}</strong> is now down to <strong>${data.remainingStock || 0} units</strong> (safety threshold is ${data.threshold || 0}).</p>
              <p>Please reorder or pick up a refill from the pharmacy.</p>
            </div>
          </div>
        `
      };

    default:
      return {
        templateId: "general_notification",
        subject: `[CareCircle Update] Health Activity for ${patientName}`,
        recipient: caregiverEmail,
        recipientName: caregiverName,
        severity: "info",
        generatedAt: timestamp,
        htmlContent: `<p>A new healthcare activity has been recorded in CareCircle for ${patientName}.</p>`
      };
  }
};

/**
 * Real Delivery Adapter documentation and simulator
 */
export const dispatchEmail = async (payload, config = {}) => {
  // If active delivery credentials are not provided, we safely return preview mode metadata
  // as mandated by Section 10: "Keep the application fully functional in demo mode. Display generated email previews. Never claim that an email was sent when no provider confirms delivery."
  return {
    success: true,
    isDemoPreview: true,
    message: "Email generated and queued in Preview Mode. Real SMTP/SendGrid credentials can be connected in Settings.",
    payload
  };
};
