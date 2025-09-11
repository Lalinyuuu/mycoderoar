import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const DEMO_MEMBER = {
  email: "demo@hh.dev",
  password: "Demo-HH_2024#98Lk",
};

export const DEMO_ADMIN = {
  email: "admin@hh.dev",
  password: "Admin-HH_2024#98Lk",
};

const STORAGE_KEY = "hh_user";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

 
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);


  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [user]);


  const login = async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 200));

    const isMember =
      email === DEMO_MEMBER.email && password === DEMO_MEMBER.password;
    const isAdmin =
      email === DEMO_ADMIN.email && password === DEMO_ADMIN.password;

    if (!isMember && !isAdmin) {
      const err = new Error("Wrong email or password");
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    const base = {
      id: isAdmin ? "u_admin" : "u_member",
      name: isAdmin ? "Yuuu" : "Yuuu",
      username: isAdmin ? "Yuuu" : "yuuu.cute",
      email,
      role: isAdmin ? "admin" : "member",
      avatar: isAdmin
        ? "/images/avatar/profile_admin.png"
        : "/images/avatar/profile_admin.png", 
      notifications: [
        {
          id: "n1",
          actorName: "Thompson P.",
          actorAvatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=64&auto=format&fit=crop",
          text: "Published new article.",
          time: "2 hours ago",
          read: false,
        },
        {
          id: "n2",
          actorName: "Jacob Lash",
          actorAvatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=64&auto=format&fit=crop",
          text: "Commented on the article you have commented on.",
          time: "12 September 2024 at 18:30",
          read: false,
        },
      ],
    };

    setUser(base);
    return base;
  };

  const logout = () => setUser(null);

  const updateProfile = async ({ name, username, avatarDataUrl }) => {
    await new Promise((r) => setTimeout(r, 120));
    setUser((u) => {
      if (!u) return u;
      return {
        ...u,
        name: name ?? u.name,
        username: username ?? u.username,
        avatar: avatarDataUrl ?? u.avatar,
      };
    });
  };

  const markNotificationsRead = () => {
    setUser((u) =>
      u
        ? {
            ...u,
            notifications: u.notifications.map((n) => ({ ...n, read: true })),
          }
        : u
    );
  };

  const value = useMemo(
    () => ({ user, login, logout, updateProfile, markNotificationsRead }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}