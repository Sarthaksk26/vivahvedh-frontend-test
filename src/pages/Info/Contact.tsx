import { useState } from 'react';
import apiClient from '../../lib/apiClient';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { SUPPORT_PHONE, SUPPORT_EMAIL, WHATSAPP_DISPLAY, getWhatsAppUrl } from '../../lib/constants';
import { SEO } from '../../components/common/SEO';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/public/contact', formData);
      setSent(true);
      toast.success("Message sent successfully!");
    } catch (err) {
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FFFCF5 0%, #FFF8EB 50%, #FFFCF5 100%)' }}>
      <SEO title="संपर्क | Vivahvedh" description="Vivahvedh शी संपर्क साधा." />
      
      {/* Hero Banner */}
      <div className="relative py-16 text-center">
        <span className="text-haldi-500 text-xs font-ui font-bold uppercase tracking-[0.3em] mb-3 block">मदत • Support</span>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">आमच्याशी संपर्क साधा</h1>
        <p className="text-muted-foreground text-base font-sans max-w-md mx-auto">
          Have a question about subscriptions, profiles, or account? Drop us a message below.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Contact Info Cards */}
          <div className="md:col-span-2 space-y-5">
            {[
              { icon: <Phone size={20} />, label: 'फोन', value: SUPPORT_PHONE, sub: 'Call Us', href: `tel:${SUPPORT_PHONE.split(',')[0].trim().replace(/\s/g, '')}` },
              { icon: <MessageCircle size={20} />, label: 'व्हॉट्सॲप', value: WHATSAPP_DISPLAY, sub: 'WhatsApp', href: getWhatsAppUrl(), isWhatsApp: true },
              { icon: <Mail size={20} />, label: 'ईमेल', value: SUPPORT_EMAIL, sub: 'Email Us', href: `mailto:${SUPPORT_EMAIL}` },
              { icon: <MapPin size={20} />, label: 'कार्यालय', value: 'पुणे, महाराष्ट्र', sub: 'Visit Us' },
            ].map((item, i) => (
              <a key={i} href={item.href || '#'} target={item.href?.startsWith('https') ? '_blank' : undefined} rel={item.href?.startsWith('https') ? 'noopener noreferrer' : undefined}
                className={`bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-border shadow-sm-soft group hover:shadow-md-soft transition-all duration-500 block ${!item.href ? 'pointer-events-none' : ''}`}
              >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      (item as any).isWhatsApp 
                        ? 'bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white'
                        : 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white'
                    }`}>
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-foreground/30">{item.sub}</span>
                      <p className="text-base font-bold text-foreground font-sans mt-1">{item.value}</p>
                    </div>
                  </div>
                </a>
            ))}

            {/* Cultural decoration */}
            <div className="flex items-center gap-3 pt-4">
              <div className="w-8 h-px bg-haldi-500/30" />
              <span className="text-xs text-haldi-500/60 font-display italic">॥ आम्ही मदतीला तयार ॥</span>
              <div className="w-8 h-px bg-haldi-500/30" />
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            {sent ? (
              <div className="bg-paan-500/5 border border-paan-500/20 p-10 rounded-3xl text-center shadow-sm-soft">
                <div className="w-16 h-16 bg-paan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-paan-500" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2 text-paan-600">संदेश प्राप्त झाला!</h2>
                <p className="text-foreground/60 font-sans">Our support team will connect with you via email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-premium space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-kumkum-500 via-haldi-500 to-kumkum-500" />
                
                <div className="space-y-2">
                  <label className="text-sm font-ui font-bold text-foreground/80">पूर्ण नाव (Full Name) *</label>
                  <input required type="text" className="input-cultural" onChange={e => setFormData({...formData, name: e.target.value})} placeholder="तुमचे नाव" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-ui font-bold text-foreground/80">ईमेल (Email) *</label>
                    <input required type="email" className="input-cultural" onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-ui font-bold text-foreground/80">मोबाईल (Mobile) *</label>
                    <input required type="text" className="input-cultural" onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-ui font-bold text-foreground/80">संदेश (Message) *</label>
                  <textarea required className="w-full min-h-[140px] rounded-xl border border-input bg-white p-4 text-sm font-sans placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all" onChange={e => setFormData({...formData, message: e.target.value})} placeholder="तुमचा संदेश लिहा..." />
                </div>

                <button type="submit" className="w-full py-3.5 text-white font-ui font-bold rounded-xl transition-all text-sm shadow-kumkum flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #C41E2A 0%, #8B1218 100%)' }}
                >
                  <Send size={16} />
                  संदेश पाठवा — Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
