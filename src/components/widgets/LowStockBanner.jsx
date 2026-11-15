import React from "react";
import { AlertTriangle, PackagePlus } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const LowStockBanner = ({ onOpenRefillModal }) => {
  const { medications } = useCare();

  const lowStockMeds = medications.filter(
    (m) => m.status === "active" && (m.stockQuantity <= m.lowStockThreshold || m.refillNeeded)
  );

  if (lowStockMeds.length === 0) return null;

  return (
    <div className="low-stock-banner-alert">
      <div className="banner-left">
        <div className="banner-alert-icon">
          <AlertTriangle size={20} className="text-coral" />
        </div>
        <div className="banner-text">
          <h4 className="banner-title">
            Medication Refill Alert ({lowStockMeds.length} items low in stock)
          </h4>
          <p className="banner-desc">
            {lowStockMeds.map((m) => `${m.name} (${m.stockQuantity} pills remaining)`).join(", ")}
          </p>
        </div>
      </div>

      <div className="banner-actions">
        {lowStockMeds.map((m) => (
          <button
            key={m.id}
            onClick={() => onOpenRefillModal(m)}
            className="btn btn-sm btn-soft-coral"
            title={`Replenish stock for ${m.name}`}
          >
            <PackagePlus size={14} />
            <span>Refill {m.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
