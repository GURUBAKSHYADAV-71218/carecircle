import React from "react";
import { Mail, X, Check, AlertCircle, Info, ExternalLink } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const EmailPreviewModal = () => {
  const { emailPreviewModalData, setEmailPreviewModalData, showToast } = useCare();

  if (!emailPreviewModalData) return null;

  const handleSimulateDelivery = () => {
    showToast("Email preview confirmed in Demo Mode.", "info");
    setEmailPreviewModalData(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setEmailPreviewModalData(null)}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <Mail size={22} className="text-turquoise" />
            <h3 className="modal-title">Caregiver Email Preview</h3>
          </div>
          <button
            onClick={() => setEmailPreviewModalData(null)}
            className="btn-close-modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="email-preview-container">
          {/* Demo Banner */}
          <div className="email-demo-banner">
            <Info size={16} />
            <div>
              <strong>Demonstration Email Preview</strong>
              <p>
                This message was compiled by the CareCircle Proactive Notification Engine. In demo mode, it is rendered below for your review. No external delivery credentials were found.
              </p>
            </div>
          </div>

          {/* Email Headers Card */}
          <div className="email-headers-card">
            <div className="email-header-row">
              <span className="email-header-label">To:</span>
              <span className="email-header-val">
                {emailPreviewModalData.recipientName} &lt;{emailPreviewModalData.recipient}&gt;
              </span>
            </div>
            <div className="email-header-row">
              <span className="email-header-label">From:</span>
              <span className="email-header-val">CareCircle Automated Alerts &lt;care-alerts@carecircle.io&gt;</span>
            </div>
            <div className="email-header-row">
              <span className="email-header-label">Subject:</span>
              <span className="email-header-val font-bold">{emailPreviewModalData.subject}</span>
            </div>
            <div className="email-header-row">
              <span className="email-header-label">Timestamp:</span>
              <span className="email-header-val">{emailPreviewModalData.generatedAt}</span>
            </div>
          </div>

          {/* Rendered HTML Email Content */}
          <div className="email-body-preview">
            <div
              className="email-rendered-html"
              dangerouslySetInnerHTML={{ __html: emailPreviewModalData.htmlContent }}
            />
          </div>

          {/* Configuration Guide for Evaluators */}
          <div className="email-config-guide">
            <div className="config-guide-header">
              <AlertCircle size={15} />
              <span>Production Email Adapter Configuration Guide</span>
            </div>
            <p className="config-guide-text">
              To route live outbound emails in production, define these environment variables or configure via Settings:
            </p>
            <pre className="config-code-block">
{`VITE_EMAIL_PROVIDER=sendgrid # (or resend | smtp)
VITE_SMTP_HOST=smtp.sendgrid.net
VITE_SMTP_PORT=587
VITE_SMTP_USER=apikey
VITE_SMTP_PASS=SG.your_verified_api_key_here`}
            </pre>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={() => setEmailPreviewModalData(null)}
            className="btn btn-outline"
          >
            Close Preview
          </button>
          <button
            type="button"
            onClick={handleSimulateDelivery}
            className="btn btn-primary"
          >
            <Check size={16} /> Acknowledge Alert
          </button>
        </div>
      </div>
    </div>
  );
};
