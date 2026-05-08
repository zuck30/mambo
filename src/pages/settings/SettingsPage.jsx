import React, { useState, useEffect } from 'react';
import {
  Building2,
  User,
  Settings as SettingsIcon,
  Globe,
  Bell,
  CreditCard,
  ShieldCheck,
  Smartphone,
  Loader2,
  ChevronRight,
  Mail,
  Phone,
  Lock,
  Moon,
  Sun,
  LogOut,
  Trash2,
  Save,
  Camera,
  Key,
  Users,
  DollarSign,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import AppCard from '../../components/ui/AppCard';
import { useAuth } from '../../hooks/useAuth';
import { useStaff } from '../../hooks/useStaff';
import { useSettings } from '../../hooks/useSettings';
import { supabase } from '../../lib/supabase';
import BottomSheet from '../../components/ui/BottomSheet';
import { toast } from 'react-hot-toast';
import { cn } from '../../lib/utils';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { profile, signOut, fetchProfile } = useAuth();
  const { updateProfile } = useStaff();
  const { branch, updateBusiness } = useSettings();
  const [activeTab, setActiveTab] = useState('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    lowStock: true,
    payments: true
  });

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    business_name: 'GariDesk',
    currency: 'TZS',
    tax_rate: '0',
    address: 'Dar es Salaam, Tanzania',
    timezone: 'Africa/Dar_es_Salaam',
    password: '',
    confirm_password: ''
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        email: profile.email || '',
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (branch) {
      setFormData(prev => ({
        ...prev,
        business_name: branch.name || '',
        address: branch.address || '',
        phone: branch.phone || prev.phone,
      }));
    }
  }, [branch]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile.mutateAsync({
      id: profile.id,
      full_name: formData.full_name,
      phone: formData.phone,
    });
    await fetchProfile(profile.id);
    setShowEditModal(false);
    toast.success('Profile updated successfully');
  };

  const handleUpdateBusiness = async (e) => {
    e.preventDefault();
    await updateBusiness.mutateAsync({
      name: formData.business_name,
      address: formData.address,
    });
    setShowEditModal(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsChangingPassword(true);
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setShowEditModal(false);
      setFormData({ ...formData, password: '', confirm_password: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Team', icon: Users },
  ];

  const sections = [
    {
      title: "Personal Information",
      type: "profile",
      icon: User,
      items: [
        { label: "Full Name", value: profile?.full_name || 'Not Set', icon: User },
        { label: "Email Address", value: profile?.email || 'Not Set', icon: Mail },
        { label: "Phone Number", value: profile?.phone || 'Not Set', icon: Phone },
        { label: "Account Role", value: profile?.role, icon: ShieldCheck, badge: true },
      ]
    },
    {
      title: "Business Details",
      type: "business",
      icon: Building2,
      items: [
        { label: "Business Name", value: formData.business_name, icon: Building2 },
        { label: "Currency", value: formData.currency, icon: DollarSign },
        { label: "Tax Rate", value: `${formData.tax_rate}%`, icon: CreditCard },
        { label: "Address", value: formData.address, icon: Globe },
        { label: "Timezone", value: formData.timezone, icon: Calendar },
      ]
    },
    {
      title: "Security Settings",
      type: "security",
      icon: Lock,
      items: [
        { label: "Password", value: "Change Password", icon: Key, action: true },
        { label: "Two-Factor Auth", value: "Disabled", icon: ShieldCheck },
        { label: "Active Sessions", value: "Current device", icon: Smartphone },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <SettingsIcon size={300} />
        </div>
        <div className="relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <SettingsIcon size={14} /> System Preferences
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
              Settings & <span className="text-[#d34932]">Configuration</span>
            </h2>
            <p className="text-lg text-slate-400 font-bold">
              Manage your account preferences, business settings, and security options.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-1">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1">

          {/* Navigation Tabs */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-3">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'team') {
                      navigate('/staff');
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                    activeTab === tab.id
                      ? "bg-[#d34932] text-white shadow-lg shadow-orange-200"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <tab.icon size={18} />
                  <span className="text-sm font-black flex-1 text-left">{tab.label}</span>
                  {activeTab === tab.id && <ChevronRight size={14} />}
                </button>
              ))}
            </div>

            <div className="h-px bg-slate-100 my-3" />

            <div className="space-y-1">
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all group"
              >
                <LogOut size={18} />
                <span className="text-sm font-black">Sign Out</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all group">
                <Trash2 size={18} />
                <span className="text-sm font-black">Delete Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-1">
          {/* Settings Cards */}
          <AnimatePresence mode="wait">
            {activeTab === 'notifications' ? (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Bell size={20} className="text-[#d34932]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Notification Preferences</h3>
                      <p className="text-[10px] text-slate-400 font-bold italic">Choose how you want to be notified</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                      <span className="text-[11px] font-bold text-slate-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                        className={cn(
                          "w-10 h-5 rounded-full transition-all relative",
                          value ? "bg-[#d34932]" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                          value ? "right-0.5" : "left-0.5"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              sections
                .filter(section => activeTab === 'all' || section.type === activeTab)
                .map((section, idx) => (
                  <motion.div
                    key={section.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                            <section.icon size={20} className="text-[#d34932]" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900">{section.title}</h3>
                            <p className="text-[10px] text-slate-400 font-bold italic">Manage your {section.title.toLowerCase()}</p>
                          </div>
                        </div>
                        {section.type && (
                          <button
                            onClick={() => {
                              setEditType(section.type);
                              setShowEditModal(true);
                            }}
                            className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d34932] hover:text-white transition-all"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                              <item.icon size={14} className="text-slate-500" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-500">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.badge ? (
                              <span className="px-3 py-1.5 bg-orange-50 text-[#d34932] text-[9px] font-black uppercase tracking-widest rounded-full border border-orange-100">
                                {item.value}
                              </span>
                            ) : item.action ? (
                              <button
                                onClick={() => {
                                  if (section.type) {
                                    setEditType(section.type);
                                    setShowEditModal(true);
                                  }
                                }}
                                className="text-[10px] font-black text-[#d34932] uppercase tracking-widest hover:underline"
                              >
                                {item.value}
                              </button>
                            ) : (
                              <span className="text-sm font-black text-slate-900">{item.value}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Edit Modal */}
      <BottomSheet
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={
          editType === 'profile' ? 'Edit Personal Profile' :
          editType === 'business' ? 'Edit Business Configuration' :
          'Update Security Settings'
        }
      >
        {editType === 'profile' ? (
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="w-full bg-[#d34932] text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save Profile
                </>
              )}
            </button>
          </form>
        ) : editType === 'business' ? (
          <form onSubmit={handleUpdateBusiness} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                Business Name
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                  Currency
                </label>
                <select
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                >
                  <option value="TZS">TZS (Shilling)</option>
                  <option value="USD">USD (Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                  Tax Rate (%)
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
                  value={formData.tax_rate}
                  onChange={(e) => setFormData({...formData, tax_rate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                Business Address
              </label>
              <textarea
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all resize-none"
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#d34932] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save size={14} />
              Save Configuration
            </button>
          </form>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-5 pb-10">
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
                value={formData.confirm_password}
                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
              />
            </div>
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full bg-[#d34932] text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Update Password
                </>
              )}
            </button>
          </form>
        )}
      </BottomSheet>
    </div>
  );
};

export default SettingsPage;