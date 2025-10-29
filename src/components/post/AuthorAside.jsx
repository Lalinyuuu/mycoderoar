import { useNavigate } from 'react-router-dom';
import FollowButton from '@/components/follow/FollowButton';
import FollowStats from '@/components/follow/FollowStats';

export default function AuthorAside({ author }) {
  const navigate = useNavigate();
  
  
  const authorData = typeof author === 'string' 
    ? { 
        name: author, 
        avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200',
        bio: 'Veteran Ragnarok Online player and guide writer.'
      }
    : {
        name: author?.name || 'MVP Hunter',
        avatar: author?.avatar || '/images/avatar/avartar-default.png',
        bio: author?.bio || 'Veteran Ragnarok Online player and guide writer.',
        id: author?.id,
        username: author?.username
      };

  const handleAuthorClick = () => {
    if (authorData?.id) {
      navigate(`/users/${authorData.id}`);
    } else {
    }
  };

  return (
    <aside className="bg-gradient-to-br from-light-2 to-light-1 p-6 rounded-xl border-2 border-purple-3 shadow-lg">
      <p className="text-sm text-gray-6 mb-2 font-medium">Author</p>
      
      <div className="flex items-center gap-4 mb-4">
        <img
          src={authorData.avatar}
          alt={authorData.name}
          className="h-16 w-16 rounded-full object-cover border-2 border-purple-4 cursor-pointer hover:border-purple-6 transition-colors"
          onClick={handleAuthorClick}
          onError={(e) => {
            e.target.src = "/images/avatar/avartar-default.png";
          }}
        />
        <div className="flex-1">
          <h3 
            className="text-xl font-bold text-gray-9 cursor-pointer hover:text-purple-7 transition-colors"
            onClick={handleAuthorClick}
          >
            {authorData.name}
          </h3>
          {authorData?.username && (
            <p className="text-sm text-gray-6">@{authorData.username}</p>
          )}
        </div>
      </div>

      <p className="text-gray-7 leading-relaxed mb-4">
        {authorData.bio}
      </p>

      {/* Follow Stats */}
      {authorData?.id && (
        <div className="mb-4">
          <FollowStats userId={authorData.id} />
        </div>
      )}

      {/* Follow Button */}
      {authorData?.id && (
        <div className="flex justify-center mb-4">
          <FollowButton
            userId={authorData.id}
            size="sm"
            showIcon={true}
            className="!bg-purple-6 !text-white hover:!bg-purple-7"
          />
        </div>
      )}

      {/* View Profile Button */}
      {authorData?.id && (
        <div className="mt-4">
          <button
            onClick={handleAuthorClick}
            className="w-full bg-purple-6 text-white px-4 py-2 rounded-full hover:bg-purple-7 transition-colors font-medium"
          >
            View Profile
          </button>
        </div>
      )}
    </aside>
  );
}