import React from "react";
import { User } from "lucide-react";

/**
 * InitialsAvatar — renders a colored circle with the user's initials,
 * or a user silhouette icon if no name is available.
 * Falls back to displaying the actual avatar image if a URL/data URI is provided.
 */
export const InitialsAvatar = ({ name = "", avatar = null, size = 40, className = "" }) => {
  // If a real avatar is provided, render the image
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name || "Profile"}
        className={className}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
      />
    );
  }

  // Extract initials from name
  const getInitials = (n) => {
    if (!n || !n.trim()) return null;
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: initials
      ? "linear-gradient(135deg, var(--ocean-blue, #176B87), var(--turquoise, #20B8AA))"
      : "var(--muted-blue-bg, #DDEEF3)",
    color: initials ? "#fff" : "var(--ocean-blue, #176B87)",
    fontSize: Math.max(10, Math.round(size * 0.38)) + "px",
    fontWeight: "700",
    letterSpacing: "0.03em",
    userSelect: "none"
  };

  return (
    <div style={containerStyle} className={className} aria-label={name || "No name set"}>
      {initials ? (
        <span>{initials}</span>
      ) : (
        <User size={Math.max(14, Math.round(size * 0.5))} />
      )}
    </div>
  );
};
