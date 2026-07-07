export default function StatCard({ label, value, unit = "" }) {
  return (
    <article className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">
        {value}
        {unit}
      </strong>
    </article>
  );
}
