import React from 'react';
import { Cake } from 'lucide-react';

interface BirthdayUser {
  id: string;
  firstName: string;
  lastName: string;
  regId: string;
  birthDate: string;
  daysUntil: number;
}

interface BirthdayListProps {
  birthdays: BirthdayUser[];
  handleSendWish: (id: string) => void;
  wishesSent: Set<string>;
}

export const BirthdayList: React.FC<BirthdayListProps> = ({ birthdays, handleSendWish, wishesSent }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-[#F2F4F6] text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
          <tr>
            <th className="px-10 py-5">Member</th>
            <th className="px-8 py-5">Birth Date</th>
            <th className="px-8 py-5">Days Left</th>
            <th className="px-10 py-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {birthdays.length === 0 ? (
            <tr><td colSpan={4} className="p-20 text-center text-foreground/20 font-medium">No upcoming birthdays in the next 30 days.</td></tr>
          ) : (
            birthdays.map((b) => (
              <tr key={b.id} className="border-b border-black/[0.03] hover:bg-[#F7F9FB] transition-colors">
                <td className="px-10 py-6">
                  <div className="font-black text-foreground">{b.firstName} {b.lastName}</div>
                  <div className="text-[10px] font-bold text-primary uppercase">{b.regId}</div>
                </td>
                <td className="px-8 py-6 text-sm font-medium text-foreground/60">{new Date(b.birthDate).toLocaleDateString()}</td>
                <td className="px-8 py-6">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${b.daysUntil === 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-100 text-amber-700'}`}>
                    {b.daysUntil === 0 ? 'TODAY!' : `In ${b.daysUntil} Days`}
                  </span>
                </td>
                <td className="px-10 py-6 text-right">
                  <button 
                    onClick={() => handleSendWish(b.id)} 
                    disabled={wishesSent.has(b.id)}
                    className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 ml-auto transition-all
                      ${wishesSent.has(b.id) 
                        ? 'bg-green-100 text-green-700 cursor-default' 
                        : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105'
                      }`}
                  >
                    <Cake size={14} /> 
                    {wishesSent.has(b.id) ? '✓ Wish Sent' : 'Send Wish'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
