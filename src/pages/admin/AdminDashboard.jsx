import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Heart, MessageSquare, Trash2, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, matches: 0, messages: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: matchesCount } = await supabase.from('matches').select('*', { count: 'exact', head: true });
    const { count: messagesCount } = await supabase.from('messages').select('*', { count: 'exact', head: true });
    setStats({ users: usersCount, matches: matchesCount, messages: messagesCount });
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) {
        toast.error('Failed to delete user');
      } else {
        toast.success('User deleted');
        fetchUsers();
        fetchStats();
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/app/profile')} className="p-2 bg-dark-card rounded-full text-dark-text">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-black flex items-center gap-3">
          <ShieldCheck className="text-primary" size={32} /> Admin Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="bg-dark-card p-6 rounded-[24px] border border-white/5">
          <div className="flex justify-between items-center mb-2 text-dark-text">
            <Users size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Total Users</span>
          </div>
          <span className="text-4xl font-black">{stats.users}</span>
        </div>
        <div className="bg-dark-card p-6 rounded-[24px] border border-white/5">
          <div className="flex justify-between items-center mb-2 text-dark-text">
            <Heart size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Total Matches</span>
          </div>
          <span className="text-4xl font-black">{stats.matches}</span>
        </div>
        <div className="bg-dark-card p-6 rounded-[24px] border border-white/5">
          <div className="flex justify-between items-center mb-2 text-dark-text">
            <MessageSquare size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Messages Sent</span>
          </div>
          <span className="text-4xl font-black">{stats.messages}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-dark-card rounded-[32px] border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold">User Management</h2>
          <span className="text-sm text-dark-text">{users.length} users registered</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs font-bold text-dark-text uppercase bg-white/5">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-dark-text">Loading users...</td>
                </tr>
              ) : users.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-surface">
                      {user.photos?.[0] && <img src={user.photos[0]} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-xs text-dark-text">ID: {user.id.slice(0, 8)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-dark-text'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-text">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-dark-text hover:text-red-500 transition-colors"
                      disabled={user.role === 'admin'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
