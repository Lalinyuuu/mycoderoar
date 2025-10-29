import { useParams } from 'react-router-dom';
import FollowList from '@/components/follow/FollowList';
import FollowStats from '@/components/follow/FollowStats';

export default function FollowingPage() {
  const { userId } = useParams();

  return (
    <div className="min-h-screen bg-light-1">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-9 mb-2">Following</h1>
          <p className="text-gray-6">People this user follows</p>
        </div>

        {/* Follow Stats */}
        <div className="mb-8">
          <FollowStats userId={userId} />
        </div>

        {/* Following List */}
        <FollowList type="following" userId={userId} />
      </div>
    </div>
  );
}
