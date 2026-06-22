type StatCardProps = {
  label: string;
  value: string | number;
  detail: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <article className="card">
      <p>{label}</p>
      <div className="metric">{value}</div>
      <p>{detail}</p>
    </article>
  );
}
