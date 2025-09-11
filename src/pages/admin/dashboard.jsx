export default function AdminDashboard() {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="text-lg font-semibold mb-4">Overview</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Stat label="Total posts" value="6" />
        <Stat label="Total users" value="3" />
        <Stat label="Pending reviews" value="0" />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border bg-[#f9f8f6] p-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-neutral-600">{label}</div>
    </div>
  );
}