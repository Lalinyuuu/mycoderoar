import { toast } from "sonner";

const USERS = [
  { id: "u1", name: "Yuuu", email: "demo@hh.dev", role: "member" },
  { id: "u2", name: "Thompson P.", email: "admin@hh.dev", role: "admin" },
  { id: "u3", name: "Jacob Lash", email: "jacob@hh.dev", role: "member" },
];

export default function AdminUsers() {
  const onPromote = (u) => toast.success(`Promoted ${u.name} to admin`);
  const onDeactivate = (u) => toast.success(`Deactivated ${u.name}`);

  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="text-lg font-semibold mb-4">Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-600">
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Role</th>
              <th className="py-2 pr-3"></th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="py-2 pr-3">{u.name}</td>
                <td className="py-2 pr-3">{u.email}</td>
                <td className="py-2 pr-3 capitalize">{u.role}</td>
                <td className="py-2 pr-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onPromote(u)}
                      className="rounded-full border px-3 py-1 hover:bg-neutral-50"
                    >
                      Promote
                    </button>
                    <button
                      onClick={() => onDeactivate(u)}
                      className="rounded-full border px-3 py-1 text-rose-600 hover:bg-rose-50"
                    >
                      Deactivate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}