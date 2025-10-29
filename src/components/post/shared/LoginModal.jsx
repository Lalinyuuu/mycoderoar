import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark-1/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-light-1 dark:bg-gray-9 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 gray-6 hover:gray-9 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-6 to-emerald-5 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-light-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold gray-10 dark:text-light-1 mb-2">
            Join the Conversation
          </h3>
          <p className="gray-6 dark:gray-4 text-sm">
            Sign in to share your thoughts and connect with the community
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-6 to-purple-5 text-light-1 rounded-xl font-semibold hover:from-purple-7 hover:to-purple-6 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/signup');
            }}
            className="w-full px-6 py-3 bg-light-1 dark:bg-gray-8 text-purple-6 dark:text-purple-4 border-2 border-purple-3 rounded-xl font-semibold hover:bg-purple-1 dark:hover:bg-gray-7 transition-all"
          >
            Create Account
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs gray-5 dark:gray-5">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
