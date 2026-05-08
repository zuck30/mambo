import React, { useState } from 'react';
import { 
  Plus, 
  Users, 
  Shield, 
  Phone, 
  Mail, 
  UserPlus, 
  ToggleLeft, 
  ToggleRight, 
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Award,
  CheckCircle2,
  Edit2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import { useStaff } from '../../hooks/useStaff';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import { cn, formatDate } from '../../lib/utils';
import BottomSheet from '../../components/ui/BottomSheet';
import StaffForm from '../../components/forms/StaffForm';

const StaffPage = () => {
  const { staff, isLoading, createStaff, updateStaff, toggleStaffActive, deleteStaff } = useStaff();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const roles = ['all', ...new Set(staff?.map(s => s.role) || [])];
  
  const filteredStaff = staff?.filter(s => {
    const matchesSearch = 
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone?.includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || s.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && s.is_active) || 
      (filterStatus === 'inactive' && !s.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalStaff = staff?.length || 0;
  const activeStaff = staff?.filter(s => s.is_active).length || 0;
  const adminCount = staff?.filter(s => s.role === 'admin').length || 0;
  const managerCount = staff?.filter(s => s.role === 'secretary').length || 0;

  // Images for stats cards
  const statsCards = [
    {
      title: 'Total Staff',
      value: totalStaff,
      icon: Users,
      image: 'https://cdn-icons-png.flaticon.com/128/921/921347.png',
      bgColor: 'bg-orange-50',
      textColor: 'text-[#d34932]'
    },
    {
      title: 'Active Members',
      value: activeStaff,
      icon: CheckCircle2,
      image: 'https://cdn-icons-png.flaticon.com/128/190/190411.png',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-500'
    },
    {
      title: 'Administrators',
      value: adminCount,
      icon: Shield,
      image: 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png',
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-600'
    },
    {
      title: 'Secretaries',
      value: managerCount,
      icon: Award,
      image: 'https://cdn-icons-png.flaticon.com/128/11810/11810399.png',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
  ];

  {/*Images for role badges*/}
  const getRoleImage = (role) => {
    switch(role) {
      case 'admin': return 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png';
      case 'secretary': return 'https://cdn-icons-png.flaticon.com/128/11810/11810399.png';
      case 'staff': return 'https://cdn-icons-png.flaticon.com/128/10808/10808212.png';
      default: return 'https://cdn-icons-png.flaticon.com/128/4336/4336422.png';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-slate-900 text-white border-slate-800';
      case 'secretary': return 'bg-amber-500 text-white border-amber-600';
      case 'staff': return 'bg-sky-500 text-white border-sky-600';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const handleOpenModal = (item = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleEdit = (member) => {
    handleOpenModal(member);
  };

  const handleDelete = (member) => {
    if (window.confirm(`Delete ${member.full_name}? This action cannot be undone.`)) {
      deleteStaff.mutate(member.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <Users size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <RefreshCw size={14} className="animate-spin" /> Loading Staff
            </div>
            <p className="text-lg text-slate-400 font-bold">Fetching team members...</p>
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <Users size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
                <Shield size={14} /> Team Management
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
                Staff <span className="text-[#d34932]">Directory</span>
              </h2>
              <p className="text-lg text-slate-400 font-bold">
                Manage team members, roles, and access permissions.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenModal(null)}
              className="bg-[#d34932] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 group"
            >
              <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
              Add Team Member
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Cards with Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-1">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</p>
              <p className="text-2xl font-black text-slate-900 group-hover:text-[#d34932] transition-colors">
                {card.value}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform",
                card.bgColor
              )}>
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\'%3E%3C/circle%3E%3Cpath d=\'M12 8v8M8 12h8\'%3E%3C/path%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Search Staff
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, role or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Filter by Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all appearance-none cursor-pointer"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : role.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex items-end">
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Showing
              </p>
              <p className="text-sm font-black text-slate-900">
                {filteredStaff?.length || 0} members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {filteredStaff?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                  <th className="px-6 py-4">Staff Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <img 
                            src={getRoleImage(member.role)} 
                            alt={member.role}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{member.full_name}</p>
                          {member.email && (
                            <p className="text-[10px] text-slate-400 font-medium">{member.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                        getRoleBadgeColor(member.role)
                      )}>
                        <img 
                          src={getRoleImage(member.role)} 
                          alt={member.role}
                          className="w-3 h-3 object-contain"
                        />
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {member.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Phone size={12} />
                            <span className="text-xs font-bold">{member.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          member.is_active ? "bg-emerald-500" : "bg-slate-300"
                        )} />
                        <span className={cn(
                          "text-xs font-black uppercase tracking-widest",
                          member.is_active ? "text-emerald-600" : "text-slate-400"
                        )}>
                          {member.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-500">
                        {formatDate(member.created_at, 'MMM dd, yyyy')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleStaffActive.mutate({
                            id: member.id,
                            is_active: !member.is_active
                          })}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            member.is_active 
                              ? "text-emerald-500 hover:bg-emerald-50" 
                              : "text-slate-400 hover:bg-slate-100"
                          )}
                          title={member.is_active ? "Deactivate" : "Activate"}
                        >
                          {member.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 text-slate-400 hover:text-[#d34932] hover:bg-orange-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(member)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-6">
              <Users size={32} className="text-[#d34932]" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">No staff members found</h3>
            <p className="text-sm text-slate-400 font-bold mb-6 max-w-md mx-auto">
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your search criteria or filters' 
                : 'Start building your team by adding staff members'}
            </p>
            {(searchTerm || filterRole !== 'all' || filterStatus !== 'all') ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('all');
                  setFilterStatus('all');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
              >
                <RefreshCw size={14} /> Clear Filters
              </button>
            ) : (
              <button
                onClick={() => handleOpenModal(null)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
              >
                <UserPlus size={14} /> Add First Member
              </button>
            )}
          </div>
        )}
      </div>

      {/* Staff Form Modal */}
      <BottomSheet
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedItem ? 'Edit Team Member' : 'Add Team Member'}
      >
        <StaffForm
          onSubmit={async (data) => {
            if (selectedItem) {
              await updateStaff.mutateAsync({ id: selectedItem.id, ...data });
            } else {
              await createStaff.mutateAsync(data);
            }
            handleCloseModal();
          }}
          initialData={selectedItem}
          loading={createStaff.isPending || (updateStaff?.isPending ?? false)}
        />
      </BottomSheet>
    </div>
  );
};

export default StaffPage;