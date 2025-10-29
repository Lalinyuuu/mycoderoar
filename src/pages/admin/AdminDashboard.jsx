import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/services/api.js';
import LoadingPoring from '@/components/loading/LoadingPoring';

export default function AdminDashboard() {
const [stats, setStats] = useState({
totalPosts: 0,
totalUsers: 0,
publishedPosts: 0,
draftPosts: 0,
totalLikes: 0,
totalComments: 0,
});
const [loading, setLoading] = useState(true);

useEffect(() => {
loadStats();
}, []);

const loadStats = async () => {
setLoading(true);
try {
const { data } = await api.get('/api/admin/stats');
setStats(data);
// เพิ่ม delay เพื่อให้ดู Poring animation นานขึ้น
await new Promise(resolve => setTimeout(resolve, 800));
} catch (error) {
toast.error('Failed to load statistics');
} finally {
setLoading(false);
}
};

const StatCard = ({ value, label, icon, color, gradient, textColor, borderColor = 'border-purple-3' }) => (
<div className={`rounded-2xl bg-gradient-to-br ${gradient} border-2 ${borderColor} p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
<div className="flex items-center justify-between mb-4">
<div className={`p-3 rounded-xl bg-light-1 shadow-md ${color}`}>
  {icon}
</div>
<div className={`text-5xl font-bold ${textColor} flex items-center justify-center`}>
  {loading ? '...' : value}
</div>
</div>
<div className={`text-sm font-bold ${textColor}`}>{label}</div>
</div>
);

return (
<div className="space-y-6">
{/* Loading Overlay */}
{loading && <LoadingPoring fullscreen={true} text="Loading Dashboard..." />}

{/* Header */}
<div className="flex items-center justify-between">
<div>
  <h2 className="text-3xl font-bold text-purple-5">
    Dashboard Overview
  </h2>
  <p className="text-sm gray-7 font-medium mt-1">Welcome back! Here's what's happening today.</p>
</div>
<button
  onClick={loadStats}
  disabled={loading}
  className="rounded-full bg-gradient-to-r from-purple-6 to-purple-5 px-5 py-2.5 text-sm font-bold text-light-1 hover:from-purple-7 hover:to-purple-6 hover:scale-105 disabled:opacity-50 transition-all shadow-md"
>
  {loading ? 'Loading...' : 'Refresh'}
</button>
</div>

{/* Main Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<StatCard 
  value={stats.totalPosts} 
  label="Total Articles" 
  gradient="from-purple-1 to-purple-2"
  textColor="purple-8"
  color="purple-6"
  icon={
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  }
/>

<StatCard 
  value={stats.totalUsers} 
  label="Total Users" 
  gradient="from-emerald-1 to-emerald-2"
  textColor="emerald-8"
  color="emerald-6"
  borderColor="border-emerald-3"
  icon={
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  }
/>

<StatCard 
  value={stats.totalLikes} 
  label="Total Likes" 
  gradient="from-pink-1 to-pink-2"
  textColor="purple-6"
  color="pink-6"
  borderColor="border-pink-3"
  icon={
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  }
/>

<StatCard 
  value={stats.totalComments} 
  label="Total Comments" 
  gradient="from-blue-1 to-blue-2"
  textColor="purple-6"
  color="blue-6"
  borderColor="border-blue-3"
  icon={
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  }
/>
</div>

{/* Status Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="rounded-2xl bg-gradient-to-br from-purple-1 to-purple-2 border-2 border-purple-3 p-6 shadow-xl">
  <div className="flex items-center gap-3 mb-3">
    <div className="p-2 rounded-lg bg-purple-6 text-light-1 shadow-md">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div className="text-sm font-bold purple-6">Published Articles</div>
  </div>
  <div className="text-4xl font-bold purple-6">
    {loading ? '...' : stats.publishedPosts}
  </div>
  <div className="text-xs purple-5 font-semibold mt-2">
    {stats.totalPosts > 0 
      ? `${Math.round((stats.publishedPosts / stats.totalPosts) * 100)}% of total`
      : 'No articles yet'}
  </div>
</div>

<div className="rounded-2xl bg-gradient-to-br from-gray-2 to-gray-3 border-2 border-gray-4 p-6 shadow-xl">
  <div className="flex items-center gap-3 mb-3">
    <div className="p-2 rounded-lg bg-gray-6 text-light-1 shadow-md">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </div>
    <div className="text-sm font-bold gray-10">Draft Articles</div>
  </div>
  <div className="text-4xl font-bold gray-10">
    {loading ? '...' : stats.draftPosts}
  </div>
  <div className="text-xs gray-9 font-semibold mt-2">
    {stats.totalPosts > 0 
      ? `${Math.round((stats.draftPosts / stats.totalPosts) * 100)}% of total`
      : 'No drafts'}
  </div>
</div>
</div>

{/* Quick Actions */}
<div className="rounded-2xl border-2 border-purple-3 bg-gradient-to-br from-purple-1/20 to-emerald-1/10 p-6 shadow-xl">
<h3 className="text-lg font-bold light-1 mb-4">Quick Actions</h3>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <Link
    to="/admin/create-post"
    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-purple-3 bg-light-1 hover:bg-purple-1 hover:border-purple-5 transition-all shadow-sm hover:shadow-md group"
  >
    <svg className="w-8 h-8 purple-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    <span className="text-sm font-bold gray-10">New Article</span>
  </Link>
  
  <Link
    to="/admin/categories"
    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-emerald-3 bg-light-1 hover:bg-emerald-1 hover:border-emerald-5 transition-all shadow-sm hover:shadow-md group"
  >
    <svg className="w-8 h-8 emerald-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
    <span className="text-sm font-bold gray-10">Categories</span>
  </Link>
  
  <Link
    to="/admin/users"
    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-emerald-3 bg-light-1 hover:bg-emerald-1 hover:border-emerald-5 transition-all shadow-sm hover:shadow-md group"
  >
    <svg className="w-8 h-8 emerald-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <span className="text-sm font-bold gray-10">Users</span>
  </Link>
  
  <Link
    to="/admin/profile"
    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-purple-3 bg-light-1 hover:bg-purple-1 hover:border-purple-5 transition-all shadow-sm hover:shadow-md group"
  >
    <svg className="w-8 h-8 purple-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <span className="text-sm font-bold gray-10">Settings</span>
  </Link>
</div>
</div>
</div>
);
}