import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Mail, 
  MoreVertical,
  Activity,
  UserCheck,
  UserMinus
} from 'lucide-react';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { Modal } from '../../components/clinic/Modal';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'clinician' | 'researcher' | 'admin';
  status: 'active' | 'inactive';
  lastActive: string;
  specialization: string;
}

const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'د. أحمد علي',
    email: 'ahmed@psytech.app',
    role: 'clinician',
    status: 'active',
    lastActive: 'نشط الآن',
    specialization: 'علاج سلوكي معرفي'
  },
  {
    id: '2',
    name: 'د. سارة محمود',
    email: 'sara@psytech.app',
    role: 'researcher',
    status: 'active',
    lastActive: 'منذ ساعتين',
    specialization: 'علم النفس التجريبي'
  },
  {
    id: '3',
    name: 'أ. ليلي خالد',
    email: 'layla@psytech.app',
    role: 'clinician',
    status: 'inactive',
    lastActive: 'منذ 3 أيام',
    specialization: 'علم نفس الأطفال'
  }
];

export const StaffManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text">إدارة طاقم العمل</h1>
          <p className="text-psy-text/40">إضافة وتعديل صلاحيات الأخصائيين والباحثين في المركز</p>
        </div>
        <GoldButton size="lg" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={20} /> إضافة عضو جديد
        </GoldButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/20" size={20} />
          <input 
            type="text"
            placeholder="بحث بالاسم، البريد أو التخصص..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-sm outline-none focus:border-[#D4B483]"
          />
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          <button className="flex-1 px-4 py-2 bg-[#181816] text-[#D4B483] rounded-xl text-xs font-bold shadow-lg border border-[#D4B483]/20">الكل</button>
          <button className="flex-1 px-4 py-2 text-psy-text/40 hover:text-psy-text text-xs font-bold">نشط</button>
          <button className="flex-1 px-4 py-2 text-psy-text/40 hover:text-psy-text text-xs font-bold">غير نشط</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockStaff.map(member => (
          <GlassCard key={member.id} className="p-6 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-1.5 h-full opacity-50 ${member.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#D4B483]/10 border border-[#D4B483]/20 flex items-center justify-center">
                <Shield className="text-[#D4B483]" size={24} />
              </div>
              <button className="p-2 text-psy-text/20 hover:text-psy-text hover:bg-white/5 rounded-xl transition-all">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-xs text-psy-text/40">{member.specialization}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-psy-text/60">
                  <Mail size={14} className="text-[#D4B483]" />
                  {member.email}
                </div>
                <div className="flex items-center gap-3 text-xs text-psy-text/60">
                  <Activity size={14} className="text-[#D4B483]" />
                  {member.lastActive}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                  member.role === 'clinician' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {member.role === 'clinician' ? 'أخصائي' : 'باحث'}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 bg-white/5 rounded-lg text-psy-text/20 hover:text-red-400 transition-all">
                    <UserMinus size={16} />
                  </button>
                  <button className="p-2 bg-white/5 rounded-lg text-psy-text/20 hover:text-[#D4B483] transition-all">
                    <UserCheck size={16} />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة عضو جديد للطاقم">
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">الاسم بالكامل</label>
            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483]" placeholder="مثال: د. سمير محمد" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">البريد الإلكتروني</label>
            <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483]" placeholder="email@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-psy-text/60">الدور الوظيفي</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483]">
                <option value="clinician">أخصائي</option>
                <option value="researcher">باحث</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-psy-text/60">التخصص</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483]" placeholder="مثال: CBT" />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <GoldButton className="flex-1" size="lg">إضافة العضو</GoldButton>
            <GoldButton variant="secondary" className="flex-1" size="lg" onClick={() => setIsModalOpen(false)}>إلغاء</GoldButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
