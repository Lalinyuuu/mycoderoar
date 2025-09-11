// src/pages/member/reset_password.jsx
import { useState } from "react";

export default function ResetPasswordPage() {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [okPwd, setOkPwd] = useState("");

  function onSubmit(e) {
    e.preventDefault();

    alert("Password updated (mock).");
  }

  return (
    <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border">
      <h2 className="text-xl font-semibold mb-6">Reset password</h2>

      <form onSubmit={onSubmit} className="space-y-5 max-w-lg">
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Current password</label>
          <input
            type="password"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
            className="w-full rounded-lg border px-4 h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">New password</label>
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            className="w-full rounded-lg border px-4 h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Confirm new password</label>
          <input
            type="password"
            value={okPwd}
            onChange={(e) => setOkPwd(e.target.value)}
            className="w-full rounded-lg border px-4 h-11"
          />
        </div>

        <button className="rounded-full bg-black text-white px-6 h-11">Save</button>
      </form>
    </div>
  );
}