import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../lib/apiClient';
import { resolveImageUrl } from '../../lib/url';
import toast from 'react-hot-toast';

export default function ConnectionsList() {
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/connections/my-connections');
      setIncoming(data.incoming);
      setOutgoing(data.outgoing);
    } catch (error) {
      console.error("Failed to load connections", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleAction = async (action: 'accept' | 'reject', requestId: string) => {
    try {
      if (action === 'accept') {
        await apiClient.post('/connections/accept', { requestId });
        toast.success('Match Accepted! You can now view their direct contact data.');
      } else {
        await apiClient.post('/connections/reject', { requestId });
        toast.success('Match Request Rejected.');
      }
      fetchConnections();
    } catch (error) {
      toast.error(`Failed to ${action} request.`);
    }
  };

  if (loading) return <div className="text-center p-12 text-primary animate-pulse font-bold">Syncing Network Connections...</div>;

  return (
    <div className="space-y-8">
      
      {/* 1. Incoming Requests (Needs Action) */}
      <section className="bg-card border shadow-sm rounded-2xl overflow-hidden">
        <div className="bg-rose-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg text-rose-900">Received Match Proposals</h2>
          <span className="px-3 py-1 bg-rose-200 text-rose-800 rounded-full text-xs font-bold">{incoming.length}</span>
        </div>
        
        {incoming.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">You have no pending requests at this time.</div>
        ) : (
          <div className="divide-y">
            {incoming.map(req => (
              <div key={req.id} className="p-6 flex flex-col md:flex-row gap-6 items-center justify-between hover:bg-muted/30 transition">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted border overflow-hidden">
                    {req.sender.images?.[0]?.url ? (
                      <img src={resolveImageUrl(req.sender.images[0].url)} className="w-full h-full object-cover" />
                    ) : ( 
                      <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">{req.sender.profile?.firstName?.[0] || 'V'}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{req.sender.profile?.firstName} {req.sender.profile?.lastName}</h3>
                    <p className="text-sm font-semibold text-primary">{req.sender.regId}</p>
                    <p className="text-xs text-muted-foreground">Status: <span className="font-bold text-foreground">{req.status}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${req.sender.id}`} className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition">
                    View Profile
                  </Link>
                  {req.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleAction('reject', req.id)} className="px-4 py-2 border border-red-200 text-red-600 rounded-md text-sm font-bold hover:bg-red-50 transition">Decline</button>
                      <button onClick={() => handleAction('accept', req.id)} className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-bold shadow-sm hover:bg-green-700 transition">Accept Match</button>
                    </>
                  )}
                  {req.status === 'ACCEPTED' && (
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm font-bold">Contact: {req.sender.mobile}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Outgoing Requests (Sent) */}
      <section className="bg-card border shadow-sm rounded-2xl overflow-hidden">
        <div className="bg-muted px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Proposals You Sent</h2>
          <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-bold">{outgoing.length}</span>
        </div>
        
        {outgoing.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">You haven't expressed interest in anyone yet. Go to Search!</div>
        ) : (
          <div className="divide-y">
            {outgoing.map(req => (
              <div key={req.id} className="p-6 flex flex-col md:flex-row gap-6 items-center justify-between hover:bg-muted/30 transition">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted border overflow-hidden">
                    {req.receiver.images?.[0]?.url ? (
                      <img src={resolveImageUrl(req.receiver.images[0].url)} className="w-full h-full object-cover" />
                    ) : ( 
                      <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">{req.receiver.profile?.firstName?.[0] || 'V'}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{req.receiver.profile?.firstName} {req.receiver.profile?.lastName}</h3>
                    <p className="text-sm font-semibold text-primary">{req.receiver.regId}</p>
                    <p className="text-xs text-muted-foreground">Status: <span className="font-bold text-foreground">{req.status}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${req.receiver.id}`} className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition">
                    View Profile
                  </Link>
                  {req.status === 'ACCEPTED' && (
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm font-bold">Contact: {req.receiver.mobile}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
