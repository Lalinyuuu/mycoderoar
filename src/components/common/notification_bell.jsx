import { useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/auth_context.jsx";

export default function NotificationBell() {
  const { user, markNotificationsRead } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border">
        <Bell className="h-5 w-5" />
      </button>
    );
  }

  const unread = user.notifications?.some((n) => !n.read);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markNotificationsRead();
        }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread && (
          <span className="absolute right-2 top-2 inline-block h-2 w-2 rounded-full bg-rose-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[320px] rounded-2xl border bg-white p-3 shadow-xl">
          {(user.notifications ?? []).map((n) => (
            <div key={n.id} className="flex gap-3 rounded-xl p-3 hover:bg-gray-50">
              <img
                src={n.actorAvatar}
                className="h-9 w-9 rounded-full object-cover"
                alt={n.actorName}
              />
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{n.actorName}</span>{" "}
                  <span className="text-gray-700">{n.text}</span>
                </p>
                <p className="mt-1 text-xs text-gray-500">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}