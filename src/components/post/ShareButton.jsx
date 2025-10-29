import { useState } from 'react';
import { toast } from 'sonner';
import { trackShare } from '@/api_services/interactions';

export default function ShareButton({ postId, url, title }) {
  const [showOptions, setShowOptions] = useState(false);

  const shareOptions = [
    { 
      platform: 'facebook', 
      icon: '📘', 
      name: 'Facebook',
      url: `https://www.facebook.com/share.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`
    },
    { 
      platform: 'twitter', 
      icon: '🐦', 
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    { 
      platform: 'linkedin', 
      icon: '💼', 
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    },
    { 
      platform: 'whatsapp', 
      icon: '💬', 
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
    },
    { 
      platform: 'telegram', 
      icon: '✈️', 
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    { 
      platform: 'line', 
      icon: '💚', 
      name: 'Line',
      url: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`
    }
  ];

  const handleShare = async (platform, shareUrl) => {
    try {
      // Track the share
      await trackShare(postId, platform);
      
      if (platform === 'copy') {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } else {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
        toast.success(`Shared to ${platform}!`);
      }
      
      setShowOptions(false);
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  const handleCopyLink = async () => {
    await handleShare('copy', url);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-3 bg-white gray-6 hover:bg-light-2 transition-colors"
      >
        <span className="text-lg">📤</span>
        <span className="font-medium">Share</span>
      </button>

      {showOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowOptions(false)}
          />
          
          {/* Share Options */}
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-2 rounded-lg shadow-lg z-20 min-w-[200px]">
            <div className="p-2">
              <div className="text-xs gray-5 mb-2 px-2">Share to:</div>
              
              {shareOptions.map((option) => (
                <button
                  key={option.platform}
                  onClick={() => handleShare(option.platform, option.url)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-light-2 rounded transition-colors"
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}
              
              <div className="border-t border-gray-1 my-1" />
              
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-light-2 rounded transition-colors"
              >
                <span className="text-lg">📋</span>
                <span className="text-sm font-medium">Copy Link</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
