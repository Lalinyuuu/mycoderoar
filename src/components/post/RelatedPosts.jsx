import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRelatedPosts } from '@/services/posts';
import { useImageWithFallback } from '@/hooks/useImageWithFallback';

// Transform Cloudinary image to 16:9 ratio (only if not already transformed)
const transformImageTo16x9 = (imageUrl) => {
  if (!imageUrl) return imageUrl;
  
  // Check if it's a Cloudinary URL
  if (!imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  // Check if already has transformation parameters after /upload/
  const uploadIndex = imageUrl.indexOf('/upload/');
  if (uploadIndex === -1) return imageUrl;
  
  const afterUpload = imageUrl.substring(uploadIndex + 8);
  
  // If already has transformation (starts with transformations, not version number)
  // Pattern: /upload/w_1200,... or /upload/c_fill,...
  if (afterUpload.match(/^[a-z]_/)) {
    return imageUrl;
  }
  
  // Add transformation
  const baseUrl = imageUrl.substring(0, uploadIndex + 8);
  
  // 16:9 transformation with smart cropping
  return `${baseUrl}c_fill,w_1200,h_675,g_auto,q_auto,f_auto/${afterUpload}`;
};

const RelatedPostCard = ({ post }) => {
  const navigate = useNavigate();
  const originalImage = post.image || post.coverImage || post.thumbnail;
  const transformedImage = transformImageTo16x9(originalImage);
  const { src, onError } = useImageWithFallback(transformedImage);

  const handleClick = () => {
    navigate(`/post/${post.id}`, { replace: false });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <article
      onClick={handleClick}
      className="group relative bg-light-1 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full cursor-pointer ring-1 ring-gray-1 flex flex-col"
    >
      {/* Image Container - No margin, no padding */}
      <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0">
        <img
          src={src}
          onError={onError}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        {post.category && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-1 purple-7 mb-2">
            {post.category}
          </span>
        )}

        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {post.title}
        </h3>

        <div className="flex items-center gap-2 text-sm gray-6">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {post.author?.name || post.user?.name || 'Unknown'}
          </span>
          {post.createdAt && (
            <>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>

      {/* Arrow Icon */}
      <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
        <svg className="w-4 h-4 purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </article>
  );
};

const RelatedPosts = ({ postId, limit = 3 }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await getRelatedPosts(postId, limit);
        const relatedPosts = result.posts || result.data || [];
        setPosts(relatedPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [postId, limit]);

  if (!isLoading && posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-12 border-t-2 border-gray-2">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-emerald-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-purple-700 via-purple-600 to-emerald-4 bg-clip-text text-transparent">
              Related Posts You Might Like
            </h2>
            <p className="gray-6 text-sm md:text-base">Continue exploring similar content</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-light-1 rounded-2xl overflow-hidden shadow-lg animate-pulse ring-1 ring-gray-1">
              <div className="w-full bg-gradient-to-br from-purple-1 to-pink-1" style={{ aspectRatio: '4 / 3' }} />
              <div className="p-4">
                <div className="h-4 bg-gray-2 rounded w-20 mb-3" />
                <div className="h-5 bg-gray-2 rounded w-full mb-2" />
                <div className="h-5 bg-gray-2 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-2 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="gray-6">Unable to load related posts</p>
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <RelatedPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedPosts;