/**
 * BlogCardDefault Component
 * Default variant layout for BlogCard
 */

import { useState } from 'react';
import { useImageWithFallback } from '../../hooks/useImageWithFallback';
import { normalizeAuthor, formatLongDate, toISO, truncateText, getCategoryColor, formatViewCount } from '../../utils/blogCardHelpers';

const BlogCardDefault = ({
  id,
  image,
  category,
  title,
  description,
  author,
  date,
  likes = 0,
  comments = 0,
  views = 0,
  tags = [],
  onClick,
  onPostNavigation
}) => {

  const [showAllTags, setShowAllTags] = useState(false);
  const { src, onError } = useImageWithFallback(image || '/images/placeholder.jpg');
  const a = normalizeAuthor(author || 'Unknown Author');
  
  const displayDate = date 
    ? formatLongDate(date) 
    : new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
  
  const dateISO = toISO(date);
  const truncatedDescription = truncateText(description || 'No description available', 100);

  return (
    <article className="h-full bg-white rounded-2xl border-2 border-gray-1 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-purple-3 transition-all duration-300 group card-hover-glow">
      <div className="flex flex-col h-full">
        {/* Image */}
        <div onClick={onPostNavigation} className="block cursor-pointer">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-purple-1 to-purple-1">
            <img
              src={src}
              alt={title || 'Post Image'}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={onError}
              style={{
                objectPosition: 'center',
                objectFit: 'cover'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Image overlay with stats */}
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-sm font-medium">Featured</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-sm">{formatViewCount(views)} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category */}
          {category && (
            <div className="mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all hover:scale-110 cursor-pointer ${getCategoryColor(category)}`}>
                {category}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 
            onClick={onPostNavigation}
            className="text-lg font-bold text-gray-9 mb-2 cursor-pointer hover:text-purple-7 transition-colors duration-200 line-clamp-2"
          >
            {title || 'Draft Post'}
          </h2>

          {/* Description */}
          <p className="text-gray-7 text-sm leading-relaxed mb-3 line-clamp-2 flex-1">
            {truncatedDescription}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(showAllTags ? tags : tags.slice(0, 3)).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-purple-1 text-purple-7 border border-purple-3 hover:bg-purple-2 transition-colors"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && !showAllTags && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAllTags(true);
                  }}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-1 text-purple-7 border border-purple-3 hover:bg-purple-2 hover:border-purple-4 hover:scale-110 transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow-md"
                >
                  +{tags.length - 3} more
                </button>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-1 text-sm text-gray-6 mb-3">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{formatViewCount(views || 0)} views</span>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3">
            <img
              src={a.avatar || "/images/avatar/avartar-default.png"}
              alt={a.name || 'Author'}
              className="w-8 h-8 rounded-full object-cover transition-transform hover:scale-110 cursor-pointer"
              onError={(e) => {
                e.target.src = "/images/avatar/avartar-default.png";
              }}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-9">{a.name || 'Unknown Author'}</p>
                <time className="text-xs text-gray-7" dateTime={dateISO}>
                  {displayDate}
                </time>
              </div>
              <p className="text-xs text-gray-7">Author</p>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
};

export default BlogCardDefault;
