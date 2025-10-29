import { useEffect } from "react";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Delete article",
  description = "Do you want to delete this article?",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = true,
}) {
  // ปิดด้วย ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      onMouseDown={onClose}
    >
      <div
        className="bg-gradient-to-br from-purple-3 via-purple-1 to-emerald-2 shadow-2xl rounded-2xl border-2 border-purple-4 p-6 max-w-md w-full"
        onMouseDown={(e) => e.stopPropagation()} // กันปิดเวลา click ในกล่อง
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <h3 className={`text-xl font-bold ${isDestructive ? 'error' : 'emerald-6'}`}>{title}</h3>
            <button
              aria-label="Close"
              className="rounded-full p-2 gray-8 hover:bg-purple-2 hover:purple-8 transition-colors"
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className={`text-sm mb-6 leading-relaxed font-medium ${isDestructive ? 'error' : 'emerald-5'}`}>{description}</p>

          <div className="flex justify-center gap-3 mt-auto">
            <button
              className="rounded-full border-2 border-purple-3 bg-light-1 px-6 py-2.5 text-sm font-bold gray-8 hover:bg-purple-1 hover:border-purple-5 hover:purple-8 transition-all shadow-sm"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className={`rounded-full px-6 py-2.5 text-sm font-bold text-light-1 transition-all shadow-md ${isDestructive ? 'bg-gradient-to-r from-error to-error hover:from-error hover:to-error' : 'bg-gradient-to-r from-emerald-5 to-emerald-6 hover:from-emerald-6 hover:to-emerald-7'}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}