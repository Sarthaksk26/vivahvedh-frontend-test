import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../lib/apiClient';
import { resolveImageUrl } from '../../lib/url';
import { Heart, Send, Camera, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { authStorage } from '../../lib/authStorage';

interface Story {
  id: string;
  groomName: string;
  brideName: string;
  message: string;
  photoUrl: string | null;
  createdAt: string;
}

export default function SuccessStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ groomName: '', brideName: '', message: '' });
  const [photo, setPhoto] = useState<File | null>(null);

  const isLoggedIn = authStorage.isAuthenticated();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await apiClient.get('/stories');
      setStories(res.data);
    } catch (err) {
      console.error('Failed to load stories', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.message.length < 10) {
      toast.error('Please write at least 10 characters for your story.');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('groomName', form.groomName);
      fd.append('brideName', form.brideName);
      fd.append('message', form.message);
      if (photo) fd.append('photo', photo);

      await apiClient.post('/stories/submit', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('🎉 Your success story has been submitted! It will appear here once approved by our team.', {
        duration: 5000
      });
      setForm({ groomName: '', brideName: '', message: '' });
      setPhoto(null);
      setShowForm(false);
    } catch (err: any) {
      const msg = err.response?.data?.error;
      toast.error(typeof msg === 'string' ? msg : 'Failed to submit story. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full h-12 rounded-xl border border-input bg-background/80 px-4 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all";

  return (
    <div className="min-h-screen">

      {/* Hero Banner */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden bg-[#F7F9FB]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-primary/5 to-transparent" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Real Couples, Real Love</span>
            <h1 className="display-md text-foreground mb-4">यशोगाथा — Success Stories</h1>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto leading-relaxed">
              Celebrating the beautiful unions forged through Vivahvedh. Every story here is a testament to trust, tradition, and true love.
            </p>

            {isLoggedIn && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-8 clay-button-primary px-8 py-3.5 inline-flex items-center gap-2 text-sm"
              >
                <Heart size={16} /> Share Your Story
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Submission Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-8 md:p-10 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-rose-400 to-amber-400" />
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={24} className="text-primary" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">Share Your Love Story</h2>
                <p className="text-muted-foreground text-sm mt-1">Your story will be published after admin approval.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-foreground/80">Groom's Name *</label>
                    <input value={form.groomName} onChange={e => setForm(p => ({ ...p, groomName: e.target.value }))} required className={inputClass} placeholder="वराचे नाव" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-foreground/80">Bride's Name *</label>
                    <input value={form.brideName} onChange={e => setForm(p => ({ ...p, brideName: e.target.value }))} required className={inputClass} placeholder="वधूचे नाव" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80">Your Story *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    required
                    rows={4}
                    maxLength={1000}
                    className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 resize-none transition-all"
                    placeholder="Tell us how you found your partner on Vivahvedh..."
                  />
                  <p className="text-xs text-muted-foreground text-right">{form.message.length}/1000</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80">Wedding Photo</label>
                  <label className="flex items-center gap-3 p-4 border-2 border-dashed border-primary/20 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors">
                    <Camera size={20} className="text-primary/40" />
                    <span className="text-sm text-muted-foreground">{photo ? photo.name : 'Click to upload a photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setPhoto(e.target.files?.[0] || null)} />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white h-12 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    <><Send size={16} /> Submit for Review</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stories Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-primary/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground/40 mb-2">No stories yet</h3>
            <p className="text-muted-foreground">Be the first to share your success story!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-[32px] overflow-hidden shadow-ambient border border-black/5 group hover:-translate-y-2 transition-all duration-500"
              >
                {/* Photo */}
                <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                  {story.photoUrl ? (
                    <img
                      src={resolveImageUrl(story.photoUrl)}
                      alt={`${story.groomName} & ${story.brideName}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart size={56} className="text-primary/15" />
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <p className="text-white font-display font-black text-lg drop-shadow-lg">
                      {story.groomName} <span className="text-white/60">&</span> {story.brideName}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-foreground/70 text-sm leading-relaxed mb-4 line-clamp-4">
                    "{story.message}"
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/40">
                    <Heart size={12} className="text-primary/30" />
                    {new Date(story.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
