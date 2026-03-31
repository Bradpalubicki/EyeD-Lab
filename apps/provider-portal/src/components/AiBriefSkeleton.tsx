export default function AiBriefSkeleton() {
  return (
    <div className="glass-card" style={{ padding: "24px", border: "1px solid var(--teal-dim)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" }}>
        <div className="skeleton" style={{ height: "16px", width: "160px", borderRadius: "6px" }} />
        <div className="skeleton" style={{ height: "22px", width: "100px", borderRadius: "100px" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
        <div className="skeleton" style={{ height: "13px", width: "100%", borderRadius: "4px" }} />
        <div className="skeleton" style={{ height: "13px", width: "88%", borderRadius: "4px" }} />
        <div className="skeleton" style={{ height: "13px", width: "72%", borderRadius: "4px" }} />
        <div className="skeleton" style={{ height: "13px", width: "80%", borderRadius: "4px" }} />
      </div>
      <div className="skeleton" style={{ height: "12px", width: "140px", borderRadius: "4px", marginBottom: "10px" }} />
      <div className="skeleton" style={{ height: "48px", width: "100%", borderRadius: "8px" }} />
    </div>
  );
}
