import React, { useState } from "react";
import { PackagePlus, X, AlertTriangle } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const RefillModal = ({ isOpen, onClose, medication }) => {
  const { refillMedication, updateMedicationStock } = useCare();
  const [addedPills, setAddedPills] = useState(30);

  if (!isOpen || !medication) return null;

  const handleRefillSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(addedPills, 10) || 0;
    if (count > 0) {
      refillMedication(medication.id, count);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <PackagePlus size={22} className="text-turquoise" />
            <h3 className="modal-title">Replenish Supply: {medication.name}</h3>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleRefillSubmit}>
          <div className="refill-modal-body">
            <div className="current-stock-info">
              <span className="stock-label">Current Remaining Stock:</span>
              <span className={`stock-value ${medication.stockQuantity <= medication.lowStockThreshold ? "text-coral font-bold" : ""}`}>
                {medication.stockQuantity} pills
              </span>
            </div>

            {medication.stockQuantity <= medication.lowStockThreshold && (
              <div className="low-stock-warning-box">
                <AlertTriangle size={16} />
                <span>Stock is below safety threshold ({medication.lowStockThreshold} pills). Refill is recommended.</span>
              </div>
            )}

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Quantity to Add (Pills)</label>
              <input
                type="number"
                min="1"
                max="500"
                value={addedPills}
                onChange={(e) => setAddedPills(e.target.value)}
                className="form-control"
                autoFocus
              />
            </div>

            <div className="quick-add-presets">
              <span>Quick Add: </span>
              <button
                type="button"
                onClick={() => setAddedPills(15)}
                className="btn btn-outline btn-sm"
              >
                +15
              </button>
              <button
                type="button"
                onClick={() => setAddedPills(30)}
                className="btn btn-outline btn-sm"
              >
                +30 (1 Mo)
              </button>
              <button
                type="button"
                onClick={() => setAddedPills(90)}
                className="btn btn-outline btn-sm"
              >
                +90 (3 Mo)
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Refill & Reset Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
