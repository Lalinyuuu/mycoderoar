export default function DeleteConfirmModal({ open, onClose, onConfirm }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-gradient-to-br from-purple-3 via-purple-1 to-emerald-2 shadow-2xl rounded-2xl border-2 border-purple-4 p-6 max-w-md w-full"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold error">Delete article</h3>
            <button
              aria-label="Close"
              className="rounded-full p-2 gray-6 hover:bg-purple-2 hover:purple-8 transition-colors"
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-sm error mb-6 leading-relaxed font-medium">
            Do you want to delete this article?
          </p>
          
          <div className="flex justify-center gap-3 mt-auto">
            <button
              className="rounded-full border-2 border-purple-3 bg-light-1 px-6 py-2.5 text-sm font-bold gray-8 hover:bg-purple-1 hover:border-purple-5 hover:purple-8 transition-all shadow-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded-full bg-gradient-to-r from-error to-error px-6 py-2.5 text-sm font-bold text-light-1 hover:from-error hover:to-error transition-all shadow-md"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}