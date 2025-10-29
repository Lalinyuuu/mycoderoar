import { Toaster } from "sonner";

export default function CustomToaster() {
  return (
    <>
      <Toaster
        closeButton
        position="top-center"
        toastOptions={{
          duration: 1200,
          style: {
            borderRadius: '999px',
            border: '2px solid',
            fontWeight: '700',
            fontSize: '14px',
            padding: '12px 24px',
            boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
          },
          classNames: {
            success: 'toast-success',
            error: 'toast-error',
            warning: 'toast-warning',
            info: 'toast-info',
          },
        }}
      />
      <style>{`
        .toast-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          color: white !important;
          border-color: #047857 !important;
        }
        .toast-success::before {
          content: '⚔️ ';
        }
        .toast-success::after {
          content: ' ✨';
        }
        
        .toast-error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
          color: white !important;
          border-color: #b91c1c !important;
        }
        .toast-error::before {
          content: '💀 ';
        }
        .toast-error::after {
          content: ' ⚡';
        }
        
        .toast-warning {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
          color: white !important;
          border-color: #b45309 !important;
        }
        .toast-warning::before {
          content: '🛡️ ';
        }
        .toast-warning::after {
          content: ' ⚠️';
        }
        
        .toast-info {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
          color: white !important;
          border-color: #6d28d9 !important;
        }
        .toast-info::before {
          content: '🎮 ';
        }
        .toast-info::after {
          content: ' 💫';
        }
      `}</style>
    </>
  );
}