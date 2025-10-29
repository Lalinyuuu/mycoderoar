import React from 'react';

export default function CommentModalHeader({ postTitle, onClose }) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-1 flex-shrink-0">
      <div>
        <h3 className="text-xl font-bold gray-9">Comments</h3>
        <p className="text-sm gray-7 mt-1">on: {postTitle}</p>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-1 rounded-full transition-colors duration-200"
      >
        <svg className="w-5 h-5 gray-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
