import React, { useEffect, useState } from 'react';
import { Shield, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import apiClient from '../../../lib/apiClient';
import toast from 'react-hot-toast';
import { formatApiError } from '../../../lib/errorUtils';

interface Report {
  id: string;
  reason: string;
  description: string | null;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  createdAt: string;
  reporter: {
    regId: string;
    mobile: string;
    profile: { firstName: string; lastName: string; } | null;
  };
  reportedUser: {
    regId: string;
    mobile: string;
    accountStatus: string;
    profile: { firstName: string; lastName: string; } | null;
  };
}

export const ReportList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await apiClient.get<Report[]>('/admin/reports');
      setReports(res.data);
    } catch (err: unknown) {
      toast.error(formatApiError(err, 'Failed to fetch reports'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiClient.patch(`/admin/reports/${id}/status`, { status });
      toast.success('Report status updated');
      fetchReports();
    } catch (err: unknown) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading reports...</div>;

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border text-center shadow-sm">
        <Shield size={48} className="mx-auto text-green-200 mb-4" />
        <h3 className="text-xl font-bold text-gray-800">No Reports Found</h3>
        <p className="text-gray-500 text-sm mt-2">Your community is behaving well.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield size={24} className="text-red-500" />
        <h2 className="text-2xl font-bold">Reported Profiles</h2>
      </div>

      <div className="space-y-4">
        {reports.map(report => (
          <div key={report.id} className="p-5 border rounded-2xl flex flex-col md:flex-row gap-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                  report.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                  report.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                  'bg-green-100 text-green-700 border-green-200'
                }`}>
                  {report.status}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div>
                <h4 className="font-bold text-red-600 text-lg">{report.reason}</h4>
                {report.description && <p className="text-sm text-gray-700 mt-1">{report.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 p-3 bg-white border rounded-xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Reported User</p>
                  <p className="text-sm font-bold">{report.reportedUser.profile?.firstName} {report.reportedUser.profile?.lastName}</p>
                  <p className="text-xs text-primary font-medium">{report.reportedUser.regId}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{report.reportedUser.mobile} • Status: <span className="font-semibold text-gray-800">{report.reportedUser.accountStatus}</span></p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Reported By</p>
                  <p className="text-sm font-bold">{report.reporter.profile?.firstName} {report.reporter.profile?.lastName}</p>
                  <p className="text-xs text-primary font-medium">{report.reporter.regId}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{report.reporter.mobile}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-2 min-w-[140px] justify-start md:justify-center">
              {report.status !== 'PENDING' && (
                <button 
                  onClick={() => updateStatus(report.id, 'PENDING')}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100"
                >
                  <Clock size={14} /> Mark Pending
                </button>
              )}
              {report.status !== 'REVIEWED' && (
                <button 
                  onClick={() => updateStatus(report.id, 'REVIEWED')}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                >
                  <AlertCircle size={14} /> Mark Reviewed
                </button>
              )}
              {report.status !== 'RESOLVED' && (
                <button 
                  onClick={() => updateStatus(report.id, 'RESOLVED')}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
                >
                  <CheckCircle size={14} /> Mark Resolved
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
