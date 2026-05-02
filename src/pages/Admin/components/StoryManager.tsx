import React from 'react';
import { Heart } from 'lucide-react';
import { resolveImageUrl } from '../../../lib/url';
import apiClient from '../../../lib/apiClient';
import { toast } from 'react-hot-toast';

interface Story {
  id: string;
  groomName: string;
  brideName: string;
  message: string;
  photoUrl?: string;
}

interface StoryManagerProps {
  stories: Story[];
  fetchData: () => void;
}

export const StoryManager: React.FC<StoryManagerProps> = ({ stories, fetchData }) => {
  const handleStorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await apiClient.post('/stories/admin/create', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Story published successfully!');
      (e.target as HTMLFormElement).reset();
      fetchData();
    } catch (err: any) { 
      toast.error(err.response?.data?.error || 'Failed to publish story'); 
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Create Story Form */}
      <div className="bg-[#F7F9FB] rounded-2xl p-6 border border-black/5">
        <h3 className="font-black text-sm uppercase tracking-widest text-foreground/40 mb-4">Publish New Story</h3>
        <form onSubmit={handleStorySubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="groomName" required placeholder="Groom Name" className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm w-full" />
            <input name="brideName" required placeholder="Bride Name" className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm w-full" />
            <input name="message" required placeholder="Testimonial..." className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm w-full" />
          </div>
          <div className="flex w-full md:w-auto gap-4 items-end">
            <div className="flex-1">
              <input name="photo" type="file" accept="image/*" className="w-full text-xs file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-bold file:text-xs" />
            </div>
            <button type="submit" className="h-11 px-8 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all flex-shrink-0 shadow-lg shadow-primary/20">
              Publish
            </button>
          </div>
        </form>
      </div>

      {/* Stories List */}
      {stories.length === 0 ? (
        <div className="p-16 text-center text-foreground/20 font-medium">No stories yet.</div>
      ) : (
        <div className="divide-y divide-black/[0.03]">
          {stories.map((s) => (
            <div key={s.id} className="p-6 flex gap-6 items-center hover:bg-[#F7F9FB] transition-colors">
              <div className="w-20 h-20 rounded-2xl bg-primary/5 overflow-hidden flex-shrink-0">
                {s.photoUrl ? (
                  <img src={resolveImageUrl(s.photoUrl)} className="w-full h-full object-cover" alt="Story" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Heart size={24} className="text-primary/20" /></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground">{s.groomName} & {s.brideName}</h4>
                <p className="text-xs text-foreground/40 line-clamp-2">{s.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
